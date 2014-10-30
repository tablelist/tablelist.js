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
  inject(function($injector) {
    authService = $injector.get('tl.auth.service');

    console.log(authService);
  });
});

/* =========================================================================
 * Tests
 * ========================================================================= */
describe('foobar', function() {
  it('should work', function(done) {

    console.log('FOOOO');
    console.log(authService);

    true.should.be.true;

    done();
  });
});
