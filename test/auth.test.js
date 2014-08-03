
describe('Auth Tests', function(){
	beforeEach(angular.mock.module('tl'));


	it('should run the test', function(done){
		inject(['auth', function(auth){
			auth.test();
			done();
		}]);
	});
});
