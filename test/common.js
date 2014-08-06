
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
		it('should set a cookie', function(){
			Cookie.set('a', '12345');
			Cookie.get('a').should.equal('12345');
		});	

		it('should have a cookie', function(){
			Cookie.exists('a').should.be.ok;
		});

		it('should get a cookie', function(){
			Cookie.get('a').should.equal('12345');
		});

		it('should remove a cookie', function(){
			Cookie.remove('a');
			Cookie.exists('a').should.not.be.ok;
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
			HTTP.testGET('/status')
				.success(function(data){
					console.log(data);
					data.status.should.equal('OK');
					done();
				})
				.error(done);
		});
	});
});













