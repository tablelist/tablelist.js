/* =========================================================================
 * Cookie Service Tests
 * ========================================================================= */
describe('user service', function() {

  var userService;
  var authService;

  /* =========================================================================
   * Before
   * ========================================================================= */

  beforeEach(function() {
    module('tl')

    inject([
      'tl.user.service',
      'tl.auth.service',
      function(_userService, _authService) {
        userService = _userService;
        authService = _authService;
      }
    ]);
  });

  /* =========================================================================
   * currentUser()
   * ========================================================================= */

  describe('currentUser()', function() {

    describe('when no auth token set', function() {
      it('should not return a user', function(done) {

      	

        done();
      });
    });

  });

});
