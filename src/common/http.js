
var API_URL = 'https://api-dev.tablelist.com';

angular
	.module('tl')
    .factory('tl.http', ['$http', 'tl.auth', function($http, auth){
        
        var HTTP = function(){};

        HTTP.prototype.get = function(endpoint, params) {
            return $http.get(this.apiUrl(endpoint, params));
        }

        HTTP.prototype.post = function(endpoint, body, headers) {
            return $http.post(this.apiUrl(endpoint), body, headers);
        }

        HTTP.prototype.put = function(endpoint, body, headers) {
            return $http.put(this.apiUrl(endpoint), body, headers);
        }

        HTTP.prototype.del = function(endpoint, params) {
            return $http.delete(this.apiUrl(endpoint, params));
        }

        HTTP.prototype.upload = function(endpoint, body) {
            return this.post(endpoint, body, {
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            });
        }

        HTTP.prototype.apiUrl = function(endpoint, params) {
            params = params || {};
            
            // add auth token if we have it
            var authToken = auth.authToken();
            if (authToken) {
                params['auth'] = authToken;
            }

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
            var url = API_URL + endpoint;
            if (data.length) {
                url += '?' + data.join('&');
            }
            return url;
        }

        return new HTTP();
    }]);

