/* ************************************************************************

   Copyright: Mazda Sollers Manufacturing Rus

   License:

   Authors: Ivan Pogorelov

************************************************************************ */

qx.Class.define("qx.app.ui.action.Action",
{
  extend : qx.core.Object,

  construct: function()
  {
    this.base(arguments);

    this.addListener("begin", this._onBegin, this);
    this.addListener("end", this._onEnd, this);
  },

  properties :
  {
    useBlocker:
    {
      init: false,
      check: "Boolean"
    }
  },

  events:
  {
    begin: "qx.event.type.Data",
    end: "qx.event.type.Data"
  },

  members:
  {

    /**
     * Запустить дейсвтие
     */
    run: function()
    {
      try
      {
        this.fireDataEvent("begin", null);
        this._runImpl();
      }
      catch(ex)
      {
        this.error("Running ui action", ex);
      }
      finally
      {

      }
    },

    /**
     *
     * @abstract
     */
    _runImpl: function()
    {
      throw "Not implemented";
    },

    _onBegin: function()
    {
      if(this.getUseBlocker())
      {
        qx.app.LoadingIndicator.getInstance().show();
      }

      this.debug("The action was started.");
    },

    _onEnd: function()
    {
      if(this.getUseBlocker())
      {
        qx.app.LoadingIndicator.getInstance().hide();
      }

      this.debug("The action has been finished.");
    }
  }
});
