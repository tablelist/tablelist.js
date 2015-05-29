angular
  .module('tl')
  .factory('tl.keychain', ['tl.cookie', 'tl.utils', 'tl.config',
    function(cookie, utils, config) {
      'use strict';

      // constants

      var SUFFIX = config.ENV_PROD ? '' : '_dev';
      var AUTH_KEY = 'tl_auth' + SUFFIX;
      var PROSPECT_KEY = 'tl_prospect' + SUFFIX;

      // in-memory auth and prospect tokens

      var _authToken = null;
      var _prospectToken = null;

      // service

      var Keychain = function() {};

      Keychain.prototype.authToken = function() {
        return _authToken || (function(){
          _authToken = cookie.get(AUTH_KEY);
          return _authToken;
        })();
      };

      Keychain.prototype.setAuthToken = function(token) {
        _authToken = token || null;
        return cookie.set(AUTH_KEY, token);
      };

      Keychain.prototype.prospectToken = function() {
        var token = _prospectToken || (function(){
          _prospectToken = cookie.get(PROSPECT_KEY);
          return _prospectToken;
        })();
        if (!token) {
          token = utils.guid(16, '-');
          this.setProspectToken(token);
        }
        return token;
      };

      Keychain.prototype.setProspectToken = function(token) {
        _prospectToken = token || null;
        return cookie.set(PROSPECT_KEY, token);
      };

      return new Keychain();
    }
  ]);
