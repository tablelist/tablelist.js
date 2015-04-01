/**
 * Angular module for setting, reading and removing cookies
 *
 * @src: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 */
angular
  .module('tl')
  .factory('tl.cookie', ['tl.config', 'tl.storage', function(config, storage) {

    var DOMAIN = '.tablelist.com';

    var Cookie = function() {};

    Cookie.prototype.get = function(sKey) {
      var obj = storage.get(sKey);
      var sval = obj ? obj.cookie : null;
      var cval = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      return sval || cval;
    };

    Cookie.prototype.set = function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sValue) return this.remove(sKey, sPath, sDomain);
      storage.set(sKey, {
        cookie: sValue
      });
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }
      if (!sPath) sPath = '/';
      if (!vEnd) vEnd = Infinity;
      if (!sDomain) sDomain = DOMAIN;
      if (config.ENV_PROD) bSecure = true;
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      var cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      document.cookie = cookie;
      return true;
    };

    Cookie.prototype.remove = function(sKey, sPath, sDomain) {
      if (!sDomain) sDomain = DOMAIN;
      storage.remove(sKey);
      if (!sKey || !this.exists(sKey)) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    };

    Cookie.prototype.exists = function(sKey) {
      return storage.exists(sKey) || (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };

    return new Cookie();
  }]);
