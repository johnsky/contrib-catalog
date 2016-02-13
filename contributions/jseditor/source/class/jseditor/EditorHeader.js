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
qx.Class.define("jseditor.EditorHeader",
{
  extend: qx.app.ui.AppView,
  
  construct : function()
  {
    try
    {
      this.base(arguments);
      
      var dec = new qx.ui.decoration.Decorator().set({
        widthBottom : 1,
        colorBottom : "border-separator"
      });
      
      this.set({
        padding: 5,
        allowGrowX: true,
        allowGrowY: true,
        backgroundColor: "white",
        decorator: dec,
        layout: new qx.ui.layout.HBox(10)
      });
      
      var label = this._createControlById("header-label");
      var error = this._createControlById("header-error");
      this.add(label);
      this.add(error);      
    }
    catch(ex)
    {
      this.error("Ctor", ex);
    }    
  },

  members: 
  {
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
        case "header-label":
          control = new qx.ui.basic.Label(this.tr("Source Code")).set({font: "bold"});
          break;
          
        case "header-error":
          control = new qx.ui.basic.Label().set({textColor: "red"});
          break;
      }
      
      return control;
    }
  }
});