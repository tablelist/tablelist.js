
// describe('Event Tests', function(){

// 	var city = null;
// 	var event = null;

// 	before(function() {
// 		city = tlStorage.get('cities')[0];
// 	});

// 	describe('List', function(){
// 		it('should list events for a city', function(done){
// 			tlEvent.service.listForCity(city.id, function(events){
// 				events.should.not.be.empty;

// 				event = events[0];
// 				done();
// 			}, done);
// 		});
// 	});

// 	describe('Read', function(){
// 		it('should get a single event', function(done){
// 			console.log(tlEvent.service);
// 			tlEvent.service
// 				.read(event.id, function(_event){
// 					_event.should.be.ok;
// 					_event.id.should.equal(event.id);

// 					event = _event;
// 					done();
// 				}, done);
// 		});
// 	});

	
// });