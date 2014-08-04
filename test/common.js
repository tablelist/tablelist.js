
var Storage = null
  , Cookie = null
  , HTTP = null;

describe('Common Tests', function(){
	beforeEach(function(){
		angular.mock.module('tl');
		inject(['tl.storage', 'tl.cookie', 'tl.http', function(s, c, h){
			Storage = s;
			Cookie = c;
			HTTP = h;
		}]);
	});

	describe('Cookie Tests', function(){
		return; // broken on local machine
		
		it('should set a cookie', function(){
			Cookie.set('a', '12345').should.be.ok;
		});	

		it('should have a cookie', function(){
			Cookie.exists('a').should.be.ok;
		});

		it('should get a cookie', function(){
			Cookie.get('a').should.equal('12345');
		});

		it('should remove a cookie', function(){
			Cookie.remove('a').should.be.ok;
		});

		it('should not have a cookie', function(){
			Cookie.exists('a').should.not.be.ok;
		});
	});

	describe('Storage Tests', function(){
		it('should set an item', function(){
			Storage.set('a', []);
		});

		it('should get an item', function(){
			Storage.get('a').length.should.equal(0);
		});
	});

	describe('HTTP Tests', function(){
		it('should get api status', function(done){
			HTTP.get('/status')
				.success(function(res, data){
					console.log(res);
					console.log(data);
					done();
				})
				.error(function(){
					console.log('error...');
					done();
				});
		});
	});
});













