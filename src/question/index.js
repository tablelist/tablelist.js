angular
  .module('tl')
  .service('tl.question', ['tl.question.resource', 'tl.question.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);
