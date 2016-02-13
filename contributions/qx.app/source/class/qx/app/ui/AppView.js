/* ************************************************************************

   Copyright: Mazda Sollers Manufacturing Rus

   License:

   Authors: Ivan Pogorelov

************************************************************************ */

/**
 *  Application view 
 *
 */
qx.Class.define("qx.app.ui.AppView",
{
  extend : qx.ui.container.Composite,
  include: [qx.app.ui.MAppView],

  /**
   * Ctor
   *
   */
  construct : function()
  {
    this.base(arguments);
    this._controlMap = {};
    this.addListener("addChildWidget", function(e) {
      if(qx.core.Environment.get("appview.controladd"))
      {
        this.debug("Added child", e.getData());
      }
    }, this);    
  },

  properties:
  {

  },

  members:
  {
    /**
     * Create control by id. It is similar to ui.Widget internal infrastructure, but..
     *
     * @param id {String} Control id
     */
    _createControlByIdImpl : function(id)
    {
      this.warn("Not implemented _createControlByIdImpl()");
    }
  }
});