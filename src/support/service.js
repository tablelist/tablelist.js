angular
  .module('tl')
  .service('tl.support.service', [
    'tl.socket',
    'tl.support.message',
    function(Socket, Message) {
      'use strict';

      var SupportService = function() {};

      SupportService.prototype.listClientMessages = function(options) {
        options = options || {};
        return Message.resource.list(options).$promise;
      };

      SupportService.prototype.sendInboundMessage = function(text, options) {
        options = options || {};

        return Message.resource.sendInboundMessage({}, {
          text: text,
          data: options.data,
          city: options.city
        }).$promise;
      };

      SupportService.prototype.markMessagesRead = function(messageIds) {
        return Message.resource.markMessagesRead({}, {
          messageIds: messageIds
        }).$promise;
      };

      SupportService.prototype.listenForClientMessages = function(onMessage) {
        return new Socket('/support/message/client', onMessage);
      };

      return new SupportService();
    }
  ]);
