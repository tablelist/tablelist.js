/* =========================================================================
 * Venue Service Tests
 * ========================================================================= */

describe('Venue Service', function() {

  var tlVenue;
  var $httpBackend;

  /* =========================================================================
   * Before
   * ========================================================================= */

  // load module
  beforeEach(module('tl'));

  // load injector
  beforeEach(inject(['$httpBackend', function(_$httpBackend) {
    $httpBackend = _$httpBackend;
  }]));

  // load service
  beforeEach(inject(['tl.venue', function(_tlVenue) {
    tlVenue = _tlVenue;
  }]));

  /* =========================================================================
   * Tests
   * ========================================================================= */

  describe('listForCity', function() {

    var cityId1 = '123';
    var venueResponse = [{
      name: 'venue1'
    }, {
      name: 'venue2'
    }];

    // Mock out HTTP request
    beforeEach(function() {
      // matches any - /city/*/venue
      var endpointMatch = /\/city\/.*\/venue/;
      var response = venueResponse;
      $httpBackend.when('GET', endpointMatch).respond(response);
    });

    it('should list venues for a city', function (done) {
      var promise = tlVenue.service.listForCity({cityId: cityId1});

      promise.then(function (venues) {
        expect(venues).to.have.length(2);
        done();
      }, function(err) {
        done(err);
      });

      $httpBackend.flush();
    });
  });

  describe('listForCity', function() {

    var cityId1 = '123';
    var venueResponse = [{
      name: 'venue1'
    }];

    // Mock out HTTP request
    beforeEach(function() {
      // matches any - /city/*/venue
      var endpointMatch = /\/city\/.*\/venue\/featured/;
      var response = venueResponse;
      $httpBackend.when('GET', endpointMatch).respond(response);
    });

    it('should list featured venues for a city', function (done) {
      var promise = tlVenue.service.listCityFeatured({cityId: cityId1});

      promise.then(function (venues) {
        expect(venues).to.have.length(1);
        done();
      }, function(err) {
        done(err);
      });

      $httpBackend.flush();
    });
  });

});