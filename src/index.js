/**
 * Tablelist.js
 *
 * Dependencies:
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular.min.js
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular-resource.min.js
 */
angular
  .module('tl', [
    'ngResource',
    'ngCookies',
    'ngWebSocket'
  ])
  .provider('TablelistSdk', function() {

    var TL_ENV = window.TL_ENV || 'production';
    var TL_CLIENT = window.TL_CLIENT || 'web';

    // Environments
    var ENV_DEV = TL_ENV === 'development';
    var ENV_PROD = TL_ENV === 'production';
    var ENV_LOCAL = TL_ENV === 'local';
    var ENV_TEST = TL_ENV === 'test';

    // API
    var API = {
      production: 'https://api.tablelist.com',
      development: 'https://api-dev.tablelist.com',
      local: 'http://localhost:3000',
      test: 'https://api-dev.tablelist.com'
    };

    // Web Socket
    var WS = {
      production: 'wss://ws.tablelist.com',
      development: 'wss://ws-dev.tablelist.com',
      local: 'ws://localhost:3000',
      test: 'wss://ws-dev.tablelist.com'
    };

    var config = {
      ENV: TL_ENV,
      CLIENT: TL_CLIENT,
      SUB_CLIENT: null,
      ENV_DEV: ENV_DEV,
      ENV_PROD: ENV_PROD,
      ENV_LOCAL: ENV_LOCAL,
      ENV_TEST: ENV_TEST,
      API: API[TL_ENV],
      WS: WS[TL_ENV],
      setSubclient: setSubclient,
      setVersion: setVersion,
      setApiKey: setApiKey
    };

    function setEnv(env) {
      var api = API[env];
      var ws = WS[env];

      if (!api) throw new Error('Enviroment : ' + env + ' is not valid');

      config.ENV = env;
      config.ENV_DEV = (env === 'development');
      config.ENV_PROD = (env === 'production');
      config.ENV_LOCAL = (env === 'local');
      config.ENV_TEST = (env === 'test');
      config.API = api;
      config.WS = ws;
    }

    function setSubclient(subclient) {
      config.SUB_CLIENT = subclient;
    }

    function setVersion(version) {
      config.VERSION = version;
    }

    function setUseAuthHeader(useAuthHeader) {
      config.useAuthHeader = useAuthHeader || false;
    }

    function setApiUrl(apiUrl) {
      config.API = apiUrl;
    }

    function setApiKey(apiKey) {
      config.apiKey = apiKey;
    }

    return {
      setEnv: setEnv,
      setSubclient: setSubclient,
      setVersion: setVersion,
      setUseAuthHeader: setUseAuthHeader,
      setApiUrl: setApiUrl,
      setApiKey: setApiKey,

      // needed for Provider
      $get: function() {
        return config;
      }

    };

  })
  .service('tl.config', ['TablelistSdk',
    function(tablelist) {
      return tablelist;
    }
  ]);
