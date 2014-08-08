
angular
	.module('tl')
	.service('tl.review.service', ['tl.service', 'tl.review.resource', function(Service, Review){

		var ReviewService = Service.extend(Review);

		return new ReviewService();
	}]);