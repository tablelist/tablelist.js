
describe('Status Tests', function(){

	describe('OK', function(){
		it('should return status: OK', function(done){
			tlSettingsService.status(function(status){
				status.status.should.equal('OK');
				done();
			}, done);
		});
	});
});