angular
  .module('tl')
  .service('tl.notify.service', ['tl.service', 'tl.notify.resource', function(Service, Notify) {

    var NotifyService = Service.extend(Notify);

    NotifyService.prototype.sendAdminApp = function() {
      return Notify.sendAdminApp().$promise;
    };

    return new NotifyService();
  }]);
