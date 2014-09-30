angular
  .module('tl')
  .factory('tl.question.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/question';

      return resource(endpoint, {
        id: '@id'
      }, {
        get: {
          method: 'GET',
          url: endpoint + '/:id'
        },
        listAnswers: {
          method: 'GET',
          url: endpoint + '/:id/answers',
          isArray: true
        },
        listTotalsForAnswers: {
          method: 'GET',
          url: endpoint + '/:id/answers/totals',
          isArray: true
        }
      });
    }
  ]);
