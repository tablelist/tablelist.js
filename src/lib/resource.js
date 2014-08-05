
angular
	.module('tl')
	.factory('tl.resource', ['$resource', 'tl.auth', 'tl.http', function($resource, auth, http){

		function _url(endpoint) {
			return http.apiUrl(endpoint);
		}

		function _params(params) {
			var token = auth.authToken();
			if (token) {
				params['auth'] = token;
			}
			return params;
		}

		function _actions(actions) {
			var _data = _.extend(_commonActions(), actions);
			_.each(_data, function(action){
			    if (action.url) {
			        action.url = _url(action.url);
			    }
			});
			return actions;
		}

		function _commonActions(endpoint) {
			return { 
				'list': {
					method: 'GET',
					isArray: true
				},
				'create': {
				    method: 'POST' 
				},
				'update': { 
				    method: 'PUT' 
				},
				'delete': {
					method: 'DELETE'
				},
				'queryTotal': {
				    method: 'GET',
				    url: endpoint,
				    isArray: false
				},
				'listImages': { 
				    method: 'GET',
				    url: endpoint + '/image',
				    isArray: true
				}, 
				'addImage': { 
				    method: 'POST',
				    url: endpoint + '/image',
				    isArray: true
				}, 
				'deleteImage': { 
				    method: 'DELETE',
				    url: endpoint + '/image/:imageId',
				    isArray: true
				}, 
				'setPrimaryImage': { 
				    method: 'PUT',
				    url: endpoint + '/image/:imageId',
				    isArray: true
				}
			};
		}

		function _resource(endpoint, url, params, actions) {
			var resource = $resource(url, params, actions);
			resource.ENDPOINT = endpoint;
			resource.URL = url;
			return resource;
		}

		return function(endpoint, urlParams, defaultActions) {
			
			var url     = _url(endpoint);
			var params  = _params(urlParams);
			var actions = _actions(defaultActions);

			return _resource(endpoint, url, params, actions);
		}
	}]);