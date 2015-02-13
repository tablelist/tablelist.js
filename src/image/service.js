angular
  .module('tl')
  .service('tl.image.service', ['tl.service', 'tl.image.resource', 'tl.http', '$q',
    function(Service, Image, tlhttp, $q) {

      var ImageService = Service.extend(Image);

      ImageService.prototype.upload = function(file, options) {

        var deferred = $q.defer();

        var formData = new FormData();
        formData.append('image', file);

        var maxFileSize = 4000000; //4mb

        if (file.size > maxFileSize) deferred.reject('File cannot be greater than 4mb');

        tlhttp.upload('/image', options, formData)
          .success(function(data, status, headers, config) {
            deferred.resolve(data, status, headers, config);
          })
          .error(function(data, status, headers, config) {
            deferred.reject(data, status, headers, config);
          });

        return deferred.promise;
      };

      return new ImageService();
    }
  ]);
