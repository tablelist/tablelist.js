/**
 * Node.js style EventEmitter
 */
angular
	.module('tl')
	.factory('tl.ee', ['$rootScope', function($rootScope){

		var Event = function(){};

		Event.prototype.on = function(name, callback) {
			return $rootScope.$on(name, callback);
		};

		Event.prototype.emit = function(name, obj1, obj2, obj3) {
			return $rootScope.$emit(name, obj1, obj2, obj3);
		};

		return new Event();
	}]);