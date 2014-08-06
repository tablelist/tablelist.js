
angular
	.module('tl')
	.factory('tl.service', ['tl.http', function(http){

		var Service = function(resource) {
			this.resource = resource;
		};

		var extend = function(resource) {
			var _service = function() {
				Service.call(this, resource);
			};
			_service.prototype = new Service();
			_service.prototype.constructor = _service;
			return _service;
		};

		/*==============================================================*
		/* CRUD
		/*==============================================================*/

		Service.prototype.create = function(data) {
			return this.resource.create(data);
		};

		Service.prototype.read = function(id) {
			return this.resource.get({ id: id });
		};

		Service.prototype.update = function(id, data) {
			return this.resource.update({ id: id}, data);
		};

		Service.prototype.delete = function(id, data) {
			return this.resource.delete({ id: id}, data);
		};

		/*==============================================================*
		/* Query
		/*==============================================================*/

		Service.prototype.query = function(query, sort, limit) {
			return this.queryResource(query, sort, false, limit);
		};

		Service.prototype.queryTotal = function(query, sort) {
			return this.queryResource(query, sort, true);
		};

		Service.prototype.queryResource = function(query, sort, total, limit) {
			query = query || {};
			sort = sort || "";
			total = total || false;
			limit = limit || DEFAULT_LIMIT;

			var params = { 
				query: JSON.stringify(query),
				limit: limit,
				admin: true
			};
			if (sort) params['sort'] = sort;
			if (total) params['total'] = true;

			var fn = (total) ? 'queryTotal' : 'query';
			return this.resource[fn](params);
		};

		/*==============================================================*
		/* Images
		/*==============================================================*/

		Service.prototype.listImage = function(id) {
		    return this.resource.listImages({ id: id });
		};

		Service.prototype.addImage = function(id, image) {
			image.id = id;
		    return this.resource.addImage(image);
		};

		Service.prototype.deleteImage = function(id, imageId) {
		    return this.resource.deleteImage({
		    	id: id,
		    	imageId: imageId
		    });
		};

		Service.prototype.setPrimaryImage = function(id, imageId) {
		    return this.resource.setPrimaryImage({
		    	id: id,
		    	imageId: imageId
		    });
		};

		return { 
			extend: extend,
			common: Service
		}
	}]);