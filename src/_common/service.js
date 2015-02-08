angular
  .module('tl')
  .factory('tl.service', ['tl.http', function(http) {
    'use strict';

    var Service = function(resource) {
      this.resource = resource;
    };

    var extend = function(resource) {
      var ExtendedService = function() {
        Service.call(this, resource);
      };

      var proto = Service.prototype;
      var keys = Object.keys(proto);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key != 'constructor') {
          ExtendedService.prototype[key] = proto[key];
        }
      }

      return ExtendedService;
    };

    /*==============================================================*
    /* Constants
    /*==============================================================*/

    var DEFAULT_LIMIT = 100;
    var DEFAULT_SORT = '-created';

    /*==============================================================*
    /* CRUD
    /*==============================================================*/

    Service.prototype.create = function(data, success, error) {
      return this.resource.save({}, data, success, error);
    };

    Service.prototype.read = function(id, success, error) {
      return this.resource.get({
        id: id
      }, success, error);
    };

    Service.prototype.update = function(id, data, success, error) {
      return this.resource.update({
        id: id
      }, data, success, error);
    };

    Service.prototype.delete = function(id, success, error) {
      return this.resource.delete({
        id: id
      }, success, error);
    };

    Service.prototype.list = function(limit, sort, success, error) {
      return this.resource.query({
        sort: sort || DEFAULT_SORT,
        limit: limit || DEFAULT_LIMIT
      }, success, error);
    };

    /*==============================================================*
    /* Query
    /*==============================================================*/

    Service.prototype.query = function(query, limit, sort, success, error) {
      var queryString = this.buildQueryString(query);
      if (!queryString) return null;

      return this.resource.query({
        query: queryString,
        sort: sort || DEFAULT_SORT,
        limit: limit || DEFAULT_LIMIT
      }, success, error);
    };

    Service.prototype.totals = function(query, sort, success, error) {
      var queryString = this.buildQueryString(query);
      if (!queryString) return null;

      return this.resource.query({
        total: true,
        query: queryString,
        sort: sort || DEFAULT_SORT
      }, success, error);
    };

    Service.prototype.buildQueryString = function(query, next) {
      try {
        return JSON.stringify(query);
      } catch (err) {
        return null;
      }
    };

    /*==============================================================*
    /* Images
    /*==============================================================*/

    Service.prototype.listImages = function(id, success, error) {
      return this.resource.listImages({
        id: id
      }, success, error);
    };

    Service.prototype.addImage = function(id, image, success, error) {
      image.id = id;
      return this.resource.addImage(image, success, error);
    };

    Service.prototype.deleteImage = function(id, imageId, success, error) {
      return this.resource.deleteImage({
        id: id,
        imageId: imageId
      }, success, error);
    };

    Service.prototype.setPrimaryImage = function(id, imageId, success, error) {
      return this.resource.setPrimaryImage({
        id: id,
        imageId: imageId
      }, success, error);
    };

    Service.prototype.exportUrl = function(query, sort, format) {
      var endpoint = this.resource.ENDPOINT;
      var index = this.resource.ENDPOINT.indexOf(":");
      if (index > -1) endpoint = endpoint.substring(0, index);
      var url = this.resource.URL.substring(0, this.resource.URL.lastIndexOf(":") - 1);
      url += "?query=" + encodeURIComponent(JSON.stringify(query));
      url += "&sort=" + sort;
      url += "&admin=" + true;
      url += "&csv=" + true;
      url += "&auth=" + tlKeychain.authToken();
      return url;
    };

    return {
      extend: extend,
      common: Service
    }
  }]);
