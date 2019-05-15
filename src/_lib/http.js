angular
  .module('tl')
  .factory('tlHTTPInterceptor', [
    'tl.config',
    'tl.keychain',
    '$rootScope',
    '$q',
    function(config, keychain, $rootScope, $q) {
      'use strict';

      return {
        request: function(data) {
          var headers = data.headers || {};

          var authToken = keychain.authToken();
          var prospectToken = keychain.prospectToken();

          if (authToken) {
            headers['x-access-token'] = authToken;
          } else {
            headers['x-prospect-token'] = prospectToken;
          }

          if (config.apiKey) {
            headers['api-key'] = config.apiKey;
          }

          if (config.apiKey) {
            headers['api-key'] = config.apiKey;
          }

          data.headers = headers;

          return data;
        },
        responseError: function(response) {
          if (response.status === 401) {
            $rootScope.$emit('unauthorized');
          }
          return $q.reject(response);
        }
      };
    }
  ])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('tlHTTPInterceptor');
  }])
  .factory('tl.http', ['$http', 'tl.keychain', 'tl.config', function($http, keychain, config) {

    var HTTP = function() {};

    HTTP.prototype.get = function(endpoint, params, options) {
      options = options || {};
      options.headers = buildHeaders(options.headers);
      return $http.get(this.apiUrl(endpoint, params), options);
    };

    HTTP.prototype.post = function(endpoint, body, options) {
      options = options || {};
      options.headers = buildHeaders(options.headers);
      return $http.post(this.apiUrl(endpoint), body, options);
    };

    HTTP.prototype.put = function(endpoint, body, options) {
      options = options || {};
      options.headers = buildHeaders(options.headers);
      return $http.put(this.apiUrl(endpoint), body, options);
    };

    HTTP.prototype.delete = function(endpoint, params, options) {
      options = options || {};
      options.headers = buildHeaders(options.headers);
      return $http.delete(this.apiUrl(endpoint, params), options);
    };

    HTTP.prototype.upload = function(endpoint, query, body, options) {
      options = options || {};
      options.headers = buildHeaders(options.headers);
      options.headers['Content-Type'] = undefined;

      options.transformRequest = angular.identity;
      return $http.post(this.apiUrl(endpoint, query), body, options);
    };

    HTTP.prototype.apiUrl = function(endpoint, params) {
      return buildUrl(config.API, endpoint, params);
    };

    HTTP.prototype.wsUrl = function(endpoint, params) {
      return buildUrl(config.WS, endpoint, params);
    };

    function buildUrl(base, endpoint, params) {
      params = params || {};

      // use leading slash
      if (endpoint.slice(0, 1) !== '/') {
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
      var url = base + endpoint;
      if (data.length > 0) {
        url += '?' + data.join('&');
      }
      return url;
    }

    function buildHeaders(headers) {
      headers = headers || {};

      var client = config.CLIENT;
      var subClient = config.SUB_CLIENT;
      if (subClient) {
        client = client + '-' + subClient;
      }
      headers['x-client-type'] = client;

      return headers;
    }

    return new HTTP();
  }]);
