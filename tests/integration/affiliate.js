describe('Affiliate Tests', function() {

  describe('List Sales', function() {

    var user = null;

    before(function(done) {
      user = tlUser.service.currentUser();
      done();
    });

    it('should list sales', function(done) {

      tlAffiliate.service.listSales({
        id: user._id
      }).then(function success(response) {
        response.should.be.ok;

        done();
      }, function error(response) {
        done(new Error(response.data.message));
      });
    });
  });

  describe('Get Summary', function() {
    var user = null;

    before(function(done) {
      user = tlUser.service.currentUser();
      done();
    });

    it('should get a summary for the user', function(done) {
      tlAffiliate.service.getSummary({
        id: user._id
      }).then(function success(response) {
        response.should.be.ok;
        done();
      }, function error(response) {
        done(new Error(response.data.message));
      });
    });
  });
});
