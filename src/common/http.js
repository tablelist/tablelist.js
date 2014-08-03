
angular
	.module('tl')
    .factory('http', ['$http', 'tlauth', function($http, tlauth){
        
        function apiUrl(endpoint, params) {
            params = params || {};
            _.extend(params, {
                auth: getAuthToken()
            });

            var data = _.map(params, function(val, key){
                return key + '=' + encodeURIComponent(val);
            });

            var url = TL.config.host.api + endpoint + '?' + data.join('&');
            return url;
        }

        function getAuthToken() {
            var params = queryParams();
            if (params.auth) {
                return params.auth;
            }
            return tlauth.authToken();
        }

        function queryParams() {
            var params = {};
            var parts = window.location.search.replace('?','').split('&');
            _.each(parts, function(part){
                var kv = part.split('=');
                if (kv && kv.length == 2) {
                    params[kv[0]] = kv[1];
                }
            });
            return params;
        }

        function get(endpoint, params) {
            return $http.get(apiUrl(endpoint, params));
        }

        function post(endpoint, body, headers) {
            return $http.post(apiUrl(endpoint), body, headers);
        }

        function put(endpoint, body, headers) {
            return $http.put(apiUrl(endpoint), body, headers);
        }

        function del(endpoint, params) {
            return $http.delete(apiUrl(endpoint, params));
        }

        function upload(endpoint, body) {
            return post(endpoint, body, {
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            });
        }

        return {
            apiUrl: apiUrl,
            queryParams: queryParams,
            get: get,
            post: post,
            put: put,
            delete: del,
            upload: upload
        }
    }]);