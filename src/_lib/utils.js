
angular
	.module('tl')
	.factory('tl.utils', [function(){

		var Utils = function(){};

		Utils.prototype.noop = function() {
			// empty function
		};

		Utils.prototype.slugify = function(string) {
			return string.trim().replace(/\s/gi,'-').replace(/('|\.)/gi,'').toLowerCase();
		};

		Utils.prototype.digits = function(text) {
			if (!text) return null;
			text = text + '';
			return text.replace(/\D/g, '').trim();
		};

		// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		Utils.prototype.guid = function() {
			function s4() {
			    return Math.floor((1 + Math.random()) * 0x10000)
			               .toString(16)
			               .substring(1);
			}
			return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
		};

		return new Utils();
	}]);