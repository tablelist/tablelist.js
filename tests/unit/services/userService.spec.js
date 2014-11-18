// /* =========================================================================
//  * Cookie Service Tests
//  * ========================================================================= */
// describe('user service', function() {

//   var userService;
//   var authService;
//   var keychainMock;

//   /* =========================================================================
//    * Before
//    * ========================================================================= */

//   beforeEach(function() {
//     module('tl');

//     inject([
//       'tl.user.service',
//       'tl.auth.service',
//       function(_userService, _authService) {
//         userService = _userService;
//         authService = _authService;

//         console.log(userService);
//         console.log(authService);
//       }
//     ]);
//   });

//   /* =========================================================================
//    * currentUser()
//    * ========================================================================= */

//   describe('currentUser()', function() {

//     describe('when no auth token set', function() {
//       // before(function(done) {
//       //   console.log(keychain);
//       //   keychain.setAuthToken(null);
//       //   done();
//       // });

//       it('should not return a user', function(done) {
//         var currentUser = authService.currentUser();

//         should.not.exist(currentUser);

//         done();
//       });
//     });

//   });

// });
