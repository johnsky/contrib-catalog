/* ************************************************************************

   Copyright: Mazda Sollers Manufacturing Rus

   License:

   Authors: Ivan Pogorelov

************************************************************************ */

/**
 * Request with callback for success event.
 *
 */
qx.Class.define("qx.app.io.RequestWithCallback",
{
  extend : qx.io.request.Xhr,

  /**
   * Creates the <code>qx.app.io.RequestWithCallback</code> with passed parameters.
   *
   * @param url {String}
   * @param method {String}
   * @param callback {Function} the function is look like: function(that, responseText){...}
   */
  construct : function(url, method, callback)
  {
    this.base(arguments, url, method);

    var handler = qx.lang.Function.bind(this.__success, this, callback);
    this.addListener('success', handler, this);
    this.addListener("error", this.__error, this);
  },

  members:
  {
    __error : function(e)
    {
      try
      {
        var xhr = e.getTarget();
        this.error("qx.app.io.RequestWithCallback", xhr.getResponseText());
      }
      catch(ex)
      {
        this.error("__error()", ex, arguments);
      }
    },

    __success : function(callback, e)
    {
      try
      {
        var xhr = e.getTarget();
        var raw = xhr.getResponseText();

        if(qx.core.Environment.get("app.log.response"))
        {
          this.debug("Response text", raw);
        }

        if (raw && callback)
        {
          callback(xhr, raw);
        }
      }
      catch(ex)
      {
        this.error("__success()", ex, arguments);
      }
    }
  }
 });
