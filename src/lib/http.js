
angular
	.module('tl')
    .factory('tl.http', ['$http', 'tl.keychain', 'tl.config', function($http, keychain, config){
        
        var HTTP = function(){};

        HTTP.prototype.get = function(endpoint, params) {
            if (config.ENV_TEST) {
                return this.testGET(endpoint, params);
            } else {
                return $http.get(this.apiUrl(endpoint, params));
            }
        };

        HTTP.prototype.post = function(endpoint, body, headers) {
            if (config.ENV_TEST) {
                return this.testPOST(endpoint, body, headers);
            } else {
                return $http.post(this.apiUrl(endpoint), body, headers);
            }
        };

        HTTP.prototype.put = function(endpoint, body, headers) {
            if (config.ENV_TEST) {
                return this.testPUT(endpoint, body, headers);
            } else {
                return $http.put(this.apiUrl(endpoint), body, headers);   
            }
        };

        HTTP.prototype.delete = function(endpoint, params) {
            if (config.ENV_TEST) {
                return this.testDELETE(endpoint, params);
            } else {
                return $http.delete(this.apiUrl(endpoint, params));   
            }
        };

        HTTP.prototype.upload = function(endpoint, body) {
            return this.post(endpoint, body, {
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            });
        };

        HTTP.prototype.apiUrl = function(endpoint, params) {
            params = params || {};
            
            // add auth token if we have it
            var authToken = keychain.authToken();
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
            var url = config.API + endpoint;
            if (data.length) {
                url += '?' + data.join('&');
            }
            return url;
        };

        /*==========================================================*
         * Unit Testing - uses JQuery ajax methods
         *==========================================================*/

        HTTP.prototype.testAJAX = function(method, endpoint, data) {
            return $.ajax({
                type: method,
                url: this.apiUrl(endpoint),
                data: data
            });
        };

        HTTP.prototype.testGET = function(endpoint, params) {
            return this.testAJAX('GET', endpoint, params);
        };

        HTTP.prototype.testPOST = function(endpoint, body) {
            return this.testAJAX('POST', endpoint, body);
        };

        HTTP.prototype.testPUT = function(endpoint, body) {
            return this.testAJAX('PUT', endpoint, body);
        };

        HTTP.prototype.testDELETE = function(endpoint, params) {
            return this.testAJAX('DELETE', endpoint, params);
        };

        return new HTTP();
    }]);

