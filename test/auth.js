
describe('Auth Tests', function(){
	var email = 'test+' + Date.now() + '@test.com';
	var password = 'password';
	var firstName = 'Alan';
	var lastName = 'Turing';

	describe('Register', function(){

		it('should register a new user', function(done){
			tlAuthService
				.register(email, password, firstName, lastName, function(auth){
					console.log(auth);
					var user = auth.user;
					user.email.should.equal(email);
					user.firstName.should.equal(firstName);
					user.lastName.should.equal(lastName);
					done();
				}, done);
		});
	});

	describe('Login', function(){

		it('should log me in', function(done){
			tlAuthService
				.login(email, password, function(auth){
					console.log(auth);
					var user = auth.user;
					user.email.should.equal(email);
					user.firstName.should.equal(firstName);
					user.lastName.should.equal(lastName);
					done();
				}, done);
		});
	});

	describe('Me', function(){

		it('should fetch me', function(done){
			tlUserService.me(function(user){
				console.log(user);
				user.email.should.equal(email);
				user.firstName.should.equal(firstName);
				user.lastName.should.equal(lastName);
				done();
			}, function(err){
				done(err);
			});
		});

		it('should store current user locally', function(){
			var user = tlUserService.currentUser();
			user.email.should.equal(email);
			user.firstName.should.equal(firstName);
			user.lastName.should.equal(lastName);
		});
	});
});
