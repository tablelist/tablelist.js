angular
  .module('tl')
  .service('tl.tag.service', [
    'tl.service',
    'tl.tag.resource',
    function(Service, Tag) {
      'use strict';

      var TagService = Service.extend(Tag);

      TagService.prototype.list = function(options) {
        return Tag.list(options).$promise;
      };

      return new TagService();
    }
  ]);
