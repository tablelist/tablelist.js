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
    'ngWebsocket'
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
      test: 'https://api-dev.tablelist.com',
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
      useAuthHeader: false, //send auth token as query string, or header, defaults to query string

      setSubclient: setSubclient,
      setVersion: setVersion
    };

    function setEnv(env) {
      var api = API[env];
      if (!api) throw new Error('Enviroment : ' + env + ' is not valid');

      config.ENV = env;
      config.ENV_DEV = (env === 'development');
      config.ENV_PROD = (env === 'production');
      config.ENV_LOCAL = (env === 'local');
      config.ENV_TEST = (env === 'test');
      config.API = api;
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

    return {
      setEnv: setEnv,
      setSubclient: setSubclient,
      setVersion: setVersion,
      setUseAuthHeader: setUseAuthHeader,
      setApiUrl: setApiUrl,

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

angular
  .module('tl')
  .factory('tl.resource', [
    '$resource',
    'tl.http',
    function($resource, http) {
      'use strict';

      function _url(endpoint) {
        return http.apiUrl(endpoint);
      }

      function _params(params) {
        // do nothing for now
        return params;
      }

      function _actions(actions) {
        var _data = _commonActions();
        var actionKeys = Object.keys(actions);
        for (var i = 0; i < actionKeys.length; i++) {
          var key = actionKeys[i];
          _data[key] = actions[key];
        }

        var keys = Object.keys(_data);
        for (var n = 0; n < keys.length; n++) {
          var objectKey = keys[n];
          var action = _data[objectKey];
          if (action.url) {
            action.url = _url(action.url);
          }
        }

        return _data;
      }

      function _commonActions(endpoint) {
        return {

          /*==============================================================*
				/* CRUD: Default actions - get, query, save, remove|delete
				/*==============================================================*/

          update: {
            method: 'PUT',
            url: endpoint
          },

          /*==============================================================*
				/* Images
				/*==============================================================*/

          listImages: {
            method: 'GET',
            url: endpoint + '/image',
            isArray: true
          },
          addImage: {
            method: 'POST',
            url: endpoint + '/image',
            isArray: true
          },
          deleteImage: {
            method: 'DELETE',
            url: endpoint + '/image/:imageId',
            isArray: true
          },
          setPrimaryImage: {
            method: 'PUT',
            url: endpoint + '/image/:imageId',
            isArray: true
          }
        };
      }

      function _resource(endpoint, url, params, actions) {
        var resource = $resource(url, params, actions);
        resource.ENDPOINT = endpoint;
        resource.URL = url;
        return resource;
      }

      return function(endpoint, urlParams, defaultActions) {

        var url = _url(endpoint);
        var params = _params(urlParams);
        var actions = _actions(defaultActions);

        return _resource(endpoint, url, params, actions);
      };
    }
  ]);

angular
  .module('tl')
  .factory('tl.service', [
    'tl.http',
    'tl.keychain',
    function(http, tlKeychain) {
      'use strict';

      var Service = function(resource) {
        this.resource = resource;
      };

      var extend = function(resource) {
        var ExtendedService = function() {
          Service.call(this, resource);
        };

        var proto = Service.prototype;
        var keys = Object.keys(proto);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (key !== 'constructor') {
            ExtendedService.prototype[key] = proto[key];
          }
        }

        return ExtendedService;
      };

      /*==============================================================*
      /* Constants
      /*==============================================================*/

      var DEFAULT_LIMIT = 100;
      var DEFAULT_SORT = '-created';

      /*==============================================================*
      /* CRUD
      /*==============================================================*/

      Service.prototype.create = function(data, success, error) {
        return this.resource.save({}, data, success, error);
      };

      Service.prototype.read = function(id, success, error) {
        return this.resource.get({
          id: id
        }, success, error);
      };

      Service.prototype.update = function(id, data, success, error) {
        return this.resource.update({
          id: id
        }, data, success, error);
      };

      Service.prototype.delete = function(id, success, error) {
        return this.resource.delete({
          id: id
        }, success, error);
      };

      Service.prototype.list = function(limit, sort, success, error) {
        return this.resource.query({
          sort: sort || DEFAULT_SORT,
          limit: limit || DEFAULT_LIMIT
        }, success, error);
      };

      /*==============================================================*
      /* Query
      /*==============================================================*/

      Service.prototype.query = function(query, limit, sort, success, error) {
        var queryString = this.buildQueryString(query);
        if (!queryString) return null;

        return this.resource.query({
          query: queryString,
          sort: sort || DEFAULT_SORT,
          limit: limit || DEFAULT_LIMIT
        }, success, error);
      };

      Service.prototype.totals = function(query, sort, success, error) {
        var queryString = this.buildQueryString(query);
        if (!queryString) return null;

        return this.resource.query({
          total: true,
          query: queryString,
          sort: sort || DEFAULT_SORT
        }, success, error);
      };

      Service.prototype.buildQueryString = function(query) {
        try {
          return JSON.stringify(query);
        } catch (err) {
          return null;
        }
      };

      /*==============================================================*
      /* Images
      /*==============================================================*/

      Service.prototype.listImages = function(id, success, error) {
        return this.resource.listImages({
          id: id
        }, success, error);
      };

      Service.prototype.addImage = function(id, image, success, error) {
        image.id = id;
        return this.resource.addImage(image, success, error);
      };

      Service.prototype.deleteImage = function(id, imageId, success, error) {
        return this.resource.deleteImage({
          id: id,
          imageId: imageId
        }, success, error);
      };

      Service.prototype.setPrimaryImage = function(id, imageId, success, error) {
        return this.resource.setPrimaryImage({
          id: id,
          imageId: imageId
        }, success, error);
      };

      Service.prototype.exportUrl = function(query, sort) {
        var endpoint = this.resource.ENDPOINT;
        var index = this.resource.ENDPOINT.indexOf(":");
        if (index > -1) endpoint = endpoint.substring(0, index);
        var url = this.resource.URL.substring(0, this.resource.URL.lastIndexOf(":") - 1);
        url += "?query=" + encodeURIComponent(JSON.stringify(query));
        url += "&sort=" + sort;
        url += "&admin=" + true;
        url += "&csv=" + true;
        url += "&auth=" + tlKeychain.authToken();
        return url;
      };

      return {
        extend: extend,
        common: Service
      };
    }
  ]);

/**
 * Angular module for setting, reading and removing cookies
 *
 * @src: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 */
angular
  .module('tl')
  .factory('tl.cookie', ['tl.config', 'tl.storage', function(config, storage) {

    var DOMAIN = '.tablelist.com';

    var Cookie = function() {};

    Cookie.prototype.get = function(sKey) {
      var obj = storage.get(sKey);
      var sval = obj ? obj.cookie : null;
      var cval = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      return sval || cval;
    };

    Cookie.prototype.set = function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sValue) return this.remove(sKey, sPath, sDomain);
      storage.set(sKey, {
        cookie: sValue
      });
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }
      if (!sPath) sPath = '/';
      if (!vEnd) vEnd = Infinity;
      if (!sDomain) sDomain = DOMAIN;
      if (config.ENV_PROD) bSecure = true;
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      var cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      document.cookie = cookie;
      return true;
    };

    Cookie.prototype.remove = function(sKey, sPath, sDomain) {
      if (!sDomain) sDomain = DOMAIN;
      storage.remove(sKey);
      if (!sKey || !this.exists(sKey)) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    };

    Cookie.prototype.exists = function(sKey) {
      return storage.exists(sKey) || (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    };

    return new Cookie();
  }]);

/**
 * Node.js style EventEmitter
 */
angular
	.module('tl')
	.factory('tl.ee', ['$rootScope', function($rootScope){

		var Event = function(){};

		Event.prototype.on = function(name, callback) {
			return $rootScope.$on(name, callback);
		};

		Event.prototype.emit = function(name, obj1, obj2, obj3) {
			return $rootScope.$emit(name, obj1, obj2, obj3);
		};

		return new Event();
	}]);

angular
	.module('tl')
	.factory('tl.facebook', ['tl.config', function(config){

		var PERMISSIONS = [ 'public_profile', 'email', 'user_friends' ];

		var Facebook = function(){};

		Facebook.prototype.login = function(next) {
			try {
				return FB.login(function(response){
					if (response && response.authResponse) {
						var accessToken = response.authResponse.accessToken;
		                next(null, accessToken);
					} else {
						next(response);
					}
				}, { scope: PERMISSIONS });
			} catch(err) {
				return false;
			}
		};

		Facebook.prototype.events = function() {
			try {
				return FB.AppEvents.EventNames;
			} catch(err) {
				return {};
			}
		};

		Facebook.prototype.logEvent = function() {
			if (!config.ENV_PROD) return;

			try {
				return FB.AppEvents.logEvent.apply(this, arguments);
			} catch(err) {
				return false;
			}
		};

		Facebook.prototype.logPurchase = function() {
			if (!config.ENV_PROD) return;

			try {
				return FB.AppEvents.logPurchase.apply(this, arguments);
			} catch(err) {
				return false;
			}
		};

		return new Facebook();
	}]);

angular
  .module('tl')
  .factory('tlHTTPInterceptor', [
    'tl.config',
    'tl.keychain',
    '$rootScope',
    '$q',
    function(config, keychain, $rootScope, $q) {
      'use strict';

      return {
        request: function(data) {
          data.headers = data.headers || {};

          var token = keychain.authToken();
          var isApi = data.url.indexOf(config.API) >= 0;
          var hasParams = data.url.indexOf('?') >= 0;
          if (isApi && !hasParams) {
            data.url = data.url += '?';
          }
          if (isApi && token) {
            if (config.useAuthHeader) data.headers['x-access-token'] = token;
            else data.url = data.url + '&auth=' + token;
          }
          if (isApi && !token) {
            var ptoken = keychain.prospectToken();
            data.url = data.url + '&prospect=' + ptoken;
          }
          if (isApi && config.CLIENT) {
            var client = config.CLIENT;
            var subClient = config.SUB_CLIENT;
            if (subClient) {
              client = client + '-' + subClient;
            }
            data.url = data.url + '&client=' + client;
          }
          if (isApi && config.VERSION) {
            var version = config.VERSION;
            data.url = data.url + '&version=' + version;
          }
          data.url = data.url.replace('?&', '?');
          return data;
        },
        responseError: function(response) {

          if (response.status === 401) {
            $rootScope.$emit('unauthorized');
          }

          return $q.reject(response);
        }
      };
    }
  ])
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('tlHTTPInterceptor');
  }])
  .factory('tl.http', ['$http', 'tl.keychain', 'tl.config', function($http, keychain, config) {

    var HTTP = function() {};

    HTTP.prototype.get = function(endpoint, params) {
      return $http.get(this.apiUrl(endpoint, params));
    };

    HTTP.prototype.post = function(endpoint, body, options) {
      return $http.post(this.apiUrl(endpoint), body, options);
    };

    HTTP.prototype.put = function(endpoint, body, options) {
      return $http.put(this.apiUrl(endpoint), body, options);
    };

    HTTP.prototype.delete = function(endpoint, params) {
      return $http.delete(this.apiUrl(endpoint, params));
    };

    HTTP.prototype.upload = function(endpoint, query, body) {
      return $http.post(this.apiUrl(endpoint, query), body, {
        headers: {
          'Content-Type': undefined
        },
        transformRequest: angular.identity
      });
    };

    HTTP.prototype.apiUrl = function(endpoint, params) {
      params = params || {};

      // use leading slash
      if (endpoint.slice(0, 1) !== '/') {
        endpoint = '/' + endpoint;
      }

      // create url parameter string
      var data = [];
      var keys = Object.keys(params);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = params[key];
        var param = encodeURIComponent(key) + '=' + encodeURIComponent(val);
        data.push(param);
      }

      // create url
      var url = config.API + endpoint;
      if (data.length > 0) {
        url += '?' + data.join('&');
      }
      return url;
    };

    return new HTTP();
  }]);

angular
  .module('tl')
  .factory('tl.keychain', ['tl.cookie', 'tl.utils', 'tl.config',
    function(cookie, utils, config) {
      'use strict';

      // constants

      var SUFFIX = config.ENV_PROD ? '' : '_dev';
      var AUTH_KEY = 'tl_auth' + SUFFIX;
      var PROSPECT_KEY = 'tl_prospect' + SUFFIX;

      // in-memory auth and prospect tokens

      var _authToken = null;
      var _prospectToken = null;

      // service

      var Keychain = function() {};

      Keychain.prototype.authToken = function() {
        return _authToken || (function(){
          _authToken = cookie.get(AUTH_KEY);
          return _authToken;
        })();
      };

      Keychain.prototype.setAuthToken = function(token) {
        _authToken = token || null;
        return cookie.set(AUTH_KEY, token);
      };

      Keychain.prototype.prospectToken = function() {
        var token = _prospectToken || (function(){
          _prospectToken = cookie.get(PROSPECT_KEY);
          return _prospectToken;
        })();
        if (!token) {
          token = utils.guid(16, '-');
          this.setProspectToken(token);
        }
        return token;
      };

      Keychain.prototype.setProspectToken = function(token) {
        _prospectToken = token || null;
        return cookie.set(PROSPECT_KEY, token);
      };

      return new Keychain();
    }
  ]);


angular
	.module('tl')
	.factory('tl.query', ['tl.config','$location', function(config, $location){

		var Query = function(){};

		Query.prototype.params = function() {
			return $location.search() || {};
		};

		Query.prototype.subdomain = function() {
			return window.location.hostname.split('.')[0];
		};

		Query.prototype.get = function(key) {
			return this.params()[key];
		};

		Query.prototype.set = function(key, value) {
			var data = this.params();
			data[key] = value;
			$location.search(data);
		};

		return new Query();
	}]);

angular
	.module('tl')
	.factory('tl.session', [function(){

		var CACHE = {};

		var Session = function() {};

		Session.prototype.get = function(key) {
		  var json = null;
		  try {
		    var val = sessionStorage.getItem(key);
		    json = JSON.parse(val);
		  } catch (e) {
		    json = CACHE[key];
		  }
		  return json;
		};

		Session.prototype.set = function(key, obj) {
		  if (obj) {
		    var success = null;
		    try {
		      var val = JSON.stringify(obj);
		      success = sessionStorage.setItem(key, val);
		    } catch (e) {
		      CACHE[key] = obj;
		      success = true;
		    }
		    return success;
		  } else {
		    this.remove(key);
		  }
		};

		Session.prototype.remove = function(key) {
		  var removed = null;
		  try {
		    removed = sessionStorage.removeItem(key);
		  } catch(e) {
		    delete CACHE[key];
		    removed = true;
		  }
		  return removed;
		};

		Session.prototype.exists = function(key) {
		  var exists = null;
		  try {
		    exists = this.get(key) !== null && this.get(key) !== undefined;
		  } catch(e) {
		    exists = CACHE[key] ? true : false;
		  }
		  return exists;
		};

		Session.prototype.clear = function() {
		  var cleared = null;
		  try {
		    cleared = sessionStorage.clear();
		  } catch(e) {
		    CACHE = {};
		    cleared = true;
		  }
		  return cleared;
		};

		return new Session();
	}]);


angular
	.module('tl')
	.factory('tl.socket', ['$websocket', 'tl.http', 'tl.keychain', function($websocket, http, keychain){

    var PING_INTERVAL = 5 * 1000; // ping every 5 seconds
    var MAX_EVENTS = 200; // hold on to 200 events max

    return function(endpoint, onMessage, onError) {
      onMessage = onMessage || function() {};
      onError = onError || function() {};

      // instance vars
      var _events = [];
      var PING = 'ping';
      var PONG = 'pong';
      var ws = null;
      var interval = null;

      this.connect = function() {

        this.ws = ws = $websocket.$new({
          url: this.socketUrl(endpoint),
          lazy: true,
					reconnect: true,
          reconnectInterval: 250 // it will reconnect after 0.25 seconds
        });

        ws.$on('$open', function() {
          interval = window.setInterval(function() {
            ws.$$ws.send(PING);
          }, PING_INTERVAL);
        });

        ws.$on('$message', function(data) {
          if (data === PONG) return;
          _events.unshift(data);
          onMessage(data);
          if (_events.length >= MAX_EVENTS) {
            _events.pop();
          }
        });

        ws.$on('$close', function() {
          window.clearInterval(interval);
        });

				ws.$open();

				return this;
      };

      this.events = function() {
        return _events;
      };

      this.isConnected = function() {
        return ws.$status() === ws.$OPEN;
      };

      this.close = function() {
        return ws.$close();
      };

      this.socketUrl = function(endpoint) {
        var auth = keychain.authToken();
        var prospect = keychain.prospectToken();

        var params = {};
        if (prospect) params.prospect = prospect;
        if (auth) params.auth = auth;

        var url = http.apiUrl(endpoint, params);
        return url.replace('http', 'ws');
      };
    };
	}]);

angular
  .module('tl')
  .factory('tl.storage', [function() {
    'use strcit';

    var CACHE = {};

    var Storage = function() {};

    Storage.prototype.get = function(key) {
      var json = null;
      try {
        var val = localStorage.getItem(key);
        json = JSON.parse(val);
      } catch (e) {
        json = CACHE[key];
      }
      return json;
    };

    Storage.prototype.set = function(key, obj) {
      if (obj) {
        var success = null;
        try {
          var val = JSON.stringify(obj);
          success = localStorage.setItem(key, val);
        } catch (e) {
          CACHE[key] = obj;
          success = true;
        }
        return success;
      } else {
        this.remove(key);
      }
    };

    Storage.prototype.remove = function(key) {
      var removed = null;
      try {
        removed = localStorage.removeItem(key);
      } catch(e) {
        delete CACHE[key];
        removed = true;
      }
      return removed;
    };

    Storage.prototype.exists = function(key) {
      var exists = null;
      try {
        exists = this.get(key) !== null && this.get(key) !== undefined;
      } catch(e) {
        exists = CACHE[key] ? true : false;
      }
      return exists;
    };

    Storage.prototype.clear = function() {
      var cleared = null;
      try {
        cleared = localStorage.clear();
      } catch(e) {
        CACHE = {};
        cleared = true;
      }
      return cleared;
    };

    return new Storage();
  }]);


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

		Utils.prototype.csv = function(lines) {
			var result = "data:text/csv;charset=utf-8,";
			result += lines.map(function(line){
				return line.map(function(text){
					return text && text.replace ? text.replace(/,/gi, '') : text;
				}).join(',');
			}).join('\n');
			window.open(encodeURI(result));
		};

		return new Utils();
	}]);

angular
	.module('tl')
	.service('tl.affiliatesale', ['tl.affiliatesale.resource', 'tl.affiliatesale.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular.module('tl').factory('tl.affiliatesale.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/affiliate-sale';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      },
      update: {
        method: 'PUT',
        url: endpoint + '/:id'
      }
    });
  }
]);

angular.module('tl').service('tl.affiliatesale.service', [
  'tl.affiliatesale.resource',
  'tl.service',
  function(AffiliateSale, Service) {
    'use strict';

    var AffiliateSaleService = Service.extend(AffiliateSale);

    AffiliateSaleService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return AffiliateSale.list(options).$promise;
    };

    return new AffiliateSaleService();
  }
]);


angular
	.module('tl')
	.service('tl.affiliate', ['tl.affiliate.resource', 'tl.affiliate.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular.module('tl').factory('tl.affiliate.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/affiliate/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      getById: {
        method: 'GET',
        url: endpoint,
        isArray: false
      },
      getPayoutStructuresById: {
        method: 'GET',
        url: endpoint + '/payoutstructure',
        isArray: true
      },
      create: {
        method: 'POST',
        url: 'affiliate',
        isArray: false
      },
      update: {
        method: 'PATCH',
        url: endpoint,
        isArray: false
      },
      list: {
        method: 'GET',
        url: 'affiliate',
        isArray: true
      },
      listSales: {
        method: 'GET',
        url: endpoint + '/sale',
        isArray: true
      },
      getSalesTotal: {
        method: 'GET',
        url: endpoint + '/sale/total'
      },
      getSalesLeaderboard: {
        method: 'GET',
        url: endpoint + '/leaderboard',
        isArray: true
      },
      getPayoutPeriod: {
        method: 'GET',
        url: endpoint + '/payout-period',
        isArray: true
      },
      getPromoCode: {
        method: 'GET', 
        url: endpoint + '/promo',
        isArray: true
      },
      getTrackers: {
        method: 'GET', 
        url: endpoint + '/tracker',
        isArray: true
      }
    });
  }
]);

angular.module('tl').service('tl.affiliate.service', [
  'tl.affiliate.resource',
  'tl.service',
  '$http',
  'tl.http',
  function(Affiliate, Service, $http, http) {
    'use strict';

    var AffiliateService = Service.extend(Affiliate);

    AffiliateService.prototype.getById = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getById(options).$promise;
    };

    AffiliateService.prototype.getPayoutStructuresById = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getPayoutStructuresById(options).$promise;
    };

    AffiliateService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      return Affiliate.list(options).$promise;
    };

    AffiliateService.prototype.create = function(options) {
      if (!options) throw new Error('options is required');

      return Affiliate.create({}, options).$promise;
    };

    AffiliateService.prototype.update = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var affiliateId = options.id;
      delete options.id;

      return Affiliate.update({
        id: affiliateId
      }, options).$promise;
    };

    AffiliateService.prototype.listSales = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.listSales(options).$promise;
    };

    AffiliateService.prototype.getSalesTotal = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getSalesTotal(options).$promise;
    };

    AffiliateService.prototype.listSalesAsCsv = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var affiliateId = options.id;
      delete options.id;

      return $http.get(http.apiUrl('/affiliate/' + affiliateId + '/sale'), {
        params: options,
        data: '', //needed, otherwise the content-type header is not sent (the req must have a body)
        headers: {
          'Content-Type': 'text/csv'
        }
      });
    };

    AffiliateService.prototype.getSalesLeaderboard = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getSalesLeaderboard(options).$promise;
    };

    AffiliateService.prototype.getPayoutPeriod = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Affiliate.getPayoutPeriod(options).$promise;
    };

    AffiliateService.prototype.getPromoCode = function(options) {
      if(!options) throw new Error('options is required');
      if(!options.id) throw new Error('options.id is required');

      return Affiliate.getPromoCode(options).$promise;
    };

    AffiliateService.prototype.listTrackers = function(options) {
      if(!options) throw new Error('options is required');
      if(!options.id) throw new Error('options.id is required');

      return Affiliate.getTrackers(options).$promise;
    };

    return new AffiliateService();
  }
]);

angular
	.module('tl')
	.service('tl.affiliatepayout', ['tl.affiliatepayout.resource', 'tl.affiliatepayout.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular.module('tl').factory('tl.affiliatepayout.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/affiliate-payout';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      },
      update: {
        method: 'PUT',
        url: endpoint + '/:id',
      }
    });
  }
]);
angular.module('tl').service('tl.affiliatepayout.service', [
  'tl.affiliatepayout.resource',
  'tl.service',
  function(AffiliatePayout, Service) {
    'use strict';

    var AffiliatePayoutService = Service.extend(AffiliatePayout);

    AffiliatePayoutService.prototype.list = function(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return AffiliatePayout.list(options).$promise;
    };

    return new AffiliatePayoutService();
  }
]);


angular
	.module('tl')
	.service('tl.ambassador ', ['tl.ambassador.resource', 'tl.ambassador.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular
  .module('tl')
  .factory('tl.ambassador.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/ambassador';

      return resource(endpoint, {
        id: '@id'
      }, {
        getAll: {
          method: 'GET',
          url: 'ambassador',
          isArray: true
        }
      });
    }
  ]);

angular
  .module('tl')
  .service('tl.ambassador.service', ['tl.service', 'tl.ambassador.resource',
    function(Service, Ambassador) {

      var AmbassadorService = Service.extend(Ambassador);

      AmbassadorService.prototype.getAll = function(){
        return Ambassador.getAll();
      };

      return new AmbassadorService();
    }
  ]);


angular
	.module('tl')
	.service('tl.answer', ['tl.answer.resource', 'tl.answer.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular
  .module('tl')
  .factory('tl.answer.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/answer';

      return resource(endpoint, {
        // nothing here
      }, {});
    }
  ]);

angular
  .module('tl')
  .service('tl.answer.service', ['tl.service', 'tl.answer.resource',
    function(Service, Answer) {

      var AnswerService = Service.extend(Answer);

      return new AnswerService();
    }
  ]);

angular
  .module('tl')
  .service('tl.auth', ['tl.auth.resource', 'tl.auth.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular.module('tl').factory('tl.auth.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/auth';

    return resource(endpoint, {
      // nothing here
    }, {

      register: {
        method: 'POST',
        url: endpoint + '/register',
        isArray: false
      },

      login: {
        method: 'POST',
        url: endpoint + '/login',
        isArray: false
      },

      loginFacebook: {
        method: 'POST',
        url: endpoint + '/facebook',
        isArray: false
      },

      forgotPassword: {
        method: 'POST',
        url: endpoint + '/forgot',
        isArray: false
      },

      resetPassword: {
        method: 'POST',
        url: endpoint + '/reset',
        isArray: false
      }

    });
  }
]);

angular.module('tl').service('tl.auth.service', [
  'tl.auth.resource',
  'tl.keychain',
  'tl.user.service',
  'tl.facebook',
  function(Auth, keychain, user, fb) {
    'use strict';

    var AuthService = function() {};

    /**
     * Gets the current users auth token from the keychain
     */
    AuthService.prototype.authToken = function() {
      return keychain.authToken();
    };

    /**
     * Determine if we should consider this user as logged in
     * Important to use this function instead of checking at
     * the client level
     */
    AuthService.prototype.isLoggedIn = function() {
      return this.authToken() ? true : false;
    };

    /**
     * Stores an auth token in the keychain
     */
    AuthService.prototype.setAuthToken = function(token) {
      return keychain.setAuthToken(token);
    };

    /**
     * Registers a new user
     */
    AuthService.prototype.register = function(options, success, error) {
      success = success || function() {};

      if (!options) throw new Error('options is required');
      if (!options.email) throw new Error('options.email is required');
      if (!options.password) throw new Error('options.password is required');
      if (!options.firstName) throw new Error('options.firstName is required');
      if (!options.lastName) throw new Error('options.lastName is required');

      var _this = this;

      // clear current auth and user
      _this.setAuthToken(null);
      user.setCurrentUser(null);

      return Auth.register({}, options).$promise.then(function(auth) {
        _this.setAuthToken(auth.token);
        user.setCurrentUser(auth.user);
        success(auth);
      }, error);
    };

    /**
     * Logs in a user via email and password
     */
    AuthService.prototype.login = function(email, password, success, error) {
      success = success || function() {};

      var _this = this;

      // clear current auth and user
      _this.setAuthToken(null);
      user.setCurrentUser(null);

      return Auth.login({}, {
          email: email,
          password: password
        })
        .$promise.then(function(auth) {
          _this.setAuthToken(auth.token);
          user.setCurrentUser(auth.user);
          success(auth);
        }, error);
    };

    /**
     * Attempts to login a user via Facebook
     */
    AuthService.prototype.loginWithFacebook = function(success, error) {
      success = success || function() {};

      var _this = this;

      // clear current auth and user
      _this.setAuthToken(null);
      user.setCurrentUser(null);

      fb.login(function(err, token) {
        if (err) {
          return error(err);
        } else {
          return Auth.loginFacebook({}, {
              facebookToken: token
            })
            .$promise.then(function(auth) {
              _this.setAuthToken(auth.token);
              user.setCurrentUser(auth.user);
              success(auth);
            }, error);
        }
      });
    };

    /**
     * Logs out the current user
     */
    AuthService.prototype.logout = function() {
      this.setAuthToken(null);
      user.setCurrentUser(null);
      keychain.setProspectToken(null);
      return true;
    };

    /**
     * Sends a reset password to the given email address
     */
    AuthService.prototype.forgotPassword = function(email, success, error) {
      return Auth.forgotPassword({}, {
        email: email
      }, success, error);
    };

    /**
     * Resets a users password based on token recieved from forgot password email
     */
    AuthService.prototype.resetPassword = function(token, password, success, error) {
      return Auth.resetPassword({}, {
        resetToken: token,
        password: password
      }, success, error);
    };

    return new AuthService();
  }
]);


angular
	.module('tl')
	.service('tl.booking', ['tl.booking.resource', 'tl.booking.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular.module('tl').factory('tl.booking.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/booking/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      read: {
        method: 'GET',
        url: endpoint
      },
      create: {
        method: 'POST',
        url: 'booking'
      },
      complete: {
        method: 'POST',
        url: endpoint + '/complete'
      },
      void: {
        method: 'POST',
        url: endpoint + '/void'
      },
      refund: {
        method: 'POST',
        url: endpoint + '/refund'
      },
      cancellation: {
        method: 'POST',
        url: endpoint + '/cancellation'
      },
      join: {
        method: 'POST',
        url: 'booking/join'
      },
      decline: {
        method: 'POST',
        url: endpoint + '/decline'
      },
      updateBookingUser: {
        method: 'PUT',
        url: endpoint + '/users/:userId'
      },
      listOutgoingPayment: {
        method: 'GET',
        url: endpoint + '/outgoing-payment',
        isArray: true
      },
      createOutgoingPayment: {
        method: 'POST',
        url: endpoint + '/outgoing-payment',
      },
      readSplitTable: {
        method: 'GET',
        url: 'booking/split/:code'
      },
      listTerms: {
        method: 'GET',
        url: 'booking/:id/terms',
        isArray: true
      },
      addCondition: {
        method: 'POST',
        url: 'booking/:id/condition'
      },
      accept: {
        method: 'POST',
        url: 'booking/:id/accept'
      },
      authorize: {
        method: 'POST',
        url: 'booking/:id/authorize'
      },
      refundBookingUser: {
        method: 'POST',
        url: endpoint + '/user/:userId/refund',
      },
      listBookingTickets: {
        method: 'GET',
        url: endpoint + '/ticket',
        isArray: true
      }
    });
  }
]);

angular.module('tl').service('tl.booking.service', [
  'tl.booking.resource',
  'tl.service',
  function(Booking, Service) {
    'use strict';

    /*==============================================================*
    /* Constants
    /*==============================================================*/
    var DEFAULT_LIMIT = 100;
    var DEFAULT_SORT = '-created';

    /*==============================================================*
    /* Constructor
    /*==============================================================*/
    var BookingService = Service.extend(Booking);

    BookingService.prototype.read = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Booking.read(options).$promise;
    };

    BookingService.prototype.query = function(options) {
      if (!options) throw new Error('options is required');

      var opts = {};
      var _this = this;

      opts.sort = options.sort || DEFAULT_SORT;
      opts.limit = options.limit || DEFAULT_LIMIT;
      opts.admin = options.admin || false;
      opts.select = options.select || opts.select;
      delete options.sort;
      delete options.limit;
      delete options.admin;
      delete options.select;
      opts.query = options;
      opts.query = _this.buildQueryString(opts.query);

      return Booking.query(opts).$promise;
    };

    BookingService.prototype.create = function(options) {
      if (!options) throw new Error('options is required');

      return Booking.create({}, options).$promise;
    };

    BookingService.prototype.complete = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var bookingId = options.id;
      delete options.id;

      return Booking.complete({
        id: bookingId
      }, options).$promise;
    };

    BookingService.prototype.void = function(id, options, success, error) {
      return Booking.void({
        id: id
      }, options, success, error);
    };

    BookingService.prototype.refund = function(id, amount, reason, success, error) {
      return Booking.refund({}, {
        id: id,
        money: amount,
        reason: reason
      }, success, error);
    };

    BookingService.prototype.cancellation = function(id, amount) {
      if (!id) throw new Error('id is required');
      if (!amount) throw new Error('amount is required');

      return Booking.cancellation({
        id: id
      }, {
        amount: amount
      }).$promise;
    };

    BookingService.prototype.join = function(splitCode, success, error) {
      return Booking.join({}, {
        splitCode: splitCode,
      }, success, error);
    };

    BookingService.prototype.decline = function(id, userId, success, error) {
      return Booking.decline({
        id: id
      }, {
        userId: userId
      }, success, error);
    };

    BookingService.prototype.updateBookingUser = function(id, userId, updates, success, error) {
      return Booking.updateBookingUser({
        id: id,
        userId: userId
      }, updates, success, error);
    };

    BookingService.prototype.listOutgoingPayment = function(id, success, error) {
      return Booking.listOutgoingPayment({
        id: id,
      }, success, error);
    };

    BookingService.prototype.createOutgoingPayment = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var id = options.id;
      delete options.id;

      return Booking.createOutgoingPayment({
        id: id,
      }, options).$promise;
    };

    BookingService.prototype.readSplitTable = function(splitCode, success, error) {
      return Booking.readSplitTable({
        code: splitCode
      }, {}, success, error);
    };

    BookingService.prototype.listTerms = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Booking.listTerms(options).$promise;
    };

    BookingService.prototype.addCondition = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');
      if (!options.condition) throw new Error('options.condition is required');

      var id = options.id;
      delete options.id;

      return Booking.addCondition({
        id: id
      }, options).$promise;
    };

    BookingService.prototype.accept = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');
      if (!options.userId) throw new Error('options.userId is required');
      if (!options.paymentProfileId) throw new Error('options.paymentProfileId is required');

      var id = options.id;
      delete options.id;

      return Booking.accept({
        id: id
      }, options).$promise;
    };

    BookingService.prototype.authorize = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');
      if (!options.userId) throw new Error('options.userId is required');
      if (!options.paymentProfileId) throw new Error('options.paymentProfileId is required');

      var id = options.id;
      delete options.id;

      return Booking.authorize({
        id: id
      }, options).$promise;
    };

    BookingService.prototype.refundBookingUser = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');
      if (!options.userId) throw new Error('options.userId is required');
      if (!options.type) throw new Error('options.type is required');

      var id = options.id;
      delete options.id;
      var userId = options.userId;
      delete options.userId;

      return Booking.refundBookingUser({
        id: id,
        userId: userId
      }, options).$promise;
    };

    BookingService.prototype.listBookingTickets = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var id = options.id;
      delete options.id;

      return Booking.listBookingTickets({
        id: id,
      }, options).$promise;
    };

    BookingService.prototype.update = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      var id = options.id;
      delete options.id;

      return Booking.update({
        id: id,
      }, options).$promise;
    };

    return new BookingService();
  }
]);


angular
	.module('tl')
	.service('tl.campaign', ['tl.campaign.resource', 'tl.campaign.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.campaign.resource', ['tl.resource', function(resource){
		
		var endpoint = '/campaign/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			
		});
	}]);

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


angular
	.module('tl')
	.service('tl.city', ['tl.city.resource', 'tl.city.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular.module('tl').factory('tl.city.resource', [
  'tl.resource',
  function(resource) {
    return resource('/city/:id', {
      id: '@id'
    }, {
      // no extra methods
    });
  }
]);

angular.module('tl').service('tl.city.service', [
  'tl.service',
  'tl.city.resource',
  function(Service, City) {

    var CityService = Service.extend(City);

    return new CityService();
  }
]);


angular
	.module('tl')
	.service('tl.client', ['tl.client.resource', 'tl.client.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.client.resource', ['tl.resource', function(resource){

		var endpoint = '/client';

		return resource(endpoint, {
			// nothing here 
		}, {
			paymentToken: {
				method: 'POST',
				url: endpoint + '/paymentToken',
				isArray: false
			},
			startup: {
				method: 'GET',
				url: endpoint + '/startup',
				isArray: false
			}
		});
	}]);

angular
	.module('tl')
	.service('tl.client.service', ['tl.service', 'tl.client.resource', function(Service, Client){

		var ClientService = function(){};

		/**
		 * Generate new merchant payment token (for use with Braintree API)
		 */
		ClientService.prototype.paymentToken = function() {
			return Client.paymentToken().$promise;
		};

		/**
		 * Get's the startup config object
		 */
		ClientService.prototype.startup = function() {
			return Client.startup().$promise;
		};

		return new ClientService();
	}]);

angular
	.module('tl')
	.service('tl.event', ['tl.event.resource', 'tl.event.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular
  .module('tl')
  .factory('tl.event.resource', ['tl.resource', function(resource) {

    var endpoint = '/event/:id';

    return resource(endpoint, {
      id: '@id',
      imageId: '@imageId'
    }, {
      update: {
        method: 'PATCH',
        url: endpoint,
        isArray: false
      },
      list: {
        method: 'GET',
        url: '/event',
        isArray: true
      },
      listForCity: {
        method: 'GET',
        url: '/city/:cityId/event',
        isArray: true
      },
      addStaff: {
        method: 'POST',
        url: endpoint + '/staff',
        isArray: false
      },
      updateStaff: {
        method: 'PUT',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
      deleteStaff: {
        method: 'DELETE',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
    });
  }]);

angular
  .module('tl')
  .service('tl.event.service', ['tl.service', 'tl.event.resource', function(Service, Event) {

    var EventService = Service.extend(Event);

    EventService.prototype.list = function list(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return Event.list(options).$promise;
    };

    EventService.prototype.read = function read(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Event.get(options).$promise;
    };

    EventService.prototype.create = function create(options) {
      if (!options) throw new Error('options is required');

      return Event.save({}, options).$promise;
    };

    EventService.prototype.update = function update(options) {
      if (!options) throw new Error('options is required');
      if (!options.id) throw new Error('options.id is required');

      return Event.update({
        id: options.id
      }, options).$promise;
    };

    /*==============================================================*
    /* Cities
    /*==============================================================*/

   /**
    * List of events for the provided city. 
    * Returns a promise. Supports additional 'options'.
    *
    * @method listForCity
    * @param [Object] options 
    * @param [String] options.cityId - ID of a city
    * @param {String} options.fields - CSV of fields to return
    * @param {String} options.start  - unix start date for events
    * @param {String} options.end    - unix end date for events
    */

    EventService.prototype.listForCity = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.cityId) throw new Error('options.cityId is required');

      return Event.listForCity(options).$promise;
    };

    EventService.prototype.listCityTonight = function(cityId, success, error) {
      return Event.listCityTonight({
        cityId: cityId
      }, success, error);
    };

    EventService.prototype.addStaff = function(eventId, userId, success, error) {
      return Event.addStaff({
        id: eventId
      }, {
        userId: userId
      }, success, error);
    };

    EventService.prototype.updateStaff = function(eventId, staffId, updates, success, error) {
      return Event.updateStaff({
        id: eventId,
        staffId: staffId
      }, updates, success, error);
    };

    EventService.prototype.deleteStaff = function(eventId, staffId, success, error) {
      return Event.deleteStaff({
        id: eventId,
        staffId: staffId
      }, success, error);
    };

    return new EventService();
  }]);

angular
  .module('tl')
  .service('tl.feed', ['tl.feed.resource', 'tl.feed.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.feed.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/feed';

      return resource(endpoint, {
        id: '@id',
        userId: '@userId'
      }, {
        create: {
          method: 'POST',
          url: endpoint,
          isArray: true
        },
        remove: {
          method: 'DELETE',
          url: endpoint + '/:id',
          isArray: false
        },
        list: {
          method: 'GET',
          url: endpoint,
          isArray: true
        },
        listUserFeed: {
          method: 'GET',
          url: '/user/:userId/feed',
          isArray: true
        },
        addLike: {
          method: 'POST',
          url: endpoint + '/:id/like',
          isArray: false
        },
        removeLike: {
          method: 'DELETE',
          url: endpoint + '/:id/like',
          isArray: false
        }
      });
    }
  ]);

angular
  .module('tl')
  .service('tl.feed.service', ['tl.service', 'tl.feed.resource',
    function(Service, Feed) {

      var FeedService = Service.extend(Feed);

      FeedService.prototype.create = function(options) {
        if (!options) throw new Error('FeedService.create - options is required');

        return Feed.create({}, options).$promise;
      };

      FeedService.prototype.remove = function(feedId, options) {
        if (!feedId) throw new Error('FeedService.remove - feedId is required');
        options = options || {};

        options.id = feedId;

        return Feed.remove(options).$promise;
      };

      FeedService.prototype.list = function(options) {
        options = options || {};
        return Feed.list(options).$promise;
      };

      FeedService.prototype.listUserFeed = function(userId, options) {
        if (!userId) throw new Error('FeedService.listUserFeed - userId is required');
        options = options || {};

        options.userId = userId;

        return Feed.listUserFeed(options).$promise;
      };

      FeedService.prototype.addLike = function(feedId, options) {
        if (!feedId) throw new Error('FeedService.addLike - feedId is required');

        return Feed.addLike({ id: feedId }, options).$promise;
      };

      FeedService.prototype.removeLike = function(feedId, options) {
        if (!feedId) throw new Error('FeedService.removeLike - feedId is required');

        return Feed.removeLike({ id: feedId }, options).$promise;
      };

      return new FeedService();
    }
  ]);

angular
  .module('tl')
  .service('tl.image', ['tl.image.resource', 'tl.image.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.image.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/image';

      return resource(endpoint, {}, {

        // upload: {
        //   method: 'POST',
        //   url: endpoint,
        //   headers: {
        //     'Content-Type': undefined
        //   }
        // }
        
      });
    }
  ]);

angular
  .module('tl')
  .service('tl.image.service', ['tl.service', 'tl.image.resource', 'tl.http', '$q',
    function(Service, Image, tlhttp, $q) {

      var ImageService = Service.extend(Image);

      ImageService.prototype.upload = function(file, options) {

        var deferred = $q.defer();

        var formData = new FormData();
        formData.append('image', file);

        var maxFileSize = 16000000; //16mb

        if (file.size > maxFileSize) {
          deferred.reject('File cannot be greater than 4mb');
        }

        tlhttp.upload('/image', options, formData)
          .success(function(data, status, headers, config) {
            deferred.resolve(data, status, headers, config);
          })
          .error(function(data, status, headers, config) {
            deferred.reject(data, status, headers, config);
          });

        return deferred.promise;
      };

      return new ImageService();
    }
  ]);


angular
	.module('tl')
	.service('tl.inquiry', ['tl.inquiry.resource', 'tl.inquiry.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.inquiry.resource', ['tl.resource', function(resource){

		var endpoint = '/inquiry/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
	      approve: {
	        method: 'POST',
	        url: endpoint + '/approve',
	        isArray: false
	      },
	      decline: {
	        method: 'POST',
	        url: endpoint + '/decline',
	        isArray: false
	      },
		});
	}]);
angular
  .module('tl')
  .service('tl.inquiry.service', [
    'tl.service',
    'tl.inquiry.resource',
    function(Service, Inquiry) {
      'use strict';

      /*==============================================================*
      /* Constants
      /*==============================================================*/
      var DEFAULT_LIMIT = 100;
      var DEFAULT_SORT = '-created';

      /*==============================================================*
      /* Constructor
      /*==============================================================*/
      var InquiryService = Service.extend(Inquiry);

      InquiryService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        options.sort = options.sort || DEFAULT_SORT;
        options.limit = options.limit || DEFAULT_LIMIT;

        return Inquiry.query(options).$promise;
      };

      InquiryService.prototype.approve = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.inquiryId) throw new Error('options.inquiryId is required');

        options.id = options.inquiryId;
        delete options.inquiryId;

        return Inquiry.approve(options).$promise;
      };

      InquiryService.prototype.decline = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.inquiryId) throw new Error('options.inquiryId is required');

        options.id = options.inquiryId;
        delete options.inquiryId;

        return Inquiry.decline(options).$promise;
      };

      return new InquiryService();
    }
  ]);


angular
	.module('tl')
	.service('tl.inventory', ['tl.inventory.resource', 'tl.inventory.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular
  .module('tl')
  .factory('tl.inventory.resource', [
    'tl.resource',
    function(resource) {
      'use strict';

      var endpoint = '/inventory/:id';

      return resource(endpoint, {
        id: '@id',
        tierId: '@tierId'
      }, {
        listForVenue: {
          method: 'GET',
          url: '/inventory',
          isArray: true
        },
        createTier: {
          method: 'POST',
          url: endpoint + '/tier',
          isArray: false
        },
        updateTier: {
          method: 'PUT',
          url: endpoint + '/tier/:tierId',
          isArray: false
        },
        deleteTier: {
          method: 'DELETE',
          url: endpoint + '/tier/:tierId',
          isArray: false
        }
      });
    }
  ]);

angular
  .module('tl')
  .service('tl.inventory.service', [
    'tl.service',
    'tl.inventory.resource',
    function(Service, Inventory) {
      'use strict';

      var InventoryService = Service.extend(Inventory);

      InventoryService.prototype.listForVenue = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.venue) throw new Error('options.venue is required');

        options.start = options.start || moment().startOf('month').format("YYYY-MM-DD");
        options.end = options.end || moment().endOf('month').format("YYYY-MM-DD");

        return Inventory.listForVenue(options).$promise;
      };

      InventoryService.prototype.createTier = function(inventoryId, options) {
        if (!inventoryId) throw new Error('inventoryId is required');
        if (!options) throw new Error('options is required');
        if (options.price === undefined) throw new Error('options.price is required');
        if (options.quantity === undefined) throw new Error('options.quantity is required');

        return Inventory.createTier({
          id: inventoryId
        }, options).$promise;
      };

      InventoryService.prototype.updateTier = function(inventoryId, tierId, options) {
        if (!inventoryId) throw new Error('inventoryId is required');
        if (!tierId) throw new Error('tierId is required');
        if (!options) throw new Error('options is required');

        return Inventory.updateTier({
          id: inventoryId,
          tierId: tierId
        }, options).$promise;
      };

      InventoryService.prototype.deleteTier = function(inventoryId, tierId, options) {
        if (!inventoryId) throw new Error('inventoryId is required');
        if (!tierId) throw new Error('tierId is required');

        return Inventory.deleteTier({
          id: inventoryId,
          tierId: tierId
        }, options).$promise;
      };

      return new InventoryService();
    }
  ]);

angular
  .module('tl')
  .service('tl.inventory-summary', ['tl.inventory-summary.resource', 'tl.inventory-summary.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);

angular
  .module('tl')
  .factory('tl.inventory-summary.resource', [
    'tl.resource',
    function(resource) {
      'use strict';

      var endpoint = '/inventory-summary';

      return resource(endpoint, {
        id: '@id'
      }, {
        list: {
          method: 'GET',
          url: endpoint,
          isArray: true
        }
      });
    }
  ]);

angular
  .module('tl')
  .service('tl.inventory-summary.service', [
    'tl.service',
    'tl.inventory-summary.resource',
    function(Service, InventorySummary) {
      'use strict';

      var InventorySummaryService = Service.extend(InventorySummary);

      InventorySummaryService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        return InventorySummary.list(options).$promise;
      };

      return new InventorySummaryService();
    }
  ]);

angular
  .module('tl')
  .service('tl.inventory-tier-config', ['tl.inventory-tier-config.resource', 'tl.inventory-tier-config.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);

angular
  .module('tl')
  .factory('tl.inventory-tier-config.resource', [
    'tl.resource',
    function(resource) {
      'use strict';

      var endpoint = '/inventory-tier-config/:id';

      return resource(endpoint, {
        id: '@id'
      }, {
        list: {
          method: 'GET',
          url: '/inventory-tier-config',
          isArray: true
        },
        listInventory: {
          method: 'GET',
          url: '/inventory-tier-config/:id/inventory',
          isArray: true
        },
        create: {
          method: 'POST',
          url: '/inventory-tier-config',
          isArray: false
        },
        update: {
          method: 'PATCH',
          url: endpoint,
          isArray: false
        }
      });
    }
  ]);

angular
  .module('tl')
  .service('tl.inventory-tier-config.service', [
    'tl.service',
    'tl.inventory-tier-config.resource',
    function(Service, InventoryTierConfig) {
      'use strict';

      var InventoryTierConfigService = Service.extend(InventoryTierConfig);

      InventoryTierConfigService.prototype.create = function(options) {
        if (!options) throw new Error('options is required');

        return InventoryTierConfig.save({}, options).$promise;
      };

      InventoryTierConfigService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        return InventoryTierConfig.list(options).$promise;
      };

      InventoryTierConfigService.prototype.listInventory = function(options) {
        if (!options) throw new Error('options is required');

        return InventoryTierConfig.listInventory(options).$promise;
      };

      InventoryTierConfigService.prototype.update = function update(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return InventoryTierConfig.update({
          id: options.id
        }, options).$promise;
      };

      return new InventoryTierConfigService();
    }
  ]);


angular
	.module('tl')
	.service('tl.item', ['tl.item.resource', 'tl.item.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular
  .module('tl')
  .factory('tl.item.resource', ['tl.resource', function(resource) {

    var endpoint = '/item/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: '/item',
        isArray: true
      }
    });
  }]);

angular
  .module('tl')
  .service('tl.item.service', ['tl.service', 'tl.item.resource', function(Service, Item) {

    var ItemService = Service.extend(Item);

    ItemService.prototype.list = function list(options) {
      if (!options) throw new Error('options is required');

      options.query = options.query ? JSON.stringify(options.query) : options.query;

      return Item.list(options).$promise;
    };

    return new ItemService();
  }]);

angular
  .module('tl')
  .service('tl.invoice', ['tl.invoice.resource', 'tl.invoice.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.invoice.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/invoice/:id';

      return resource(endpoint, {
        id: '@id'
      }, {
        // add additional methods here
        update: {
          method: 'PUT',
          url: endpoint,
          isArray: false
        },
        readPdf: {
          method: 'GET',
          url: endpoint + '/pdf',
          isArray: false
        },
        createPdf: {
          method: 'POST',
          url: endpoint + '/pdf',
          isArray: false
        }

      });
    }
  ]);

angular
  .module('tl')
  .service('tl.invoice.service', ['tl.service', 'tl.invoice.resource',
    function(Service, Invoice) {

      var InvoiceService = Service.extend(Invoice);

      InvoiceService.prototype.readPdf = function(invoiceId) {
        return Invoice.readPdf({
          id: invoiceId
        });
      };

      InvoiceService.prototype.createPdf = function(invoiceId) {
        return Invoice.createPdf({
          id: invoiceId
        });
      };

      return new InvoiceService();
    }
  ]);


angular
	.module('tl')
	.service('tl.metric', ['tl.metric.resource', 'tl.metric.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.metric.resource', ['tl.resource', function(resource){
		
		var endpoint = '/metric/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			available: {
				method: 'GET',
				url: '/metric/available',
				isArray: true
			},

			queryMetrics: {
				method: 'GET',
				url: '/metric'
			}
		});
	}]);

angular
  .module('tl')
  .service('tl.metric.service', ['tl.service', 'tl.metric.resource', function(Service, Metric){

    var MetricService = Service.extend(Metric);

    MetricService.prototype.availableMetrics = function(success, error) {
      return Metric.available({}, success, error);
    };

    MetricService.prototype.queryMetrics = function(metrics, period, range, options, success, error) {
      if (arguments.length < 6) {
        error = success;
        success = options;
        options = null;
      }

      var query = {
        metric: metrics,
        period: period,
        start: range[0].getTime(),
        end: range[1].getTime()
      };

      if (options) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          query[key] = options[key];
        }
      }

      return Metric.queryMetrics(query, success, error);
    };

    return new MetricService();
  }]);
angular
  .module('tl')
  .service('tl.notify', ['tl.metric.resource', 'tl.metric.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);

angular
  .module('tl')
  .factory('tl.notify.resource', ['tl.resource', function(resource) {

    var endpoint = '/notify/adminapp';

    return resource(endpoint, {
      id: '@id'
    }, {
      sendAdminApp: {
        method: 'POST',
        url: endpoint,
        isArray: false
      }
    });
  }]);

angular
  .module('tl')
  .service('tl.notify.service', ['tl.service', 'tl.notify.resource', function(Service, Notify) {

    var NotifyService = Service.extend(Notify);

    NotifyService.prototype.sendAdminApp = function() {
      return Notify.sendAdminApp().$promise;
    };

    return new NotifyService();
  }]);


angular
	.module('tl')
	.service('tl.outgoingPayment', ['tl.outgoingPayment.resource', 'tl.outgoingPayment.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular.module('tl').factory('tl.outgoingPayment.resource', [
  'tl.resource',
  function(resource) {
    'use strict';

    var endpoint = '/outgoing-payment/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      listTransaction: {
        method: 'GET',
        url: endpoint + '/transaction',
        isArray: true
      },
      listAuthorization: {
        method: 'GET',
        url: endpoint + '/authorization',
        isArray: true
      },
      update: {
        method: 'PUT',
        url: endpoint
      },
      delete: {
        method: 'DELETE',
        url: endpoint
      },
    });
  }
]);

angular.module('tl').service('tl.outgoingPayment.service', [
  'tl.outgoingPayment.resource',
  'tl.service',
  function(OutgoingPayment, Service) {
    'use strict';

    /*==============================================================*
    /* Constructor
    /*==============================================================*/

    var OutgoingPaymentService = Service.extend(OutgoingPayment);

    OutgoingPaymentService.prototype.listTransaction = function(id, success, error) {
      return OutgoingPayment.listTransaction({
        id: id,
      }, success, error);
    };

    OutgoingPaymentService.prototype.listAuthorization = function(id, success, error) {
      return OutgoingPayment.listAuthorization({
        id: id,
      }, success, error);
    };

    OutgoingPaymentService.prototype.update = function(id, options) {
      if (!id) throw new Error('id is required');
      if (!options) throw new Error('options is required');

      return OutgoingPayment.update({
        id: id
      }, options).$promise;
    };

    OutgoingPaymentService.prototype.delete = function(id) {
      if (!id) throw new Error('id is required');

      return OutgoingPayment.delete({
        id: id
      }).$promise;
    };


    return new OutgoingPaymentService();
  }
]);


angular
	.module('tl')
	.service('tl.payment', ['tl.payment.resource', 'tl.payment.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.payment.resource', ['tl.resource', function(resource){

		var endpoint = '/paymentProfile/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);
angular
  .module('tl')
  .service('tl.payment.service', ['tl.service', 'tl.payment.resource', 'tl.utils',
    function(Service, Payment, utils) {
      'use strict';

      var PaymentService = Service.extend(Payment);

       /**
        * Create a new payment profile with
        * a nonce token from braintree
        *
        * @method addPaymentMethodNonce
        * @param {Object} options
        * @param {String} options.paymentMethodNonce - nonce token from braintree
        */
      PaymentService.prototype.addPaymentMethodNonce = function(options) {
        var data = {
          paymentMethodNonce : options.paymentMethodNonce,
        };

        return this.create(data).$promise;
      };

      /**
       * Set a payment profile as the user's default.
       * Removes the 'default' flag from the previous default profile.
       *
       * @method setDefaultPaymentProfile
       * @param {Object} options
       * @param {String} options.id - payment profile id
       */
      PaymentService.prototype.setDefaultPaymentProfile = function(options) {

        var profileId = options.id;
        
        if (!profileId) {
          throw "An existing profile is required. Missing options.id";
        }
        var data = {
          default : true
        };
        
        return this.update(profileId, data).$promise;
      };

      /**
       * Creates a new payment profile on a user
       * from an entered credit card.
       *
       * @deprecated
       * @method addPaymentProfile
       * @param {Object} options
       * @param {String} options.name
       * @param {String} options.number
       * @param {String} options.month
       * @param {String} options.year
       * @param {String} options.cvv
       * @param {String} options.zip
       */
      PaymentService.prototype.addPaymentProfile = function(options) {
        console.log('DEPRECATED - use .addPaymentMethodNonce');

        var data = {
          cardholderName: options.name,
          cardNumber: utils.digits(options.number),
          cardExpMonth: utils.digits(options.month),
          cardExpYear: utils.digits(options.year),
          cardCvv: utils.digits(options.cvv),
          cardZip: utils.digits(options.zip)
        };
        return this.create(data).$promise;
      };

      /**
       * Updates a payment profile on a user
       *
       * @deprecated
       * @method updatePaymentProfile
       * @param {Object} options
       * @param {String} options.name
       * @param {String} options.number
       * @param {String} options.month
       * @param {String} options.year
       * @param {String} options.cvv
       * @param {String} options.zip
       */
      PaymentService.prototype.updatePaymentProfile = function(options) {

        var profileId = options.id;

        if (!profileId) {
          throw "An existing profile is required. Missing options.id";
        }
        var data = {
          cardholderName: options.name,
          cardNumber: utils.digits(options.number),
          cardExpMonth: utils.digits(options.month),
          cardExpYear: utils.digits(options.year),
          cardCvv: utils.digits(options.cvv),
          cardZip: utils.digits(options.zip)
        };
        return this.update(profileId, data).$promise;
      };

      
      /**
       * Creates a new payment profile on a user
       * from an entered credit card.
       *
       * @deprecated
       * @method addPaymentProfile
       * @param {String} name
       * @param {String} number
       * @param {String} month
       * @param {String} year
       * @param {String} cvv
       * @param {String} address
       * @param {String} city
       * @param {String} state
       * @param {String} zip
       * @param {Function} success
       * @param {Function} error
       */
      PaymentService.prototype.addProfile = function(name, number, month, year, cvv, address, city, state, zip, success, error) {
        console.log('DEPRECATED - use .addPaymentProfile');
        var data = {
          cardholderName: name,
          cardNumber: utils.digits(number),
          cardExpMonth: utils.digits(month),
          cardExpYear: utils.digits(year),
          cardCvv: utils.digits(cvv),
          cardZip: utils.digits(zip),
          address: {
            address: address,
            city: city,
            state: state
          }
        };

        return this.create(data, success, error);
      };

      /**
       * Updates a payment profile on a user
       *
       * @deprecated
       * @method addPaymentProfile
       * @param {String} profileId
       * @param {String} name
       * @param {String} number
       * @param {String} month
       * @param {String} year
       * @param {String} cvv
       * @param {String} address
       * @param {String} city
       * @param {String} state
       * @param {String} zip
       * @param {Function} success
       * @param {Function} error
       */
      PaymentService.prototype.updateProfile = function(profileId, name, number, month, year, cvv, address, city, state, zip, success, error) {
        console.log('DEPRECATED - use .updatePaymentProfile');
        if (!profileId) {
          return this.addProfile(name, number, month, year, cvv, address, city, state, zip, success, error);
        }

        var data = {
          cardholderName: name,
          cardNumber: utils.digits(number),
          cardExpMonth: utils.digits(month),
          cardExpYear: utils.digits(year),
          cardCvv: utils.digits(cvv),
          cardZip: utils.digits(zip),
          address: {
            address: address,
            city: city,
            state: state
          }
        };

        return this.update(profileId, data, success, error);
      };

      return new PaymentService();
    }
  ]);

angular
  .module('tl')
  .service('tl.permission', ['tl.permission.resource', 'tl.permission.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);

angular
  .module('tl')
  .factory('tl.permission.resource', ['tl.resource', function(resource) {

    var endpoint = '/permission/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      listVenuePermissions: {
        method: 'GET',
        url: '/permission/venue'
      },
    });
  }]);

 angular
   .module('tl')
   .service('tl.permission.service', ['tl.permission.resource', 'tl.service',
     function(Permission, Service) {

       var PermissionService = Service.extend(Permission);

       PermissionService.prototype.listVenuePermissions = function listVenuePermissions(options) {
         return Permission.listVenuePermissions(options).$promise;
       };

       return new PermissionService();
     }
   ]);

angular
  .module('tl')
  .service('tl.promo', ['tl.promo.resource', 'tl.promo.service', function(resource, service) {
    this.resource = resource;
    this.service = service;
  }]);

angular
  .module('tl')
  .factory('tl.promo.resource', ['tl.resource', function(resource) {

    var endpoint = '/promo/:id';
    //           = '/promo/check/:code'

    return resource(endpoint, {
      id: '@id',
      code: '@code',
    }, {
      redeem: {
        method: 'POST',
        url: '/promo/redeem'
      },
    }, {
      check: {
        method: 'GET',
        url: '/promo/check/:code'
      },
    });
  }]);

angular
  .module('tl')
  .service('tl.promo.service', ['tl.storage', 'tl.promo.resource', 'tl.service',
    function(storage, Promo, Service) {

      var PromoService = Service.extend(Promo);

      PromoService.prototype.redeem = function(promoCode) {
        return Promo.redeem({
          code: promoCode
        });
      };

      PromoService.prototype.check = function(promoCode) {
        return Promo.check({
          code: promoCode
        });
      };

      return new PromoService();
    }
  ]);


angular
	.module('tl')
	.service('tl.prospect', ['tl.prospect.resource', 'tl.prospect.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.prospect.resource', ['tl.resource', function(resource){

		var endpoint = '/prospect/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);

angular
	.module('tl')
	.service('tl.prospect.service', ['tl.service', 'tl.prospect.resource', function(Service, Prospect){

		var ProspectService = Service.extend(Prospect);

		/**
		 * Updates the current prospect
		 */
		ProspectService.prototype.updateProspect = function(data, success, error) {
			delete data._id;
			delete data.id;
			
			return Prospect.update({}, data, success, error);
		};

		return new ProspectService();
	}]);
angular
  .module('tl')
  .service('tl.question', ['tl.question.resource', 'tl.question.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.question.resource', ['tl.resource',
    function(resource) {

      var endpoint = '/question';

      return resource(endpoint, {
        id: '@id'
      }, {
        get: {
          method: 'GET',
          url: endpoint + '/:id'
        },
        listAnswers: {
          method: 'GET',
          url: endpoint + '/:id/answers',
          isArray: true
        },
        listTotalsForAnswers: {
          method: 'GET',
          url: endpoint + '/:id/answers/totals',
          isArray: true
        }
      });
    }
  ]);

angular
  .module('tl')
  .service('tl.question.service', ['tl.question.resource', 'tl.service',
    function(Question, Service) {

      var QuestionService = Service.extend(Question);

      QuestionService.prototype.listAnswers = function(id) {
        return Question.listAnswers({
          id: id
        });
      };

      QuestionService.prototype.listTotalsForAnswers = function(id) {
        return Question.listTotalsForAnswers({
          id: id
        });
      };

      return new QuestionService();
    }
  ]);


angular
	.module('tl')
	.service('tl.review', ['tl.review.resource', 'tl.review.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.review.resource', ['tl.resource', function(resource){

		var endpoint = '/review/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);

angular
	.module('tl')
	.service('tl.review.service', ['tl.service', 'tl.review.resource', function(Service, Review){

		var ReviewService = Service.extend(Review);

		ReviewService.prototype.read = function read(options) {
			if (!options) throw new Error('options is required');
			if (!options.id) throw new Error('options.id is required');

			return Review.get(options).$promise;
		};

		ReviewService.prototype.update = function update(options) {
			if (!options) throw new Error('options is required');
			if (!options.id) throw new Error('options.id is required');

			return Review.update({ id: options.id }, options).$promise;
		};

		return new ReviewService();
	}]);


angular
	.module('tl')
	.service('tl.report', ['tl.report.resource', 'tl.report.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.report.resource', ['tl.resource', function(resource){

		var endpoint = '/report/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			reports: {
				method: 'GET',
				url: '/report-type'
			},
			download: {
				method: 'GET',
				url: endpoint + '/download'
			}
		});
	}]);

angular
	.module('tl')
	.service('tl.report.service', ['tl.service', 'tl.report.resource', function(Service, Report){

		var ReportService = Service.extend(Report);

		ReportService.prototype.reports = function(success, error) {
			return Report.reports({}, success, error);
		};

		ReportService.prototype.listReports = function(key, success, error) {
			return Report.query({ report: key }, success, error);
		};

		ReportService.prototype.download = function(reportId, success, error) {
			return Report.download({ id: reportId }, success, error);
		};

		return new ReportService();
	}]);

angular
	.module('tl')
	.service('tl.reward', ['tl.reward.resource', 'tl.reward.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.reward.resource', ['tl.resource', function(resource){

		var endpoint = '/reward/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);

angular
	.module('tl')
	.service('tl.reward.service', ['tl.service', 'tl.reward.resource', function(Service, Reward){

		var RewardService = Service.extend(Reward);

		return new RewardService();
	}]);

angular
	.module('tl')
	.service('tl.sale', ['tl.sale.resource', 'tl.sale.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
  .module('tl')
  .factory('tl.sale.resource', ['tl.resource', function(resource) {

    var endpoint = '/sale';

    return resource(endpoint, {
      id: '@id'
    }, {
      read: {
        method: 'GET',
        url: endpoint + '/:id',
        isArray: false
      },
      update: {
        method: 'PUT',
        url: endpoint + '/:id',
        isArray: false
      },
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      }
    });
  }]);

angular
  .module('tl')
  .service('tl.sale.service', [
    'tl.service',
    'tl.sale.resource',
    '$http',
    'tl.http',
    function(Service, Sale, $http, http) {

      var SaleService = Service.extend(Sale);

      SaleService.prototype.read = function read(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return Sale.read(options).$promise;
      };

      SaleService.prototype.update = function update(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        var id = options.id;
        delete options.id;

        return Sale.update({
          id: id
        }, options).$promise;
      };

      SaleService.prototype.list = function(options) {
        if (!options) throw new Error('options is required');

        options.query = options.query ? JSON.stringify(options.query) : options.query;

        return Sale.list(options).$promise;
      };

      SaleService.prototype.listAsCsv = function(options) {
        if (!options) throw new Error('options is required');

        return $http.get(http.apiUrl('/sale'), {
          params: options,
          data: '', //needed, otherwise the content-type header is not sent (the req must have a body)
          headers: {
            'Content-Type': 'text/csv'
          }
        });
      };

      return new SaleService();
    }
  ]);


angular
	.module('tl')
	.service('tl.schedule', ['tl.schedule.resource', 'tl.schedule.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.schedule.resource', ['tl.resource', function(resource){

		var endpoint = '/schedule/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);

angular
	.module('tl')
	.service('tl.schedule.service', ['tl.service', 'tl.schedule.resource', function(Service, Schedule){

		var ScheduleService = Service.extend(Schedule);

		return new ScheduleService();
	}]);

angular
	.module('tl')
	.service('tl.settings', ['tl.settings.resource', 'tl.settings.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.settings.resource', ['tl.resource', function(resource){

		var endpoint = '/config';

		return resource(endpoint, {
			// nothing here 
		}, {

			status: {
				method: 'GET',
				url: '/status',
				isArray: false
			},

			config: {
				method: 'GET',
				url: '/config',
				isArray: false
			}
		});
	}]);

angular
	.module('tl')
	.service('tl.settings.service', ['tl.service', 'tl.settings.resource', function(Service, Settings){

		var SettingsService = function(){};

		/**
		 * Gets the server status
		 */
		SettingsService.prototype.status = function(success, error) {
			return Settings.status({}, success, error);
		};

		/**
		 * Fetches the configuration settings
		 */
		SettingsService.prototype.config = function(success, error) {
			return Settings.config({}, success, error);
		};

		return new SettingsService();
	}]);

angular
	.module('tl')
	.service('tl.table', ['tl.table.resource', 'tl.table.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.table.resource', ['tl.resource', function(resource){

		var endpoint = '/table/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);

angular
	.module('tl')
	.service('tl.table.service', ['tl.service', 'tl.table.resource', function(Service, Table){

		var TableService = Service.extend(Table);

		return new TableService();
	}]);
angular
  .module('tl')
  .service('tl.support', [
    'tl.support.service',
    'tl.support.message',
    'tl.support.task',
    function(service, message, task) {
      this.service = service;
      this.message = message;
      this.task = task;
    }
  ]);

angular
  .module('tl')
  .service('tl.support.service', [
    'tl.socket',
    'tl.support.message',
    function(Socket, Message) {
      'use strict';

      var SupportService = function() {};

      SupportService.prototype.listClientMessages = function(options) {
        options = options || {};
        return Message.resource.list(options).$promise;
      };

      SupportService.prototype.sendInboundMessage = function(text, options) {
        options = options || {};

        return Message.resource.sendInboundMessage({}, {
          text: text,
          data: options.data,
          city: options.city
        }).$promise;
      };

      SupportService.prototype.markMessagesRead = function(messageIds) {
        return Message.resource.markMessagesRead({}, {
          messageIds: messageIds
        }).$promise;
      };

      SupportService.prototype.listenForClientMessages = function(onMessage) {
        return new Socket('/support/message/client', onMessage);
      };

      return new SupportService();
    }
  ]);

angular
  .module('tl')
  .service('tl.tag', [
    'tl.tag.resource',
    'tl.tag.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.tag.resource', ['tl.resource', function(resource) {

    var endpoint = '/tag';

    return resource(endpoint, {}, {
      //additional methods here
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      }
    });
  }]);

angular
  .module('tl')
  .service('tl.tag.service', [
    'tl.service',
    'tl.tag.resource',
    function(Service, Tag) {
      'use strict';

      var TagService = Service.extend(Tag);

      TagService.prototype.list = function(options) {
        return Tag.list(options).$promise;
      };

      return new TagService();
    }
  ]);

angular
  .module('tl')
  .service('tl.tracker', [
    'tl.tracker.resource',
    'tl.tracker.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.tracker.resource', ['tl.resource', function(resource) {

    var endpoint = '/tracker';

    return resource(endpoint, {}, {
      //additional methods here
      create: {
        method: 'POST',
        url: endpoint,
        isArray: false
      }
    });
  }]);

angular
  .module('tl')
  .service('tl.tracker.service', [
    'tl.service',
    'tl.tracker.resource',
    function(Service, Tracker) {
      'use strict';

      var TrackerService = Service.extend(Tracker);

      TrackerService.prototype.create = function(options) {
        return Tracker.save({}, options).$promise;
      };

      return new TrackerService();
    }
  ]);


angular
	.module('tl')
	.constant('TRACK_EVENTS', {
		
		// User
		UserVerifiedPhoneNumber: "TLUserPhoneVerified",
		UserUpdatedProfilePicture: "TLUserUpdatedProfilePicture",
		UserCompletedProfile: "TLUserCompletedProfile",

		// City
		CityViewed: "TLCityViewed",
		CityFeaturedViewed: "TLCityFeaturedViewed",
		CityTonightViewed: "TLCityTonightViewed",
		CityThisWeekViewed: "TLCityThisWeekViewed",
		CityApplied: "TLCityApplied",
		CityShared: "TLCityShared",

		// Venues
		VenueViewed: "TLVenueViewed",
		VenueInfoViewed: "TLVenueInfoViewed",
		VenueContactViewed: "TLVenueContactViewed",
		VenueMapViewed: "TLVenueMapViewed",
		VenueAppliedForAccess: "TLVenueAppliedForAccess",

		// Events
		EventViewed: "TLEventViewed",

		// Booking Flow
		BookingInventoryViewed: "TLBookingInventoryViewed",
		BookingAddBottlesViewed: "TLBookingAddBottlesViewed",
		BookingInfoViewed: "TLBookingInfoViewed",
		BookingReviewViewed: "TLBookingReviewViewed",
		BookingTermsViewed: "TLBookingTermsViewed",
		BookingComplete: "TLBookingComplete",
		BookingReservationComplete: "TLBookingReservationComplete",
		BookingPromoterComplete: "TLBookingPromoterComplete",
		BookingFailed: "TLBookingFailed",
		BookingReservationFailed: "TLBookingReservationFailed",
		BookingAddedToPassbook: "TLBookingAddedToPassbook",
		BookingInquiryViewed: "TLBookingInquiryViewed",
		BookingInquirySubmitted: "TLBookingInquirySubmitted",

		// Booking Join Flow
		BookingJoinPending: "TLBookingJoinPending",
		BookingJoinAccepted: "TLBookingJoinAccepted",
		BookingJoinCodeSent: "TLBookingJoinCodeSent",

		// Booking Review
		BookingReviewSubmitted: "TLBookingReviewSubmitted",

		// Membership
		MembershipInfoViewed: "TLMembershipInfoViewed",
		MembershipApplyViewed: "TLMembershipApplyViewed",
		MembershipCheckoutViewed: "TLMembershipCheckoutViewed",
		MembershipSubscribed: "TLMembershipSubscribed",
		MembershipUnsubscribed: "TLMembershipUnsubscribed",

		// Favorites
		FavoritedVenue: "TLFavoritedVenue",
		FavoritedEvent: "TLFavoritedEvent",

		// Referral
		ReferralEntered: "TLReferralEntered",
		ReferralSentFB: "TLReferralSentFB",
		ReferralSentTW: "TLReferralSentTW",
		ReferralSentSMS: "TLReferralSentSMS",
		ReferralSentEmail: "TLReferralSentEmail",

		// SMS
		SMSDownloadLinkRequested: "TLSMSDownloadLinkRequested",

		// Payment
		PaymentAdded: "TLPaymentAdded",
		PaymentUpdated: "TLPaymentUpdated",
		PaymentInfoError: "TLPaymentInfoError",

		// Promo Code
		CodeRedeemed: "TLPromoCodeRedeemed",

		// Rewards
		RewardViewed: "TLRewardViewed",
		RewardRedeemed: "TLRewardRedeemed",

		// About Us
		AboutBlogViewed: "TLAboutBlogViewed",
		AboutFacebookViewed: "TLAboutFacebookViewed",
		AboutTwitterViewed: "TLAboutTwitterViewed",
		AboutWebsiteViewed: "TLAboutWebsiteViewed",

		// Easter Eggs
		EasterEggAccountProfilePicture: "TLEasterEggAccountProfilePicture",

		// Inventory Search
		InventorySearched : "TLInventorySearched",
		InventorySearchResultSelected : "TLInventorySearchResultSelected",
	});


angular
	.module('tl')
	.service('tl.track', ['tl.track.resource', 'tl.track.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.track.resource', ['tl.resource', function(resource){

		var endpoint = '/track/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			funnel: {
			 	method: 'POST',
			 	url: '/track/funnel',
			 	isArray: true
			},
			listPossibleEvents: {
				method: 'GET',
				url: '/track/events',
				isArray: true
			}
		});
	}]);
angular
  .module('tl')
  .service('tl.track.service', ['tl.service', 'tl.track.resource', 'TRACK_EVENTS', 'tl.config', function(Service, Track, EVENTS, config) {

    var AFFILIATE = null;

    var TrackService = Service.extend(Track);

    /**
     * Returns a map of valid tracking events
     */
    TrackService.prototype.trackingEvents = function() {
      return EVENTS;
    };

    /**
     * Send a tracking event to the server
     */
    TrackService.prototype.send = function(eventName, data) {
      var track = {
        event: eventName,
        data: data,
        client: {
          os: config.CLIENT,
          version: config.VERSION,
          device: window.navigator ? window.navigator.userAgent : null
        }
      };

      if (config.SUB_CLIENT) track.client.os = track.client.os + ('-' + config.SUB_CLIENT);
      if (AFFILIATE) {
        track.data = track.data || {};
        track.data.affiliate = AFFILIATE;
      }

      return Track.save({}, track);
    };

    TrackService.prototype.setAffiliate = function(affiliateId) {
      AFFILIATE = affiliateId || null;
    };

    TrackService.prototype.listPossibleEvents = function(success, error) {
      return Track.listPossibleEvents({}, success, error).$promise;
    };

		TrackService.prototype.funnel = function(events, options, success, error) {
			return Track.funnel({}, {
				events: events,
				start: options.start.getTime(),
				end: options.end.getTime(),
				data: options.data,
				client: options.client
			}, success, error).$promise;
		};

		return new TrackService();
	}]);


angular
	.module('tl')
	.service('tl.venue', ['tl.venue.resource', 'tl.venue.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular
  .module('tl')
  .factory('tl.venue.resource', ['tl.resource', function(resource) {

    var endpoint = '/venue/:id';

    return resource(endpoint, {
      id: '@id',
      itemId: '@itemId',
      imageId: '@imageId',
      cityId: '@cityId',
      onlyEnabled: '@onlyEnabled'
    }, {
      list: {
        method: 'GET',
        url: '/venue',
        isArray: true
      },
      /*==============================================================*
      /* Cities
      /*==============================================================*/

      listForCity: {
        method: 'GET',
        url: '/city/:cityId/venue',
        isArray: true
      },
      listCityFeatured: {
        method: 'GET',
        url: '/city/:cityId/venue/featured',
        isArray: true
      },
      listCityTonight: {
        method: 'GET',
        url: '/city/:cityId/venue/tonight',
        isArray: true,
        cache: true
      },

      /*==============================================================*
      /* Schedule
      /*==============================================================*/

      schedule: {
        method: 'GET',
        url: endpoint + '/schedule',
      },
      updateSchedule: {
        method: 'PUT',
        url: endpoint + '/schedule',
      },

      /*==============================================================*
      /* Inventory
      /*==============================================================*/

      listInventory: {
        method: 'GET',
        url: endpoint + '/inventory',
        isArray: false
      },
      listActiveInventory: {
        method: 'GET',
        url: endpoint + '/active-inventory',
        isArray: true
      },
      listInventoryAdmin: {
        method: 'GET',
        url: endpoint + '/inventory/admin',
        isArray: false
      },
      readInventory: {
        method: 'GET',
        url: endpoint + '/inventory/:tableId',
        isArray: false
      },
      addInventory: {
        method: 'POST',
        url: endpoint + '/inventory',
        isArray: false
      },
      updateInventory: {
        method: 'PUT',
        url: endpoint + '/inventory/:tableId',
        isArray: false
      },
      listInventoryTierConfigs: {
        method: 'GET',
        url: endpoint + '/inventory-tier-config',
        isArray: true
      },

      /*==============================================================*
      /* Events
      /*==============================================================*/

      listEvents: {
        method: 'GET',
        url: endpoint + '/event',
        isArray: true
      },
      addEvent: {
        method: 'POST',
        url: '/event',
        isArray: false
      },

      /*==============================================================*
      /* Items
      /*==============================================================*/

      listItems: {
        method: 'GET',
        url: endpoint + '/item',
        isArray: true
      },
      addItem: {
        method: 'POST',
        url: endpoint + '/item'
      },
      updateItem: {
        method: 'PUT',
        url: endpoint + '/item/:itemId'
      },
      deleteItem: {
        method: 'DELETE',
        url: endpoint + '/item/:itemId'
      },

      /*==============================================================*
      /* Info
      /*==============================================================*/

      listInfo: {
        method: 'GET',
        url: endpoint + '/info',
        isArray: true,
      },
      readInfo: {
        method: 'GET',
        url: endpoint + '/info/:key'
      },
      updateInfo: {
        method: 'PUT',
        url: endpoint + '/info/:key'
      },
      createInfo: {
        method: 'POST',
        url: endpoint + '/info'
      },

      /*==============================================================*
      /* Staff
      /*==============================================================*/

      listStaff: {
        method: 'GET',
        url: endpoint + '/staff',
        isArray: true
      },
      readStaff: {
        method: 'GET',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
      createStaff: {
        method: 'POST',
        url: endpoint + '/staff',
        isArray: false
      },
      updateStaff: {
        method: 'PUT',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },
      deleteStaff: {
        method: 'DELETE',
        url: endpoint + '/staff/:staffId',
        isArray: false
      },

      /*==============================================================*
      /*
      /*==============================================================*/


      listBookings: {
        method: 'GET',
        url: endpoint + '/booking',
        isArray: true
      },

      listTableBookings: {
        method: 'GET',
        url: endpoint + '/booking/table',
        isArray: true
      },

      listAdmissionBookings: {
        method: 'GET',
        url: endpoint + '/booking/admission',
        isArray: true
      },

      listTickets: {
        method: 'GET',
        url: endpoint + '/ticket',
        isArray: true
      },

      listTicketStats: {
        method: 'GET',
        url: endpoint + '/ticket/stats',
        isArray: false
      },

      listReviews: {
        method: 'GET',
        url: endpoint + '/review',
        isArray: true
      },

      /*==============================================================*
      /* Permissions
      /*==============================================================*/

      addStaffPermission: {
        method: 'POST',
        url: endpoint + '/staff/:staffId/permission',
        isArray: true
      },

      removeStaffPermission: {
        method: 'DELETE',
        url: endpoint + '/staff/:staffId/permission/:permission',
        isArray: false
      },

      listStaffPermissions: {
        method: 'GET',
        url: endpoint + '/staff/:staffId/permission',
        isArray: true
      },
    });
  }]);

angular
  .module('tl')
  .service('tl.venue.service', [
    'tl.service',
    'tl.venue.resource',
    function(Service, Venue) {
      'use strict';

      var VenueService = Service.extend(Venue);

      VenueService.prototype.list = function list(options) {
        if (!options) throw new Error('options is required');

        options.query = options.query ? JSON.stringify(options.query) : options.query;

        return Venue.list(options).$promise;
      };

      VenueService.prototype.read = function read(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.get(options).$promise;
      };

      VenueService.prototype.create = function create(options) {
        if (!options) throw new Error('options is required');

        return Venue.save({}, options).$promise;
      };

      VenueService.prototype.update = function update(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.update({
          id: options.id
        }, options).$promise;
      };

      /*==============================================================*
      /* Cities
      /*==============================================================*/

      VenueService.prototype.listForCity = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.cityId) throw new Error('options.cityId is required');

        return Venue.listForCity(options).$promise;
      };

      VenueService.prototype.listCityFeatured = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.cityId) throw new Error('options.cityId is required');

        return Venue.listCityFeatured(options).$promise;
      };

      VenueService.prototype.listCityTonight = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.cityId) throw new Error('options.cityId is required');

        return Venue.listCityTonight(options).$promise;
      };

      /*==============================================================*
      /* Inventory
      /*==============================================================*/

      VenueService.prototype.listInventory = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        options.start = options.start || moment().startOf('month').format("YYYY-MM-DD");
        options.end = options.end || moment().endOf('month').format("YYYY-MM-DD");

        return Venue.listInventory(options).$promise;
      };

      VenueService.prototype.listActiveInventory = function(venueId, options) {

        if (!venueId) throw new Error('venueId is required');
        if (!options) throw new Error('options is required');
        if (!options.start) throw new Error('options.start required');
        if (!options.end) throw new Error('options.end required');

        options.id = venueId;
        options.start = options.start;
        options.end = options.end;

        return Venue.listActiveInventory(options).$promise;
      };

      VenueService.prototype.listInventoryTierConfigs = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        options.start = options.start || moment().startOf('month').toDate().getTime();
        options.end = options.end || moment().endOf('month').toDate().getTime();

        return Venue.listInventoryTierConfigs(options).$promise;
      };

      /*==============================================================*
      /* Items
      /*==============================================================*/

      VenueService.prototype.addItem = function createItem(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        var venueId = options.id;
        delete options.id;

        return Venue.addItem({
          id: venueId
        }, options).$promise;
      };

      VenueService.prototype.listItems = function listItems(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listItems(options).$promise;
      };

      VenueService.prototype.updateItem = function updateItem(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.itemId) throw new Error('options.itemId is required');

        var venueId = options.id;
        delete options.id;

        var itemId = options.itemId;
        delete options.itemId;

        return Venue.updateItem({
          id: venueId,
          itemId: itemId
        }, options).$promise;
      };

      VenueService.prototype.deleteItem = function createItem(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.itemId) throw new Error('options.itemId is required');

        var venueId = options.id;
        delete options.id;

        var itemId = options.itemId;
        delete options.itemId;

        return Venue.deleteItem({
          id: venueId,
          itemId: itemId
        }, options).$promise;
      };

      /*==============================================================*
      /* Info
      /*==============================================================*/

     /**
      * List the information pages available on a venue
      *
      * @method listInfo
      * @param {String} venueId
      * @param {Object} [options]
      * @param {String} [options.fields] - CSV of fields to be returned.
      */
      VenueService.prototype.listInfo = function listInfo(venueId, options) {
        if (!venueId) throw new Error('venueId is required');

        options = options || {};

        return Venue.listInfo({
          id : venueId
        }, options).$promise;
      };

     /**
      * Create a new information page on a venue
      *
      * @method createInfo
      * @param {String} venueId
      * @param {Object} options
      * @param {String} options.key - unique key of the page
      * @param {String} [options.text] - content of the page
      * @param {String} [options.title] - title of the page
      */
      VenueService.prototype.createInfo = function createInfo(venueId, options) {
        if (!venueId) throw new Error('venueId is required');
        if (!options) throw new Error('options is required');
        if (!options.key) throw new Error('options.key is required');

        return Venue.createInfo({
          id : venueId
        }, options).$promise;
      };

     /**
      * Read an information page on a venue
      *
      * @method readInfo
      * @param {String} venueId
      * @param {String} key - unique key of the page
      */
      VenueService.prototype.readInfo = function readInfo(venueId, key) {
        if (!venueId) throw new Error('venueId is required');
        if (!key) throw new Error('key is required');

        return Venue.readInfo({
          id : venueId,
          key : key
        }).$promise;
      };

     /**
      * Update an information page on a venue
      *
      * @method updateInfo
      * @param {String} venueId
      * @param {String} key - unique key of the page
      * @param {Object} options
      * @param {String} [options.text] - content of the page
      * @param {String} [options.title] - title of the page
      */
      VenueService.prototype.updateInfo = function updateInfo(venueId, key, options) {
        if (!venueId) throw new Error('venueId is required');
        if (!key) throw new Error('key is required');

        options = options || {};

        return Venue.updateInfo({
          id : venueId,
          key : key
        }, options).$promise;
      };

      /*==============================================================*
      /* Sales
      /*==============================================================*/

      VenueService.prototype.listBookings = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listBookings(options).$promise;
      };

      VenueService.prototype.listTableBookings = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listTableBookings(options).$promise;
      };

      VenueService.prototype.listAdmissionBookings = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listAdmissionBookings(options).$promise;
      };

      VenueService.prototype.listTickets = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listTickets(options).$promise;
      };

      VenueService.prototype.listTicketStats = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listTicketStats(options).$promise;
      };

      /*==============================================================*
      /* Events
      /*==============================================================*/

      VenueService.prototype.listEvents = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listEvents(options).$promise;
      };

      /*==============================================================*
      /* Reviews
      /*==============================================================*/

      VenueService.prototype.listReviews = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listReviews(options).$promise;
      };

      /*==============================================================*
      /* Staff
      /*==============================================================*/

      VenueService.prototype.listStaff = function listStaff(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        return Venue.listStaff(options).$promise;
      };

      VenueService.prototype.readStaff = function readStaff(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.staffId) throw new Error('options.staffId is required');

        return Venue.readStaff(options).$promise;
      };

      VenueService.prototype.createStaff = function createStaff(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        var venueId = options.id;
        delete options.id;

        return Venue.createStaff({
          id: venueId
        }, options).$promise;
      };

      VenueService.prototype.updateStaff = function updateStaff(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.staffId) throw new Error('options.staffId is required');
        if (!options.updates) throw new Error('options.updates is required');

        var venueId = options.id;
        delete options.id;

        var staffId = options.staffId;
        delete options.staffId;

        return Venue.updateStaff({
          id: venueId,
          staffId: staffId
        }, options.updates).$promise;
      };

      VenueService.prototype.deleteStaff = function deleteStaff(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.staffId) throw new Error('options.staffId is required');

        var venueId = options.id;
        delete options.id;

        var staffId = options.staffId;
        delete options.staffId;

        return Venue.deleteStaff({
          id: venueId,
          staffId: staffId
        }, options).$promise;
      };

      /*==============================================================*
      /* Permissions
      /*==============================================================*/

      VenueService.prototype.addStaffPermission = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.staffId) throw new Error('options.staffId is required');
        if (!options.permission) throw new Error('options.permission is required');

        var venueId = options.id;
        delete options.id;

        var staffId = options.staffId;
        delete options.staffId;

        return Venue.addStaffPermission({
          id: venueId,
          staffId: staffId
        }, options).$promise;
      };

      VenueService.prototype.removeStaffPermission = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.staffId) throw new Error('options.staffId is required');
        if (!options.permission) throw new Error('options.permission is required');


        return Venue.removeStaffPermission(options).$promise;
      };

      VenueService.prototype.listStaffPermissions = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');
        if (!options.staffId) throw new Error('options.staffId is required');

        return Venue.listStaffPermissions(options).$promise;
      };

      return new VenueService();
    }
  ]);


angular
	.module('tl')
	.service('tl.user', ['tl.user.resource', 'tl.user.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);
angular
  .module('tl')
  .factory('tl.user.resource', ['tl.resource', function(resource) {
    'use strict';

    var endpoint = '/user/:id';

    return resource(endpoint, {
      id: '@id'
    }, {
      list: {
        method: 'GET',
        url: '/user',
        isArray: true
      },
      me: {
        method: 'GET',
        url: '/me'
      },
      updateMe: {
        method: 'PUT',
        url: '/me'
      },
      search: {
        method: 'GET',
        url: '/user/search',
        isArray: true
      },
      push: {
        method: 'POST',
        url: '/notify/push',
        isArray: false
      },
      listBookings: {
        method: 'GET',
        url: endpoint + '/booking',
        isArray: true
      },
      updatePreferredCity: {
        method: 'PUT',
        url: '/user/city'
      },
      requestVerificationCode: {
        method: 'GET',
        url: '/user/verify/:id'
      },
      requestVerificationCodeForCurrentUser: {
        method: 'GET',
        url: '/user/verify'
      },
      verifyPhoneNumber: {
        method: 'PUT',
        url: '/user/verify/:id'
      },
      verifyPhoneNumberForCurrentUser: {
        method: 'PUT',
        url: '/user/verify'
      },
      listPaymentProfiles: {
        method: 'GET',
        url: endpoint + '/paymentProfiles',
        isArray: true
      },
      listReferrals: {
        method: 'GET',
        url: endpoint + '/referral',
        isArray: true
      },
      listPromos: {
        method: "GET",
        url: endpoint + "/promo",
        isArray: true
      },
      listTasks: {
        method: 'GET',
        url: endpoint + '/task',
        isArray: true
      },
      listQuestions: {
        method: 'GET',
        url: endpoint + '/question',
        isArray: true
      },
      listAnswers: {
        method: 'GET',
        url: endpoint + '/answer',
        isArray: true
      },
      listNotifications: {
        method: "GET",
        url: '/notify/:id',
        isArray: true
      },
      listHighPriority: {
        method: "GET",
        url: '/user/priority',
        isArray: true
      },
      addCredit: {
        method: "POST",
        url: endpoint + '/credit'
      },
      addSubscription: {
        method: "POST",
        url: endpoint + '/subscription'
      },
      cancelSubscription: {
        method: "DELETE",
        url: endpoint + '/subscription'
      },
      subscriptionAction: {
        method: "POST",
        url: endpoint + '/subscription/:subscriptionId/action',
      },
      findByReferral: {
        method: "GET",
        url: '/referral/:code'
      },
      getReferralStats: {
        method: "GET",
        url: endpoint + '/referral/stats'
      },
      listVenues: {
        method: "GET",
        url: endpoint + '/venue',
        isArray: true
      },
      listStats: {
        method: "GET",
        url: endpoint + '/stats',
        isArray: true
      },
      favorite: {
        method: "POST",
        url: endpoint + '/favorite',
        isArray: false
      },
      unfavorite: {
        method: "DELETE",
        url: endpoint + '/favorite/:favoriteId',
        isArray: false
      },
      listFavorites: {
        method: "GET",
        url: endpoint + '/favorite',
        isArray: true
      },
      listReviews: {
        method: 'GET',
        url: endpoint + '/review',
        isArray: true
      },
      markAffiliate: {
        method: "POST",
        url: endpoint + '/affiliate',
        isArray: false
      },
      listAffiliates: {
        method: "GET",
        url: 'user/:id/affiliate',
        isArray: true
      },
      access: {
        method: 'GET',
        url: 'user/:id/access',
        isArray: true
      }
    });
  }]);

angular
  .module('tl')
  .service('tl.user.service', ['$timeout', 'tl.storage', 'tl.keychain', 'tl.ee', 'tl.user.resource', 'tl.service',
    function($timeout, storage, keychain, ee, User, Service) {
      'use strict';

      var USER_KEY = 'tl_user';
      var EVENTS = {
        USER_UPDATED: 'tl.user.updated'
      };

      var SUBSCRIPTION_ACTION = {
        UPDATE_PAYMENT_METHOD: 'UPDATE_PAYMENT_METHOD',
      };

      var UserService = Service.extend(User);

      UserService.prototype.list = function list(options) {
        if (!options) throw new Error('options is required');

        options.query = options.query ? JSON.stringify(options.query) : options.query;

        return User.list(options).$promise;
      };

      /**
       * Returns a local copy of the current user
       */
      UserService.prototype.currentUser = function() {
        return keychain.authToken() ? storage.get(USER_KEY) : null;
      };

      UserService.prototype.EVENTS = function() {
        return EVENTS;
      };

      /**
       * Sets a local copy of the current user
       */
      UserService.prototype.setCurrentUser = function(user) {
        $timeout(function() { // fire notification on next run loop
          ee.emit(EVENTS.USER_UPDATED, user);
        });
        return storage.set(USER_KEY, user);
      };

      /**
       * Merges local copy of user with new data
       */
      UserService.prototype.saveCurrentUser = function(user) {
        var _user = this.currentUser() || {};
        var keys = Object.keys(user);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var val = user[key];
          _user[key] = val;
        }
        this.setCurrentUser(_user);
      };

      /**
       * Fetches the current user from the API
       */
      UserService.prototype.me = function(success, error) {
        var _this = this;

        var promise = User.me().$promise;

        promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
        }, error);

        return promise;
      };

      /**
       * Updates the current user
       */
      UserService.prototype.updateMe = function(body, success, error) {
        var _this = this;
        return User.updateMe({}, body).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
        }, error);
      };

      /**
       * Sets the users preferred city
       */
      UserService.prototype.updatePreferredCity = function(cityId, success, error) {
        var _this = this;
        var body = {
          city: cityId
        };
        return User.updatePreferredCity({}, body).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
        }, error);
      };

      /**
       * Requests a verification code to verify a phone number
       */
      UserService.prototype.requestVerificationCode = function(id, success, error) {
        return User.requestVerificationCode({
          id: id
        }, success, error);
      };

      /**
       * Requests a verification code to verify a phone number
       */
      UserService.prototype.requestVerificationCodeForCurrentUser = function(success, error) {
        return User.requestVerificationCodeForCurrentUser({}, success, error);
      };

      /**
       * Verifies the users phone number
       */
      UserService.prototype.verifyPhoneNumber = function(id, code, success, error) {
        var _this = this;
        var data = {
          id: id,
          verificationCode: code
        };
        return User.verifyPhoneNumber({}, data).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
          return user;
        }, error);
      };

      /**
       * Verifies the users phone number
       */
      UserService.prototype.verifyPhoneNumberForCurrentUser = function(code, success, error) {
        var _this = this;
        var data = {
          verificationCode: code
        };
        return User.verifyPhoneNumber({}, data).$promise.then(function(user) {
          _this.saveCurrentUser(user);
          if (success) {
            success(user);
          }
          return user;
        }, error);
      };

      /**
       * Lists a user's payment profiles
       */
      UserService.prototype.listPaymentProfiles = function(userId, success, error) {
        return User.listPaymentProfiles({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's referrals
       */
      UserService.prototype.listReferrals = function(userId, success, error) {
        return User.listReferrals({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's bookings
       */
      UserService.prototype.listBookings = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.id) throw new Error('options.id is required');

        return User.listBookings(options).$promise;
      };

      /**
       * Lists a user's promos
       */
      UserService.prototype.listPromos = function(userId, success, error) {
        return User.listPromos({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's tasks
       */
      UserService.prototype.listTasks = function(userId, success, error) {
        return User.listTasks({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's notifications
       */
      UserService.prototype.listNotifications = function(userId, success, error) {
        return User.listNotifications({
          id: userId
        }, success, error);
      };

      /**
       * Lists a user's unanswered questions
       */
      UserService.prototype.listQuestions = function(userId, type, success, error) {
        return User.listQuestions({
          id: userId,
          type: type
        }, success, error);
      };

      /**
       * Lists a user's answers
       */
      UserService.prototype.listAnswers = function(userId, success, error) {
        return User.listAnswers({
          id: userId
        }, success, error);
      };

      /**
       * Returns an array of high priority users
       */
      UserService.prototype.listHighPriority = function(hours, priority, cityId, success, error) {
        return User.listHighPriority({
          hours: hours || 24,
          priority: priority || 7,
          city: cityId
        }, success, error);
      };

      /**
       * Add credit for a user
       */
      UserService.prototype.addCredit = function(userId, amount, campaignId, success, error) {
        return User.addCredit({
          id: userId
        }, {
          amount: amount,
          campaign: campaignId
        }, success, error);
      };

      /**
       * Add a subscription for a user
       *
       * @method addSubscription
       * @param {Object} options
       * @param {String} [options.userId] - user to subscribe
       * @param {String} [options.planId] - braintree reoccurring plan
       * @param {String} [options.paymentProfileId] - payment profile to charge
       */
      UserService.prototype.addSubscription = function(options, success, error) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');
        if (!options.planId) throw new Error('options.planId is required');
        if (!options.paymentProfileId) throw new Error('options.paymentProfileId is required');

        return User.addSubscription({
          id: options.userId
        }, options, success, error);
      };

      /**
       * Remove a subscription for a user
       */
      UserService.prototype.cancelSubscription = function(userId, success, error) {
        return User.cancelSubscription({
          id: userId
        }, success, error);
      };

      /**
       * Update the payment profile for a user's subscription
       *
       * @method updateSubscriptionPaymentMethod
       * @param {Object} options
       * @param {String} [options.userId] - user to subscribe
       * @param {String} [options.paymentProfileId] - payment profile to charge
       */
      UserService.prototype.updateSubscriptionPaymentMethod = function(options, success, error) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');
        if (!options.subscriptionId) throw new Error('options.subscriptionId is required');
        if (!options.paymentProfileId) throw new Error('options.paymentProfileId is required');

        var body = {
          type: SUBSCRIPTION_ACTION.UPDATE_PAYMENT_METHOD,
          paymentProfileId: options.paymentProfileId,
        };

        return User.subscriptionAction({
          id: options.userId,
          subscriptionId: options.subscriptionId,
        }, body, success, error);
      };

      /**
       * Find a user's name and photo by their referral code
       */
      UserService.prototype.findByReferral = function(code, success, error) {
        return User.findByReferral({
          code: code
        }, success, error);
      };
      /**
       * Get a user's referral stats
       */
      UserService.prototype.getReferralStats = function(userId, success, error) {
        return User.getReferralStats({
          id: userId
        }, success, error);
      };

      /**
       * Get a user's referral stats
       */
      UserService.prototype.search = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.query) throw new Error('options.query is required');

        return User.search(options).$promise;
      };

      /**
       * Lists a user's venues
       */
      UserService.prototype.listVenues = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listVenues(options).$promise;
      };

      UserService.prototype.favorite = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        var userId = options.userId;
        delete options.userId;

        return User.favorite({
          id: userId
        }, options).$promise;
      };

      UserService.prototype.unfavorite = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');
        if (!options.favoriteId) throw new Error('options.favoriteId is required');

        var userId = options.userId;
        delete options.userId;
        var favoriteId = options.favoriteId;
        delete options.favoriteId;

        return User.unfavorite({
          id: userId,
          favoriteId: favoriteId
        }, options).$promise;
      };

      UserService.prototype.listFavorites = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listFavorites(options).$promise;
      };

      UserService.prototype.listReviews = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listReviews(options).$promise;
      };

      UserService.prototype.markAffiliate = function(userId, options) {
        if (!userId) throw new Error('userId is required');
        if (!options) throw new Error('options is required');
        if (!options.name) throw new Error('options.name is required');

        return User.markAffiliate({
          id: userId
        }, options).$promise;
      };

      UserService.prototype.listAffiliates = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listAffiliates(options).$promise;
      };

      UserService.prototype.listStats = function(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.listStats(options).$promise;
      };

      UserService.prototype.access = function access(options) {
        if (!options) throw new Error('options is required');
        if (!options.userId) throw new Error('options.userId is required');

        options.id = options.userId;
        delete options.userId;

        return User.access(options).$promise;
      };

      return new UserService();
    }
  ]);

angular
  .module('tl')
  .service('tl.support.agent', [
    'tl.support.agent.resource',
    'tl.support.agent.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.support.agent.resource', ['tl.resource', function(resource) {

    var endpoint = '/agent';

    return resource(endpoint, {
      id: '@id'
    }, {
      read: {
        method: 'GET',
        url: endpoint + '/:id',
        isArray: false
      },
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      },
      create: {
        method: 'POST',
        url: endpoint,
        isArray: false
      },
      update: {
        method: 'PUT',
        url: endpoint + '/:id',
        isArray: false
      },
      patch: {
        method: 'PATCH',
        url: endpoint + '/:id',
        isArray: false
      },
      remove: {
        method: 'DELETE',
        url: endpoint + '/:id',
        isArray: false
      },
    });
  }]);

angular
  .module('tl')
  .service('tl.support.agent.service', [
    'tl.service',
    'tl.support.agent.resource',
    function(Service, Agent) {
      'use strict';

      var SupportAgentService = Service.extend(Agent);

      SupportAgentService.prototype.read = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        options = options || {};

        options.id = agentId;

        return Agent.read(options).$promise;
      };

      SupportAgentService.prototype.list = function(options) {
        options = options || {};
        return Agent.list(options).$promise;
      };

      SupportAgentService.prototype.create = function(options) {
        if (!options) throw new Error('options is required');

        return Agent.create({}, options).$promise;
      };

      SupportAgentService.prototype.update = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        if (!options) throw new Error('options is required');

        return Agent.update({ id: agentId }, options).$promise;
      };

      SupportAgentService.prototype.patch = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        if (!options) throw new Error('options is required');

        return Agent.patch({ id: agentId }, options).$promise;
      };

      SupportAgentService.prototype.remove = function(agentId, options) {
        if (!agentId) throw new Error('agentId is required');
        options = options || {};

        options.id = agentId;

        return Agent.remove(options).$promise;
      };

      return new SupportAgentService();
    }
  ]);

angular
  .module('tl')
  .service('tl.support.message', [
    'tl.support.message.resource',
    'tl.support.message.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.support.message.resource', ['tl.resource', function(resource) {

    var endpoint = '/support/message';

    return resource(endpoint, {}, {
      list: {
        method: 'GET',
        url: endpoint,
        isArray: true
      },
      markMessagesRead: {
        method: 'POST',
        url: endpoint + '/read',
        isArray: true
      },
      sendInboundMessage: {
        method: 'POST',
        url: endpoint + '/inbound',
        isArray: false
      },
      sendOutboundMessage: {
        method: 'POST',
        url: endpoint + '/outbound',
        isArray: false
      },
      sendInternalMessage: {
        method: 'POST',
        url: endpoint + '/internal',
        isArray: false
      }
    });
  }]);

angular
  .module('tl')
  .service('tl.support.message.service', [
    'tl.service',
    'tl.support.message.resource',
    function(Service, Message) {
      'use strict';

      var SupportMessageService = Service.extend(Message);

      return new SupportMessageService();
    }
  ]);

angular
  .module('tl')
  .service('tl.support.task', [
    'tl.support.task.resource',
    'tl.support.task.service',
    function(resource, service) {
      this.resource = resource;
      this.service = service;
    }
  ]);

angular
  .module('tl')
  .factory('tl.support.task.resource', ['tl.resource', function(resource) {

    var endpoint = '/support/task';

    return resource(endpoint, {}, {

    });
  }]);

angular
  .module('tl')
  .service('tl.support.task.service', [
    'tl.service',
    'tl.support.task.resource',
    function(Service, Task) {
      'use strict';

      var SupportTaskService = Service.extend(Task);

      return new SupportTaskService();
    }
  ]);
