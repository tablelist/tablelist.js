
angular
	.module('tl')
	.factory('tl.resource', ['$resource', 'tl.keychain', 'tl.http', function($resource, keychain, http){

		function _url(endpoint) {
			return http.apiUrl(endpoint);
		}

		function _params(params) {
			// do nothing for now
			return params;
		}

		function _actions(actions) {
			var _data = _commonActions();
			var actionKeys = Object.keys(actions);
			for (var i = 0; i < actionKeys.length; i++) {
				var key = actionKeys[i];
				_data[key] = actions[key];
			}

			var keys = Object.keys(_data);
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var action = _data[key];
				if (action.url) {
				    action.url = _url(action.url);
				}
			}

			return _data;
		}

		function _commonActions(endpoint) {
			return { 

				/*==============================================================*
				/* CRUD: Default actions - get, query, save, remove|delete
				/*==============================================================*/

				update: { method: 'PUT' },

				/*==============================================================*
				/* Images
				/*==============================================================*/

				listImages: { 
				    method: 'GET',
				    url: endpoint + '/image',
				    isArray: true
				}, 
				addImage: { 
				    method: 'POST',
				    url: endpoint + '/image',
				    isArray: true
				}, 
				deleteImage: { 
				    method: 'DELETE',
				    url: endpoint + '/image/:imageId',
				    isArray: true
				}, 
				setPrimaryImage: { 
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