/**
 * Tablelist.js
 * 
 * Dependencies: 
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular.min.js
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular-resource.min.js
 */
angular
	.module('tl', [ 'ngResource' ])
	.service('tl.config', function(){
		var TL_ENV    = window.TL_ENV    || 'production';
		var TL_CLIENT = window.TL_CLIENT || 'web';

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
			ENV        : TL_ENV,
			CLIENT     : TL_CLIENT,
			SUB_CLIENT : null,
			ENV_DEV    : ENV_DEV,
			ENV_PROD   : ENV_PROD,
			ENV_LOCAL  : ENV_LOCAL,
			ENV_TEST   : ENV_TEST,
			API        : API[TL_ENV],
		}
	});

function tablelist(env, client) { 
	window.TL_ENV = env; 
	window.TL_CLIENT = client;
};