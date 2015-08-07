
angular
	.module('tl')
	.service('tl.campaign.service', ['tl.storage', 'tl.campaign.resource', 'tl.service', function(storage, Campaign, Service){

		var CampaignService = Service.extend(Campaign);

		/**
		 * List internal campaigns
		 */
		CampaignService.prototype.listInternal = function() {
			return Campaign.list({ internal : true }).$promise;
		};

		return new CampaignService();
	}]);
