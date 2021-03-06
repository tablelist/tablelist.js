
angular
	.module('tl')
	.factory('tl.query', ['tl.config','$location', function(config, $location){

		var Query = function(){};

		Query.prototype.params = function() {
			return $location.search() || {};
		};

		Query.prototype.subdomain = function() {
			return window.location.hostname.split('.')[0];
		};

		Query.prototype.get = function(key) {
			return this.params()[key];
		};

		Query.prototype.set = function(key, value) {
			var data = this.params();
			data[key] = value;
			$location.search(data);
		};

		return new Query();
	}]);