angular
  .module('tl')
  .factory('tl.feed.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/feed';

      return resource(endpoint, {
        id: '@id',
        userId: '@userId'
      }, {
        create: {
          method: 'POST',
          url: endpoint,
          isArray: false
        },
        remove: {
          method: 'DELETE',
          url: endpoint + '/:id',
          isArray: false
        },
        list: {
          method: 'GET',
          url: endpoint,
          isArray: true
        },
        listUserFeed: {
          method: 'GET',
          url: '/user/:userId/feed',
          isArray: true
        },
        addLike: {
          method: 'POST',
          url: endpoint + '/:id/like',
          isArray: false
        },
        removeLike: {
          method: 'DELETE',
          url: endpoint + '/:id/like',
          isArray: false
        }
      });
    }
  ]);
