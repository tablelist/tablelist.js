angular
  .module('tl')
  .service('tl.event.service', ['tl.service', 'tl.event.resource', function(Service, Event) {

    var EventService = Service.extend(Event);

    EventService.prototype.list = function list(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return Event.list(options).$promise;
    };

    EventService.prototype.create = function create(options) {
      if (!options) throw new Error('options is required');

      return Event.save({}, options).$promise;
    };

    EventService.prototype.update = function update(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Event.update({
        id: options.id
      }, options).$promise;
    };

    /*==============================================================*
    /* Cities
    /*==============================================================*/

    EventService.prototype.listForCity = function(cityId, success, error) {
      return Event.listForCity({
        cityId: cityId
      }, success, error);
    };

    EventService.prototype.listCityTonight = function(cityId, success, error) {
      return Event.listCityTonight({
        cityId: cityId
      }, success, error);
    };

    EventService.prototype.addStaff = function(eventId, userId, success, error) {
      return Event.addStaff({
        id: eventId
      }, {
        userId: userId
      }, success, error);
    };

    EventService.prototype.updateStaff = function(eventId, staffId, updates, success, error) {
      return Event.updateStaff({
        id: eventId,
        staffId: staffId
      }, updates, success, error);
    };

    EventService.prototype.deleteStaff = function(eventId, staffId, success, error) {
      return Event.deleteStaff({
        id: eventId,
        staffId: staffId
      }, success, error);
    };

    return new EventService();
  }]);
