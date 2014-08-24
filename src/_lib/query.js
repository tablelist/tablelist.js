
angular
	.module('tl')
	.factory('tl.query', ['tl.config', function(config){

		var Query = function(){};

		Query.prototype.params = function() {
			var params = {};
			var parts = window.location.search.replace('?','').split('&');
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				var kv = part.split('=');
				if (kv && kv.length == 2) {
				    params[kv[0]] = decodeURIComponent(kv[1]);
				}
			}
			return params;
		};

		Query.prototype.get = function(key) {
			return this.params[key];
		};

		Query.prototype.set = function(key, value) {
			var params = this.params();
			params[key] = value;
			var keys = Object.keys(params);
			var parts = [];
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				var val = params[key];
				var string = encodeURIComponent(key) + '=' + encodeURIComponent(val);
				parts.push(string);
			}
			var search = '?' + parts.join('&');
			if (window.history && window.history.pushState) {
				window.history.pushState({}, '', search);
			} else {
				window.location.search = search;
			}
		};

		return new Query();
	}]);