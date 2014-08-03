
angular
	.module('tl')
	.factory('auth', function(){

		var auth = function(){};

		auth.prototype.test = function() {
			console.log('test');
		};

		return new auth();
	});