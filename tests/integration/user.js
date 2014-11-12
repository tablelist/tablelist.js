
describe('User Tests', function(){

	describe('List Payment Profiles', function(){

		var user = null;

		before(function(done) {
			user = tlUser.service.currentUser();
			done();
		});

		// it('should list users payment profiles', function(done){

		// 	var errorFn = user.admin ? function errorAdmin(response) {
		// 		done(new Error(response.data.message));
		// 	} : function errorNonAdmin(response) {
				
		// 	};

		// 	tlUser.service.listPaymentProfiles(user._id).then(function success(response) {
		// 		response.should.be.ok;

		// 		done();
		// 	}, function error(response) {
		// 		done(new Error(response.data.message));
		// 	});
		// });
	});
});