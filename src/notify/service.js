angular
  .module('tl')
  .service('tl.notify.service', ['tl.service', 'tl.metric.resource', function(Service, Notify) {

    var NotifyService = Service.extend(Metric);

    NotifyService.prototype.sendAdminApp = function() {
      return Notify.sendAdminApp().$promise;
    };

    return new NotifyService();
  }]);
