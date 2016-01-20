
angular
	.module('tl')
	.service('tl.review.service', ['tl.service', 'tl.review.resource', function(Service, Review){

		var ReviewService = Service.extend(Review);

		ReviewService.prototype.read = function read(options) {
			if (!options) throw new Error('options is required');
			if (!options.id) throw new Error('options.id is required');

			return Review.get(options).$promise;
		};

		ReviewService.prototype.update = function update(options) {
			if (!options) throw new Error('options is required');
			if (!options.id) throw new Error('options.id is required');

			return Review.update({ id: options.id }, options).$promise;
		};

		return new ReviewService();
	}]);
