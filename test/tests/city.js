
describe('City Tests', function(){

	describe('List', function(){
		it('should list all cities', function(done){
			tlCityService.list(10, '-created', function(cities){
				console.log(cities);
				tlStorage.set('cities', cities);
				done();
			}, done);
		});
	});
});