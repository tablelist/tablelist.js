angular
  .module('tl')
  .service('tl.event.service', ['tl.service', 'tl.event.resource', function(Service, Event) {

    var EventService = Service.extend(Event);

    EventService.prototype.list = function list(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return Event.list(options).$promise;
    };

    EventService.prototype.read = function read(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Event.get(options).$promise;
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

   /**
    * List of events for the provided city. 
    * Returns a promise. Supports additional 'options'.
    *
    * @method listEventsForCity
    * @param {Object} options 
    * @param {String} options.cityId - ID of a city
    * @param {String} options.fields - CSV of fields to return
    * @param {String} options.start  - unix start date for events
    * @param {String} options.end    - unix end date for events
    */

    EventService.prototype.listEventsForCity = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.cityId) throw new Error('options.cityId is required');

      return Event.listForCity(options).$promise;
    };

   /**
    * List of events for the provided city. 
    * Legacy support. 
    *
    * @method listForCity
    * @param {String} cityId - ID of a city
    */

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
