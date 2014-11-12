angular
  .module('tl')
  .factory('tl.keychain', ['tl.cookie', 'tl.utils', 'tl.config',
    function(cookie, utils, config) {
      'use strict';

      var SUFFIX = config.ENV_PROD ? '' : '_dev';
      var AUTH_KEY = 'tl_auth' + SUFFIX;
      var PROSPECT_KEY = 'tl_prospect' + SUFFIX;

      var Keychain = function() {};

      Keychain.prototype.authToken = function() {
        return cookie.get(AUTH_KEY);
      };

      Keychain.prototype.setAuthToken = function(token) {
        return cookie.set(AUTH_KEY, token);
      };

      Keychain.prototype.prospectToken = function() {
        var token = cookie.get(PROSPECT_KEY);
        if (!token) {
          token = utils.guid(16, '-');
          this.setProspectToken(token);
        }
        return token;
      };

      Keychain.prototype.setProspectToken = function(token) {
        return cookie.set(PROSPECT_KEY, token);
      };

      return new Keychain();
    }
  ]);
