/* =========================================================================
 * Auth Service Tests
 * ========================================================================= */
describe('auth service', function() {

  var authService;

  /* =========================================================================
   * Before
   * ========================================================================= */

  beforeEach(function() {
    module('tl');

    inject(['tl.auth.service', function(_authService) {
      authService = _authService;
    }]);
  });

  /* =========================================================================
   * authToken()
   * ========================================================================= */

  describe('- set authToken()', function() {

    it('should set an auth token', function(done) {

      var token = '123456789abcdefghijklmbopqrstuvwxyz';

      authService.setAuthToken(token);

      var setToken = authService.authToken();

      should.exist(setToken);
      setToken.should.equal(token);

      done();
    });
  });
});
