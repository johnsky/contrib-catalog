/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * 
 *
 * @asset(jseditor/*)
 */
qx.Class.define("jseditor.AceEditor",
{
  extend: qx.app.ui.AppView,
  include: qx.ui.core.MBlocker,
  
  construct : function()
  {
    try
    {
      this.base(arguments);
      this.initAfterAceLoaded();
    }
    catch(ex)
    {
      this.error("Ctor", ex);
    }
  },

  properties:
  {
    /**
     * 
     */
    caption: 
    {
      init: "Source Code",
      event: "changeCaption"
    },
    
    /**
     * 
     */
    errorMessage: 
    {
      init: "",
      event: "changeErrorMessage"
    },
    
    /**
     * Highlight feature enabled/disabled 
     */
    highlight:
    {
      init: true,
      event: "changeHighlight",
      check: "Boolean",
      apply: "_applyHighlight"
    }
  },
  
  members :
  {
    /**
     * ACE editor insatnce
     */
    __ace : null,

    /**
     * Create controls
     *
     * @param id {String} Control id
     */
    _createControlByIdImpl : function(id)
    {
      var control;
      switch(id)
      {
        case "header":
          control = new jseditor.EditorHeader(); 
          break;
          
        case "body-area":
          control = new qx.ui.form.TextArea().set({
            wrap: false,
            font: qx.bom.Font.fromString("14px monospace"),
            backgroundColor: "white",
            padding: [0,0,0,5],
            decorator: null
          });
          break;
          
        case "ace-widget":
          control = new qx.ui.core.Widget();
          control.addListenerOnce("appear", function() {
            this.__onEditorAppear();
          }, this);
      
          control.setVisibility("excluded");
          break; 
      }
        
      return control;
    },
    
    initAfterAceLoaded: function() {
      var resource = [
        "jseditor/ace/ace.js",
        "jseditor/ace/theme-eclipse.js",
        "jseditor/ace/mode-javascript.js",
        "jseditor/ace/ext-language_tools.js"        
      ];
      
      var load = qx.lang.Function.bind(function(list) {
        if (list.length == 0) 
        {
          this.init();
          return;
        }
        
        var res = list.shift();
        var uri = qx.util.ResourceManager.getInstance().toUri(res);
        var loader = new qx.bom.request.Script();
        loader.onload = function() {
          load(list);
        };
        loader.open("GET", uri);
        loader.send();
      },this);
      
      //start loading ace
      load(resource);
    },
    
    /**
     * The constructor was spit up to make the included mixin available during
     * the init process.
     */
    init: function()
    {
      this.set({
        backgroundColor: "white",
        layout: new qx.ui.layout.VBox(),
        decorator: "main"  
      });
      
      // If widgets are added to the container, the zIndex of the editor blocker
      // is set to 100. This makes possible to resize the splitpanes
      this.addListener("addChildWidget", function(e) {
        this.getBlocker().getBlockerElement().setStyles({ "zIndex" : 100 });
      }, this);

      var header = this._createControlById("header");
      var bodyArea = this._createControlById("body-area");
      var ace = this._createControlById("ace-widget");
      
      this.add(header);
      this.add(bodyArea);
      this.add(ace, { flex : 1 });
        
      // binding stuff
      this.bind("caption", header.getControlById("header-label"), "value");
      this.bind("errorMessage", header.getControlById("header-error"), "value");
      
      // override the focus border CSS of the editor
      qx.bom.Stylesheet.createElement(
        ".ace_editor {border: 0px solid #9F9F9F !important;}"
      );

      // chech the initial highlight state
      var shouldHighligth = qx.bom.Cookie.get("playgroundHighlight") !== "false";
      this.setHighlight(shouldHighligth);
    },      
    
    /**
     * This code part uses the ajax.org code editor library to add a
     * syntax-highlighting editor as an textarea replacement
     *
     * @ignore(ace.edit, ace.require)
     */
    __onEditorAppear : function() {
      // timout needed for chrome to not get the ACE layout wrong and show the
      // text on top of the gutter
      qx.event.Timer.once(function() {
        var aceWidget = this.getControlById("ace-widget");
        var aceElement = aceWidget.getContentElement().getDomElement();
        var bodyArea = this.getControlById("body-area"); 
        this.debug("appear");
        // create the ACE editor
        var editor = this.__ace = ace.edit(aceElement);
        editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        });
        
        var langTools = ace.require("ace/ext/language_tools");
        
        // set javascript mode
        var jsModeClazz = ace.require("ace/mode/javascript").Mode;
        editor.getSession().setMode(new jsModeClazz());
        // add completer        
        var completer = new jseditor.EditorAutocomplete();
        langTools.addCompleter(completer); 
        
        // configure the editor
        var session = editor.getSession();
        session.setUseSoftTabs(true);
        session.setTabSize(2);        
        
        // copy the inital value
        session.setValue(bodyArea.getValue() || "");

        var self = this;
        // append resize listener
        aceWidget.addListener("resize", function() {
          // use a timeout to let the layout queue apply its changes to the dom
          window.setTimeout(function() {
            self.__ace.resize();
          }, 0);
        });
      }, this, 500);
    },
    
    /**
     * Returns the current set code of the editor.
     * @return {String} The current set text.
     */
    getCode : function() {
      if (this.getHighlight() && this.__ace) 
      {
        return this.__ace.getSession().getValue();
      } 
      else 
      {
        return this.getControlById("body-area").getValue();
      }
    },

    /**
     * Sets the given code to the editor.
     * @param code {String} The new code.
     */
    setCode : function(code) {
      if (this.__ace) {
        this.__ace.getSession().setValue(code);

        // move cursor to start to prevent scrolling to the bottom
        this.__ace.renderer.scrollToX(0);
        this.__ace.renderer.scrollToY(0);
        this.__ace.selection.moveCursorFileStart();
      }
      
      this.getControlById("body-area").setValue(code);
    },
    
    /**
     * Displays the given error in the caption bar.
     * @param ex {Exception} The exception to display.
     */
    setError : function(ex) {
      this.setErrorMessage(ex ? ex.toString() : "");
    },
    
    /**
     * Switches between the ajax code editor editor and a plain textarea.
     * @param value {Boolean} True, if the code editor should be used.
     */
    _applyHighlight : function(value) {
      this.debug("highlight", value);
      var aceWidget = this.getControlById("ace-widget");
      var bodyArea = this.getControlById("body-area");
      
      if (value) {
        // change the visibility
        aceWidget.setVisibility("visible");
        bodyArea.setVisibility("excluded");

        // copy the value, if the editor already availabe
        if (this.__ace) {
          this.__ace.getSession().setValue(bodyArea.getValue());
        }
      }
      else 
      {
        // change the visibility
        aceWidget.setVisibility("excluded");
        bodyArea.setVisibility("visible");

        // copy the value, if the editor already availabe
        if (this.__ace) {
          bodyArea.setValue(this.__ace.getSession().getValue());
        }
      }
    }    
  }
});