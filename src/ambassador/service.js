angular
  .module('tl')
  .service('tl.ambassador.service', ['tl.service', 'tl.ambassador.resource',
    function(Service, Ambassador) {

      var AmbassadorService = Service.extend(Ambassador);

      AmbassadorService.prototype.getAll = function(){
        return Ambassador.getAll();
      };

      return new AmbassadorService();
    }
  ]);
