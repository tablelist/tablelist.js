
angular
	.module('tl')
	.service('tl.settings.service', ['tl.service', 'tl.settings.resource', function(Service, Settings){

		var SettingsService = function(){};

		SettingsService.prototype.status = function(success, error) {
			return Settings.status({}, success, error);
		};

		SettingsService.prototype.config = function(success, error) {
			return Settings.config({}, success, error);
		};

		return new SettingsService();
	}]);