/* =========================================================================
 * Auth Service Tests
 * ========================================================================= */
var authService;

beforeEach(module('tl'));

var authService;

/* =========================================================================
 * Test suite setup
 * ========================================================================= */
beforeEach(function() {
  inject(['tl.auth.service', function(_authService) {
    authService = _authService;
  }]);
});

/* =========================================================================
 * Tests
 * ========================================================================= */
describe('auth service', function() {

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
