var VERSION = '0.0.1';
var ENV = 'development';

angular
	.module('tl', [])
	.constant('VERSION', VERSION)
	.constant('ENV', ENV);

console.log('tablelist.js ' + VERSION + ' ' + ENV);