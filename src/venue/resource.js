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
      listInventoryTierConfigs: {
        method: 'GET',
        url: endpoint + '/inventory-tier-config',
        isArray: true
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
      /* Info
      /*==============================================================*/

      listInfo: {
        method: 'GET',
        url: endpoint + '/info',
        isArray: true,
      },
      readInfo: {
        method: 'GET',
        url: endpoint + '/info/:key'
      },
      updateInfo: {
        method: 'PUT',
        url: endpoint + '/info/:key'
      },
      createInfo: {
        method: 'POST',
        url: endpoint + '/info/'
      },

      /*==============================================================*
      /* Staff
      /*==============================================================*/

      listStaff: {
        method: 'GET',
        url: endpoint + '/staff',
        isArray: true
      },
      readStaff: {
        method: 'GET',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
      createStaff: {
        method: 'POST',
        url: endpoint + '/staff',
        isArray: false
      },
      updateStaff: {
        method: 'PUT',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
      deleteStaff: {
        method: 'DELETE',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },

      /*==============================================================*
      /*
      /*==============================================================*/


      listBookings: {
        method: 'GET',
        url: endpoint + '/booking',
        isArray: true
      },

      listReviews: {
        method: 'GET',
        url: endpoint + '/review',
        isArray: true
      },

      /*==============================================================*
      /* Permissions
      /*==============================================================*/

      addStaffPermission: {
        method: 'POST',
        url: endpoint + '/staff/:staffId/permission',
        isArray: true
      },

      removeStaffPermission: {
        method: 'DELETE',
        url: endpoint + '/staff/:staffId/permission/:permission',
        isArray: false
      },

      listStaffPermissions: {
        method: 'GET',
        url: endpoint + '/staff/:staffId/permission',
        isArray: true
      },
    });
  }]);
