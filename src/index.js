/**
 * Tablelist.js
 * 
 * Dependencies: 
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-resource.min.js
 */
angular
	.module('tl', ['ngResource'])
	.factory('tl.config', function(){
		return {
			
			VERSION: '0.0.1',
			
			ENV: 'development',
			
			DOMAIN: 'tablelist.com',

			API: 'https://api-dev.tablelist.com',

			ENV_DEV: true,

			ENV_TEST: window.ENV_TEST
		}
	});