/**
 * Angular module for setting, reading and removing cookies
 *
 * @src: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 */
angular
  .module('tl')
  .factory('tl.cookie', ['$cookies', 'tl.config', function($cookies, config) {

    var DOMAIN = '.tablelist.com';

    var Cookie = function() {};

    Cookie.prototype.get = function(key) {
      if (!key) throw new Error('jsSdk.cookie - get() - key is required');
      return $cookies.get(key);
    };

    Cookie.prototype.set = function(key, value) {
      if (!key) throw new Error('jsSdk.cookie - set() - key is required');
      if (!value) throw new Error('jsSdk.cookie - set() - value is required');

      var secure = config.ENV_PROD;

      var expires = 'Fri, 31 Dec 9999 23:59:59 GMT';

      $cookies.put(key, value, {
        domain: DOMAIN,
        secure : secure,
        expires : expires,
      });

      return true;
    };

    Cookie.prototype.remove = function(key) {
      if (!key) throw new Error('jsSdk.cookie - remove() - key is required');

      var secure = config.ENV_PROD;

      // update the cookie's expiration date to date in the past
      var expires = 'Thu, 01 Jan 1970 00:00:00 GMT';

      $cookies.remove(key, {
        domain: DOMAIN,
        secure : secure,
        expires : expires,
      });

      return true;
    };

    Cookie.prototype.exists = function(key) {
      return (typeof this.get(key) !== 'undefined');
    };

    return new Cookie();
  }]);
