angular
  .module('tl')
  .service('tl.support.task.service', [
    'tl.service',
    'tl.support.task.resource',
    function(Service, Task) {
      'use strict';

      var SupportTaskService = Service.extend(Task);

      return new SupportTaskService();
    }
  ]);
