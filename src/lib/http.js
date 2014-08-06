
angular
    .module('tl')
    .factory('tlInterceptor', ['tl.config', 'tl.keychain', function(config, keychain){
        return {
            request: function(data) {
                var token = keychain.authToken();
                if (token && data.url.indexOf(config.API) >= 0) {
                    data.url = data.url + '&auth=' + token;
                }
                return data;
            }
        }
    }])
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.interceptors.push('tlInterceptor');
    }])
    .factory('tl.http', ['$http', 'tl.keychain', 'tl.config', function($http, keychain, config){
        
        var HTTP = function(){};

        HTTP.prototype.get = function(endpoint, params) {
            return $http.get(this.apiUrl(endpoint, params));
        };

        HTTP.prototype.post = function(endpoint, body, headers) {
            return $http.post(this.apiUrl(endpoint), body, headers);
        };

        HTTP.prototype.put = function(endpoint, body, headers) {
            return $http.put(this.apiUrl(endpoint), body, headers);
        };

        HTTP.prototype.delete = function(endpoint, params) {
            return $http.delete(this.apiUrl(endpoint, params));  
        };

        HTTP.prototype.upload = function(endpoint, body) {
            return this.post(endpoint, body, {
                headers: {'Content-Type': undefined },
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
                var param = key + '=' + encodeURIComponent(val);
                data.push(param);
            }

            // create url
            var url = config.API + endpoint;
            url += '?' + data.join('&');
            return url;
        };

        return new HTTP();
    }]);
