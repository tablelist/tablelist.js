
angular
	.module('tl')
	.factory('tl.storage', function(){

		var Storage = function(){};

		Storage.prototype.get = function(key) {
			try {
				var val = localStorage.getItem(key);
				return JSON.parse(val);
			} catch(e) {
				return null;
			}
		};

		Storage.prototype.set = function(key, obj) {
			if (obj) {
				try {
					var val = JSON.stringify(obj);
					return localStorage.setItem(key, val);
				} catch(e) {
					return null;
				}
			} else {
				this.remove(key);
			}
		};

		Storage.prototype.remove = function(key) {
			return localStorage.removeItem(key);
		};

		Storage.prototype.exists = function(key) {
			return this.get(key) != null;
		};

		Storage.prototype.clear = function() {
			return localStorage.clear();
		};

		return new Storage();
	});