 angular
   .module('tl')
   .service('tl.permission.service', ['tl.permission.resource', 'tl.service',
     function(Permission, Service) {

       var PermissionService = Service.extend(Permission);

       PermissionService.prototype.listVenuePermissions = function listVenuePermissions(options) {
         var _this = this;

         return Permission.listVenuePermissions().$promise;
       };

       return new PermissionService();
     }
   ]);
