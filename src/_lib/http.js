
angular
    .module('tl')
    .factory('tlHTTPInterceptor', ['tl.config', 'tl.keychain', function(config, keychain){
        return {
            request: function(data) {
                var token = keychain.authToken();
                var isApi = data.url.indexOf(config.API) >= 0;
                if (token && isApi) {
                    data.url = data.url + '&auth=' + token;
                }
                if (!token && isApi) {
                    var ptoken = keychain.prospectToken();
                    data.url = data.url + '&prospect=' + ptoken;
                }
                if (config.CLIENT) {
                    var client = config.CLIENT;
                    data.url = data.url + '&client=' + client;
                }
                return data;
            }
        }
    }])
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.interceptors.push('tlHTTPInterceptor');
    }])
    .factory('tl.http', ['$http', 'tl.keychain', 'tl.config', function($http, keychain, config){
        
        var HTTP = function(){};

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

        HTTP.prototype.upload = function(endpoint, body) {
            return this.post(endpoint, body, {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            });
        };

        HTTP.prototype.apiUrl = function(endpoint, params) {
            params = params || {};
            
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
            url += '?' + data.join('&');
            return url;
        };

        return new HTTP();
    }]);
