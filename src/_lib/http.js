angular
  .module('tl')
  .factory('tlHTTPInterceptor', ['tl.config', 'tl.keychain', function(config, keychain) {
    'use strict';

    return {
      request: function(data) {
        data.headers = data.headers || {};

        var token = keychain.authToken();
        var isApi = data.url.indexOf(config.API) >= 0;
        var hasParams = data.url.indexOf('?') >= 0;
        if (isApi && !hasParams) {
          data.url = data.url += '?';
        }
        if (isApi && token) {
          if (config.useAuthHeader) data.headers['x-access-token'] = token;
          else data.url = data.url + '&auth=' + token;
        }
        if (isApi && !token) {
          var ptoken = keychain.prospectToken();
          data.url = data.url + '&prospect=' + ptoken;
        }
        if (isApi && config.CLIENT) {
          var client = config.CLIENT;
          var subClient = config.SUB_CLIENT;
          if (subClient) {
            client = client + '-' + subClient;
          }
          data.url = data.url + '&client=' + client;
        }
        if (isApi && config.VERSION) {
          var version = config.VERSION;
          data.url = data.url + '&version=' + version;
        }
        data.url = data.url.replace('?&', '?');
        return data;
      }
    }
  }])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('tlHTTPInterceptor');
  }])
  .factory('tl.http', ['$http', 'tl.keychain', 'tl.config', function($http, keychain, config) {

    var HTTP = function() {};

    HTTP.prototype.get = function(endpoint, params) {
      return $http.get(this.apiUrl(endpoint, params));
    };

    HTTP.prototype.post = function(endpoint, body, options) {
      return $http.post(this.apiUrl(endpoint), body, options);
    };

    HTTP.prototype.put = function(endpoint, body, options) {
      return $http.put(this.apiUrl(endpoint), body, options);
    };

    HTTP.prototype.delete = function(endpoint, params) {
      return $http.delete(this.apiUrl(endpoint, params));
    };

    HTTP.prototype.upload = function(endpoint, query, body) {
      return $http.post(this.apiUrl(endpoint, query), body, {
        headers: {
          'Content-Type': undefined
        },
        transformRequest: angular.identity
      });
    };

    HTTP.prototype.apiUrl = function(endpoint, params) {
      params = params || {};

      // use leading slash
      if (endpoint.slice(0, 1) != '/') {
        endpoint = '/' + endpoint;
      }

      // create url parameter string
      var data = [];
      var keys = Object.keys(params);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = params[key];
        var param = encodeURIComponent(key) + '=' + encodeURIComponent(val);
        data.push(param);
      }

      // create url
      var url = config.API + endpoint;
      if (data.length > 0) {
        url += '?' + data.join('&');
      }
      return url;
    };

    return new HTTP();
  }]);
