
describe('Client Tests', function(){
  describe('GET - Payment Token', function(){

    it('should get the payment token', function(done){
      tlClient.service.paymentToken(function(resp){
        console.log(resp);
        done();
      }, done);
    });
  });

  describe('GET - Startup Configuration', function(){

    it('should get the payment token', function(done){
      tlClient.service.startup(function(settings){
        console.log(settings);
        done();
      }, done);
    });
  });
});