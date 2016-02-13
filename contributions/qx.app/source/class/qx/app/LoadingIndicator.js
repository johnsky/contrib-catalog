/* ************************************************************************

   Copyright: Mazda Sollers Manufacturing Rus

   License:

   Authors: Ivan Pogorelov

************************************************************************ */

/* ************************************************************************


************************************************************************ */

/**
 * It shows loading indicator over widget 'container' get by id from widget registry
 *
 * @asset(qx/app/*)
 */
qx.Class.define("qx.app.LoadingIndicator",
{
  type : "singleton",
  extend : qx.core.Object,

  construct: function()
  {
    this.__createBlocker();
  },

  members :
  {
    __blocker : null,

    __createBlocker: function()
    {
      this.__blocker = new qx.ui.core.Blocker(qx.app.MWidgetRegistry.getWidgetById("container"));

      var uri = qx.util.ResourceManager.getInstance().toUri('qx/app/loading.gif');
      this.__blocker.getBlockerElement().setStyle('background','rgb(213, 213, 213) url("'+uri+'") no-repeat scroll center center');
      this.__blocker.getBlockerElement().setStyle('opacity','0.7');
    },

    show : function(msg)
    {
      if(msg)
      {
        var label = this.__blocker.getBlockerElement().getChild(1);
        label.setValue("<b>"+msg+"</b>");
      }

      this.__blocker.block();
    },

    hide : function()
    {
      this.__blocker.unblock();
    },

    isShown: function()
    {
      return this.__blocker.isBlocked();
    }
  }
});
