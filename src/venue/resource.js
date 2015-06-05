angular
  .module('tl')
  .factory('tl.venue.resource', ['tl.resource', function(resource) {

    var endpoint = '/venue/:id';

    return resource(endpoint, {
      id: '@id',
      itemId: '@itemId',
      imageId: '@imageId',
      cityId: '@cityId'
    }, {
      list: {
        method: 'GET',
        url: '/venue',
        isArray: true
      },
      /*==============================================================*
      /* Cities
      /*==============================================================*/

      listForCity: {
        method: 'GET',
        url: '/city/:cityId/venue',
        isArray: true
      },
      listCityFeatured: {
        method: 'GET',
        url: '/city/:cityId/venue/featured',
        isArray: true
      },
      listCityTonight: {
        method: 'GET',
        url: '/city/:cityId/venue/tonight',
        isArray: true,
        cache: true
      },

      /*==============================================================*
      /* Schedule
      /*==============================================================*/

      schedule: {
        method: 'GET',
        url: endpoint + '/schedule',
      },
      updateSchedule: {
        method: 'PUT',
        url: endpoint + '/schedule',
      },

      /*==============================================================*
      /* Inventory
      /*==============================================================*/

      listInventory: {
        method: 'GET',
        url: endpoint + '/inventory',
        isArray: false
      },
      listInventoryAdmin: {
        method: 'GET',
        url: endpoint + '/inventory/admin',
        isArray: false
      },
      readInventory: {
        method: 'GET',
        url: endpoint + '/inventory/:tableId',
        isArray: false
      },
      addInventory: {
        method: 'POST',
        url: endpoint + '/inventory',
        isArray: false
      },
      updateInventory: {
        method: 'PUT',
        url: endpoint + '/inventory/:tableId',
        isArray: false
      },

      /*==============================================================*
      /* Events
      /*==============================================================*/

      listEvents: {
        method: 'GET',
        url: endpoint + '/event',
        isArray: true
      },
      addEvent: {
        method: 'POST',
        url: '/event',
        isArray: false
      },

      /*==============================================================*
      /* Items
      /*==============================================================*/

      listItems: {
        method: 'GET',
        url: endpoint + '/item',
        isArray: true
      },
      addItem: {
        method: 'POST',
        url: endpoint + '/item'
      },
      updateItem: {
        method: 'PUT',
        url: endpoint + '/item/:itemId'
      },
      deleteItem: {
        method: 'DELETE',
        url: endpoint + '/item/:itemId'
      },

      /*==============================================================*
      /* Staff
      /*==============================================================*/

      listStaff: {
        method: 'GET',
        url: endpoint + '/user',
        isArray: true
      },
      addStaff: {
        method: 'POST',
        url: endpoint + '/user',
        isArray: true
      },
      updateStaff: {
        method: 'PUT',
        url: endpoint + '/user/:userId',
        isArray: true
      },
      removeStaff: {
        method: 'DELETE',
        url: endpoint + '/user/:userId',
        isArray: true
      },

      listBookings: {
        method: 'GET',
        url: endpoint + '/booking',
        isArray: true
      },

      listReviews: {
        method: 'GET',
        url: endpoint + '/review',
        isArray: true
      }
    });
  }]);
