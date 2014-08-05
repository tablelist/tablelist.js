
angular
	.module('tl')
	.factory('tl.query', function(){

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

		Query.prototype.set = function() {
			// todo
		};

		return new Query();
	});