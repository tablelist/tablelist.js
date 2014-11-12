/* =========================================================================
 * Cookie Service Tests
 * ========================================================================= */
describe('cookie service', function() {

  var cookieService;

  /* =========================================================================
   * Before
   * ========================================================================= */
  beforeEach(function(done) {
    module('tl')

    inject(['tl.cookie', function(_cookieService) {
      cookieService = _cookieService;

      done();
    }]);
  });

  /* =========================================================================
   * get() && set()
   * ========================================================================= */
  describe('get() && set()', function() {

    it('should store and retrieve a value', function(done) {

      var testValue = '123456789abcdefghijklmbopqrstuvwxyz';

      cookieService.set('test', testValue);

      var value = cookieService.get('test');

      should.exist(value);
      value.should.equal(testValue);

      done();
    });

    it('should store and retrieve a value', function(done) {

      var testValue = '123456789abcdefghijklmbopqrstuvwxyz';

      cookieService.set('test', testValue);

      var value = cookieService.get('test');

      should.exist(value);
      value.should.equal(testValue);

      done();
    });
  });

  /* =========================================================================
   * set()
   * ========================================================================= */
  describe('set()', function() {

    describe('setting a value without passing a value', function() {
      it('should remove the value', function(done) {

        var testValue = '123456789abcdefghijklmbopqrstuvwxyz';

        cookieService.set('test', testValue);

        cookieService.set('test');

        var value = cookieService.get('test');

        should.not.exist(value);

        done();
      });
    });
  });

  /* =========================================================================
   * remove()
   * ========================================================================= */
  describe('remove()', function() {

    it('should remove a value', function(done) {

      var testValue = '123456789abcdefghijklmbopqrstuvwxyz';

      cookieService.set('test', testValue);

      cookieService.remove('test');

      var value = cookieService.get('test');

      should.not.exist(value);

      done();
    });
  });

});
