angular
  .module('tl')
  .service('tl.support', [
    'tl.support.service',
    'tl.support.message',
    'tl.support.task',
    function(service, message, task) {
      this.service = service;
      this.message = message;
      this.task = task;
    }
  ]);
