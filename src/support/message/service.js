angular
  .module('tl')
  .service('tl.support.message.service', [
    'tl.service',
    'tl.support.message.resource',
    function(Service, Message) {
      'use strict';

      var SupportMessageService = Service.extend(Message);

      return new SupportMessageService();
    }
  ]);
