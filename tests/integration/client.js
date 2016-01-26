
describe('Client Tests', function(){
  describe('GET - Payment Token', function(){

    it('should get the payment token', function(done){
      tlClient.service.paymentToken().then(function(resp){
        console.log(resp);

        resp.should.not.be.empty;

        done();
      }, done);
    });
  });

  describe('GET - Startup Configuration', function(){

    it('should get the payment token', function(done){
      tlClient.service.startup().then(function(resp){
        console.log(resp);

        resp.should.not.be.empty;

        done();
      }, done);
    });
  });
});