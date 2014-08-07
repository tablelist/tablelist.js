
describe('Venue Tests', function(){

	describe('List', function(){

		var city = null;

		it('should get a city', function(){
			city = tlStorage.get('cities')[0];
		});

		it('should list venues for a city', function(done){
			tlVenueService.listForCity(city.id, function(venues){
				console.log(venues);
				done();
			}, done);
		});

		it('should list featured venues for a city', function(done){
			tlVenueService.listCityFeatured(city.id, function(venues){
				console.log(venues);
				done();
			}, done);
		});

		it('should list tonight venues for a city', function(done){
			tlVenueService.listCityTonight(city.id, function(venues){
				console.log(venues);
				done();
			}, done);
		});
	});
});