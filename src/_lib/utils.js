
angular
	.module('tl')
	.factory('tl.utils', [function(){

		var Utils = function(){};

		Utils.prototype.noop = function() {
			// emty function
		};

		Utils.prototype.slugify = function(string) {
			return string.trim().replace(/\s/gi,'-').replace(/('|\.)/gi,'').toLowerCase();
		};

		return new Utils();
	}]);