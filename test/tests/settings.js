
describe('Settings Tests', function(){

	describe('List', function(){

		it('should list application settings', function(done){
			tlSettingsService.config(function(settings){
				console.log(settings);
				done();
			}, done);
		});
	});
});