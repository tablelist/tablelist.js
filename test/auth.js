
var Storage = null
  , Cookie = null
  , Auth = null;

describe('Auth Tests', function(){
	beforeEach(function(){
		angular.mock.module('tl');
		inject(['tl.storage', 'tl.cookie', 'tl.auth', function(s, c, a){
			Storage = s;
			Cookie = c;
			Auth = a;
		}]);
	});
});
