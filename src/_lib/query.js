
angular
	.module('tl')
	.factory('tl.query', ['tl.config','$location', function(config, $location){

		var Query = function(){};

		Query.prototype.params = function() {
			return $location.search();
		};

		Query.prototype.get = function(key) {
			return this.params()[key];
		};

		Query.prototype.set = function(key, value) {
			var data = {};
			data[key] = value;
			$location.search(data);
		};

		return new Query();
	}]);