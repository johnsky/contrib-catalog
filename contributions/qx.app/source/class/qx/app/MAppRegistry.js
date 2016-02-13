/* ************************************************************************

   Copyright: Mazda Sollers Manufacturing Rus

   License:

   Authors: Ivan Pogorelov

************************************************************************ */

/**
 * Application object registry
 */
qx.Mixin.define("qx.app.MAppRegistry",
{
  properties :
  {
    /**
     * Object id in registry
     */
    regId : {
      check : "String",
      apply : "_applyRegId",
      nullable : true,
      init : null
    }
  },

  members :
  {
    _applyRegId : function(id, old)
    {
      var statics = qx.app.MAppRegistry;
      if (old)
      {
        statics.unregister(this, old);
      }

      if (id)
      {
        statics.register(this, id);
      }
    },

    getObjectById : function(id)
    {
      return qx.app.MAppRegistry.getObjectById(id);
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
     * Returns the object registered under the given id by {@link #register}
     *
     * @param id {String} the id of the object
     * @return {Object} the object.
     */
    getObjectById : function(id)
    {
      return this.__objectDb[id];
    },

    /**
     * Registers an object under the given object id to be used with
     * {@link #getObjectById}.
     *
     * @param object {Object} the object to register
     * @param id {String} the id of the object.
     */
    register : function(object, id)
    {
      if (this.__objectDb[id]) {
        throw new Error("An object with the id '"+id+"' already exists.");
      }
      this.__objectDb[id] = object;
    },

    /**
     * Unregister an object
     *
     * @param object {Object} the object to register
     * @param id {String} the id of the object.
     */
    unregister : function(object, id)
    {
      if (this.__objectDb[id] !== object) {
        throw new Error("The object is not registered with the id '"+id+"'.");
      }
      delete(this.__objectDb[id]);
    }
  }
});
