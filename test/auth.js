
var Storage = null
  , Cookie = null
  , Auth = null
  , UserService = null;

describe('Auth Tests', function(){
	beforeEach(function(){
		angular.mock.module('tl');
		inject(['tl.storage', 'tl.cookie', 'tl.auth', 'tl.user', function(s, c, a, u){
			Storage = s;
			Cookie = c;
			Auth = a;
			UserService = u;
		}]);
	});

	var email = 'test+' + Date.now() + '@test.com';
	var password = 'password';
	var firstName = 'Alan';
	var lastName = 'Turing';

	describe('Register Email', function(){

		it('should register a new user', function(done){
			Auth.register(email, password, firstName, lastName)
				.success(function(auth){
					console.log(auth);
					var user = auth.user;
					user.email.should.equal(email);
					user.firstName.should.equal(firstName);
					user.lastName.should.equal(lastName);
					done();
				})
				.error(done);
		});
	});

	describe('Login', function(){

		it('should log me in', function(done){
			Auth.login(email, password)
				.success(function(auth){
					console.log(auth);
					var user = auth.user;
					user.email.should.equal(email);
					user.firstName.should.equal(firstName);
					user.lastName.should.equal(lastName);
					done();
				})
				.error(done);
		});
	});

	describe('Me', function(){

		it('should fetch me', function(done){
			UserService
				.me()
				.success(function(user){
					user.email.should.equal(email);
					user.firstName.should.equal(firstName);
					user.lastName.should.equal(lastName);
					done();
				})
				.error(done);
		});
	});
});



















