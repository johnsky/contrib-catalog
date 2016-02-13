/* ************************************************************************

   Copyright: Mazda Sollers Manufacturing Rus

   License:

   Authors: Ivan Pogorelov

************************************************************************ */

/**
 * Application widget registry
 */
qx.Mixin.define("qx.app.MWidgetRegistry",
{
  properties :
  {
    id : {
      check : "String",
      apply : "_applyId",
      nullable : true,
      init : null
    }
  },

  members :
  {
    _applyId : function(id, oldId)
    {
      var statics = qx.app.MWidgetRegistry;
      if (oldId) {
        statics.unregister(this, oldId);
      }
      if (id) {
        statics.register(this, id);
      }
    },

    getWidgetById : function(id)
    {
      return qx.app.MWidgetRegistry.getWidgetById(id);
    }
  },

  statics :
  {
    __objectDb : {},

    has: function(id)
    {
      if(id in this.__objectDb)
      {
        return true;
      }

      return false;
    },

    /**
     * Returns the widget registered under the given id by {@link #register}
     *
     * @param id {String} the id of the widget
     * @return {qx.ui.core.Widget} the widget.
     */
    getWidgetById : function(id)
    {
      return this.__objectDb[id];
    },

    /**
     * Registers a widget under the given widget id to be used with
     * {@link #getWidgetById}.
     *
     * @param widget {qx.ui.core.Widget} the widget to register
     * @param id {String} the id of the widget.
     */
    register : function(object, id)
    {
      if (this.__objectDb[id]) {
        throw new Error("An object with the id '"+id+"' already exists.");
      }
      this.__objectDb[id] = object;
    },

    unregister : function(object, id)
    {
      if (this.__objectDb[id] !== object) {
        throw new Error("The object is not registered with the id '"+id+"'.");
      }
      delete(this.__objectDb[id]);
    }
  }
});
