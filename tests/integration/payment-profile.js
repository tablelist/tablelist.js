
// describe('Payment Profile', function(){

// 	var profileId = null;

// 	describe('List', function(){
// 		it('should fetch empty profiles', function(done){
// 			tlPayment.service.list(null, null, function(profiles){
// 				console.log(profiles);
// 				profiles.length.should.equal(0);
// 				done();
// 			}, done);
// 		});
// 	});

// 	describe('Create', function(){
// 		it('should create a payment profile', function(done){
// 			var name = 'Andrew Barba';
// 			var number = '4111111111111111';
// 			var month = '01';
// 			var year = '2020';
// 			var cvv = '879';
// 			var address = '745 Atlantic Ave';
// 			var city = 'Boston';
// 			var state = 'MA';
// 			var zip = '02111';

// 			tlPayment.service
// 				.addProfile(name, number, month, year, cvv, address, city, state, zip, function(profile){
// 					console.log(profile);
// 					profile.cardholderName.should.equal(name);
// 					profile.last4.should.equal(number.slice(-4));
// 					profileId = profile.id;
// 					done();
// 				}, done);
// 		});
// 	});

// 	describe('List', function(){
// 		it('should fetch one profile', function(done){
// 			tlPayment.service.list(null, null, function(profiles){
// 				console.log(profiles);
// 				profiles.length.should.equal(1);
// 				profiles[0].id.should.equal(profileId);
// 				done();
// 			}, done);
// 		});
// 	});

// 	// describe('Update', function(){
// 	// 	it('should update current profile', function(done){
// 	// 		var name = 'Foo Bar';

// 	// 		tlPayment.service
// 	// 			.updateProfile(profileId, name)
// 	// 			.$promise.then(function(profile){
// 	// 				console.log(profile);
// 	// 				profile.id.should.equal(profileId);
// 	// 				profile.cardholderName.should.equal(name);
// 	// 				done();
// 	// 			}, done);
// 	// 	});
// 	// });
// });