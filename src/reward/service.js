
angular
	.module('tl')
	.service('tl.reward.service', ['tl.service', 'tl.reward.resource', function(Service, Reward){

		var RewardService = Service.extend(Reward);

		return new RewardService();
	}]);