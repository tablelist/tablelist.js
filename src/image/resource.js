angular
  .module('tl')
  .factory('tl.image.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/image';

      return resource(endpoint, {}, {

        // upload: {
        //   method: 'POST',
        //   url: endpoint,
        //   headers: {
        //     'Content-Type': undefined
        //   }
        // }
        
      });
    }
  ]);
