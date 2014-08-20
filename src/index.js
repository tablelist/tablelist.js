/**
 * Tablelist.js
 * 
 * Dependencies: 
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-resource.min.js
 */
angular
	.module('tl', [ 'ngResource' ])
	.service('tl.config', function(){
		TL_ENV = window.TL_ENV || 'development';

		// Environments
		var ENV_DEV   = TL_ENV == 'development';
		var ENV_PROD  = TL_ENV == 'production';
		var ENV_LOCAL = TL_ENV == 'local';
		var ENV_TEST  = TL_ENV == 'test';

		// API
		var API = {
			production: 'https://api.tablelist.com',
			development: 'https://api-dev.tablelist.com',
			local: 'http://localhost:3000',
			test: 'https://api-dev.tablelist.com',
		};

		return {
			VERSION   : '0.0.4',
			DOMAIN    : 'tablelist.com',
			ENV       : TL_ENV,
			ENV_DEV   : ENV_DEV,
			ENV_PROD  : ENV_PROD,
			ENV_LOCAL : ENV_LOCAL,
			ENV_TEST  : ENV_TEST,
			API       : API[TL_ENV]
		}
	});