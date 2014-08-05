/**
 * Tablelist.js
 * 
 * Dependencies: 
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js
 *  - http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js
 */
angular
	.module('tl', [])
	.factory('tl.config', function(){
		return {
			
			VERSION: '0.0.1',
			
			ENV: 'development',
			
			DOMAIN: 'tablelist.com',

			API: 'https://api-dev.tablelist.com'
		}
	});