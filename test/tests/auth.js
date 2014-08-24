
describe('Auth Tests', function(){
	var email = 'test+' + Date.now() + '@tablelist.com';
	var password = 'password';
	var firstName = 'Alan';
	var lastName = 'Turing';

	describe('Prospect', function(){
		var _token = null;
		it('should have a prospect token', function(){
			_token = tlKeychain.prospectToken();
			_token.should.exist;
			console.log(_token);
		});

		it('should be the same prospect token', function(){
			_token.should.equal(tlKeychain.prospectToken());
		});

		it('should update current prospect', function(done){
			var update = { firstName: 'Andrew' };
			tlProspect.service.updateProspect(update, function(prospect){
				prospect.firstName.should.equal('Andrew');
				done();
			}, done);
		});
	});

	describe('Register', function(){

		it('should register a new user', function(done){
			tlAuth.service
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
			tlAuth.service
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
			tlUser.service.me(function(user){
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
			var user = tlUser.service.currentUser();
			user.email.should.equal(email);
			user.firstName.should.equal(firstName);
			user.lastName.should.equal(lastName);
		});

		it('should save current user', function(){
			var update = { firstName: 'foobar' };
			tlUser.service.saveCurrentUser(update);
			var user = tlUser.service.currentUser();
			console.log(user);
			user.firstName.should.equal('foobar');
			user.email.should.equal(email);
		});

		it('should update current user', function(done){
			var update = {
				firstName: 'foobar',
				_id: 'fake',
				id: 'fake'
			};
			tlUser.service.updateMe(update, function(user){
				user.firstName.should.equal('foobar');
				var _user = tlUser.service.currentUser();
				_user.firstName.should.equal(user.firstName);
				done();
			});
		});
	});
});
