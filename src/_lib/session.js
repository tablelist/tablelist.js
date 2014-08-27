
angular
	.module('tl')
	.factory('tl.session', ['tl.config', function(config){

		var Session = function(){};

		Session.prototype.get = function(key) {
			try {
				var val = sessionStorage.getItem(key);
				return JSON.parse(val);
			} catch(e) {
				return null;
			}
		};

		Session.prototype.set = function(key, obj) {
			if (obj) {
				try {
					var val = JSON.stringify(obj);
					return sessionStorage.setItem(key, val);
				} catch(e) {
					return null;
				}
			} else {
				this.remove(key);
			}
		};

		Session.prototype.remove = function(key) {
			return sessionStorage.removeItem(key);
		};

		Session.prototype.exists = function(key) {
			return this.get(key) != null;
		};

		Session.prototype.clear = function() {
			return sessionStorage.clear();
		};

		return new Session();
	}]);