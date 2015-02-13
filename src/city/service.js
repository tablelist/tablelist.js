angular.module('tl').service('tl.city.service', [
  'tl.service',
  'tl.city.resource',
  function(Service, City) {

    var CityService = Service.extend(City);

    return new CityService();
  }
]);
