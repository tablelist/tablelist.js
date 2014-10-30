
// describe('Common Tests', function(){

// 	describe('Cookie Tests', function(){		
// 		it('should set a cookie', function(){
// 			tlCookie.set('a', '12345');
// 			tlCookie.get('a').should.equal('12345');
// 		});	

// 		it('should have a cookie', function(){
// 			tlCookie.exists('a').should.be.ok;
// 		});

// 		it('should get a cookie', function(){
// 			tlCookie.get('a').should.equal('12345');
// 		});

// 		it('should remove a cookie', function(){
// 			tlCookie.remove('a');
// 			tlCookie.exists('a').should.not.be.ok;
// 		});

// 		it('should not have a cookie', function(){
// 			tlCookie.exists('a').should.not.be.ok;
// 		});
// 	});

// 	describe('Storage Tests', function(){
// 		it('should set an item', function(){
// 			tlStorage.set('a', []);
// 		});

// 		it('should get an item', function(){
// 			tlStorage.get('a').length.should.equal(0);
// 		});
// 	});

// 	describe('API Tests', function(){
// 		it('should get api root', function(done){
// 			tlHTTP.get('/')
// 				.success(function(data){
// 					console.log(data);
// 					data.name.should.equal('tablelist-api');
// 					done();
// 				})
// 				.error(done);
// 		});
// 	});
// });
