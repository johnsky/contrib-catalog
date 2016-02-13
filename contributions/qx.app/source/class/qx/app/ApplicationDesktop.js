/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* ************************************************************************


************************************************************************ */

/**
 * This is the main application class of your custom application
 *
 * @require(qx.module.Core)
 * @asset(qx/app/*)
 */
qx.Class.define("qx.app.ApplicationDesktop",
{
  extend : qx.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Configures logging facilities of an application
     */
    _initLogging : function()
    {
      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }
    },

    /**
     * Creates inline application root.
     *
     * @return {qx.ui.root.Inline} inline root instance or null if something goes wrong
     */
    _createRoot : function()
    {
      try
      {

        // ui container
        var container = new qx.ui.container.Composite(new qx.ui.layout.VBox());
        qx.app.MWidgetRegistry.register(container, "container");
        this.getRoot().add(container,  {edge:0});
      }
      catch(ex)
      {
        this.error("_createRoot(): Failed to create desktop application root.", ex);
      }

      return null;
    },

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function()
    {
      this.base(arguments);
    }
  }
});
