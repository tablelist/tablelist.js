
describe('Venue Tests', function(){

	var city = null;
	var venue = null;

	describe('List', function(){
		it('should get a city', function(){
			city = tlStorage.get('cities')[0];
		});

		it('should list venues for a city', function(done){
			tlVenue.service.listForCity(city.id, function(venues){
				console.log(venues);
				venue = venues[0];

				venues.should.not.be.empty;

				done();
			}, done);
		});

		it('should list featured venues for a city', function(done){
			tlVenue.service.listCityFeatured(city.id, function(venues){
				console.log(venues);

				venues.should.not.be.empty;

				done();
			}, done);
		});

		it('should list tonight venues for a city', function(done){
			tlVenue.service.listCityTonight(city.id, function(venues){
				console.log(venues);

				venues.should.not.be.empty;

				done();
			}, done);
		});
	});

	describe('Read', function(){
		it('should get a single venue', function(done){
			console.log(tlVenue.service);
			tlVenue.service.read(venue.id, function(_venue){
				console.log(_venue);
				venue = _venue;
				done();
			}, done);
		});
	});
});