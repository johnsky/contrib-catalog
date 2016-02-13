/* ************************************************************************

   Copyright: Mazda Sollers Manufacturing Rus

   License:

   Authors: Ivan Pogorelov

************************************************************************ */

/**
 * 
 */
qx.Mixin.define("qx.app.ui.MAppView",
{
  properties:
  {
    readOnly:
    {
      init: true,
      check: "Boolean",
      event: "changeReadOnly",
      apply: "_applyReadOnly"
    }
  },

  members:
  {
    _controlMap : null,

    _createControlById : function(id)
    {
      if(this._controlMap == null)
      {
        this._controlMap = {};
      }

      if(qx.core.Environment.get("appview.controlcreate"))
      {
        this.debug("Create control by id", id);
      }
      
      try
      {
        var control = this._createControlByIdImpl(id);
        this._controlMap[id] = control;

        if(qx.core.Environment.get("appview.controlcreate"))
        {
          this.debug("->Control created. id: '"+ id+ "', instance:", control);
        }          
      }
      catch(ex)
      {
        this.error("->An error during control creation", ex);
      }
      return control;
    },

    _getControlById : function(id)
    {
      return this._controlMap[id];
    },

    _applyReadOnly: function(value, old)
    {
      // nothing
    },

    getControlById: function(id)
    {
      return this._getControlById(id);
    }
  }
});