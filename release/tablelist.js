/**
 * Tablelist.js
 *
 * Dependencies:
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular.min.js
 *  - http://ajax.googleapis.com/ajax/libs/angularjs/1.2.x/angular-resource.min.js
 */
angular
  .module('tl', ['ngResource'])
  .provider('TablelistSdk', function() {

    var TL_ENV = window.TL_ENV || 'production';
    var TL_CLIENT = window.TL_CLIENT || 'web';

    // Environments
    var ENV_DEV = TL_ENV == 'development';
    var ENV_PROD = TL_ENV == 'production';
    var ENV_LOCAL = TL_ENV == 'local';
    var ENV_TEST = TL_ENV == 'test';

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

      setSubclient: setSubclient
    };

    function setEnv(env) {
      var api = API[env];
      if (!api) throw new Error('Enviroment : ' + env + ' is not valid');

      config.ENV = env;
      config.ENV_DEV = (env == 'development');
      config.ENV_PROD = (env == 'production');
      config.ENV_LOCAL = (env == 'local');
      config.ENV_TEST = (env == 'test');
      config.API = api;
    }

    function setSubclient(subclient) {
      config.SUB_CLIENT = subclient;
    }

    function setUseAuthHeader(useAuthHeader) {
      config.useAuthHeader = useAuthHeader || false;
    }

    return {
      setEnv: setEnv,
      setSubclient: setSubclient,
      setUseAuthHeader: setUseAuthHeader,

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

function tablelist(env, client) {
  window.TL_ENV = env;
  window.TL_CLIENT = client;
}

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
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var action = _data[key];
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
      }
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
          if (key != 'constructor') {
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

      Service.prototype.buildQueryString = function(query, next) {
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

      Service.prototype.exportUrl = function(query, sort, format) {
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
      }
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

    var LOCAL_STORAGE = window.location.hostname.indexOf('tablelist.com') < 0;
    var DOMAIN = '.tablelist.com';

    var Cookie = function() {};

    Cookie.prototype.get = function(sKey) {
      if (LOCAL_STORAGE) {
        var obj = storage.get(sKey);
        return obj ? obj.cookie : null;
      } else {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      }
    };

    Cookie.prototype.set = function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sValue) return this.remove(sKey, sPath, sDomain);
      if (LOCAL_STORAGE) {
        return storage.set(sKey, {
          cookie: sValue
        });
      } else {
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
      }
    };

    Cookie.prototype.remove = function(sKey, sPath, sDomain) {
      if (!sDomain) sDomain = DOMAIN;
      if (LOCAL_STORAGE) {
        return storage.remove(sKey);
      } else {
        if (!sKey || !this.exists(sKey)) {
          return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
      }
    };

    Cookie.prototype.exists = function(sKey) {
      if (LOCAL_STORAGE) {
        return storage.exists(sKey);
      } else {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      }
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
			FB.login(function(response){
				if (response && response.authResponse) {
					var accessToken = response.authResponse.accessToken;
	                next(null, accessToken);
				} else {
					next(response);
				}
			}, { scope: PERMISSIONS });
		};

		return new Facebook();
	}]);
angular
  .module('tl')
  .factory('tlHTTPInterceptor', ['tl.config', 'tl.keychain', function(config, keychain) {
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
      }
    }
  }])
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
      if (endpoint.slice(0, 1) != '/') {
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

      var SUFFIX = config.ENV_PROD ? '' : '_dev';
      var AUTH_KEY = 'tl_auth' + SUFFIX;
      var PROSPECT_KEY = 'tl_prospect' + SUFFIX;

      var Keychain = function() {};

      Keychain.prototype.authToken = function() {
        return cookie.get(AUTH_KEY);
      };

      Keychain.prototype.setAuthToken = function(token) {
        return cookie.set(AUTH_KEY, token);
      };

      Keychain.prototype.prospectToken = function() {
        var token = cookie.get(PROSPECT_KEY);
        if (!token) {
          token = utils.guid(16, '-');
          this.setProspectToken(token);
        }
        return token;
      };

      Keychain.prototype.setProspectToken = function(token) {
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
	.factory('tl.session', ['tl.config', function(config){

		var Session = function(){};

		Session.prototype.get = function(key) {
			try {
				var val = sessionStorage.getItem(key);
				return JSON.parse(val);
			} catch(e) {
				return null;
			}
		};

		Session.prototype.set = function(key, obj) {
			if (obj) {
				try {
					var val = JSON.stringify(obj);
					return sessionStorage.setItem(key, val);
				} catch(e) {
					return null;
				}
			} else {
				this.remove(key);
			}
		};

		Session.prototype.remove = function(key) {
			return sessionStorage.removeItem(key);
		};

		Session.prototype.exists = function(key) {
			return this.get(key) != null;
		};

		Session.prototype.clear = function() {
			return sessionStorage.clear();
		};

		return new Session();
	}]);
angular
  .module('tl')
  .factory('tl.storage', ['tl.config', function(config) {
    'use strcit';

    var Storage = function() {};

    Storage.prototype.get = function(key) {
      try {
        var val = localStorage.getItem(key);
        return JSON.parse(val);
      } catch (e) {
        return null;
      }
    };

    Storage.prototype.set = function(key, obj) {
      if (obj) {
        try {
          var val = JSON.stringify(obj);
          return localStorage.setItem(key, val);
        } catch (e) {
          return null;
        }
      } else {
        this.remove(key);
      }
    };

    Storage.prototype.remove = function(key) {
      return localStorage.removeItem(key);
    };

    Storage.prototype.exists = function(key) {
      return this.get(key) != null;
    };

    Storage.prototype.clear = function() {
      return localStorage.clear();
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
angular
  .module('tl')
  .factory('tl.ws', ['tl.config', 'tl.http', 'tl.keychain', function(config, http, keychain) {

    var MAX_EVENTS = 50; // hold on to 50 events max

    return function(endpoint, onMessage, onError) {

      /*==================================================*
		    /* Instance Vars
		    /*==================================================*/

      var _this = this;
      var _events = [];
      var ws = null;
      var PING = 'ping';
      var PONG = 'pong';
      this.endpoint = endpoint;

      /*==================================================*
		    /* Getters
		    /*==================================================*/

      this.events = function() {
        return _events;
      };

      this.isConnected = function() {
        return ws && ws.readyState == 1;
      };

      this.socket = function() {
        return ws;
      };

      /*==================================================*
		    /* Methods
		    /*==================================================*/

      this.connect = function() {

        if (ws) {
          this.disconnect();
          ws = null;
        }

        ws = new WebSocket(this.wsUrl(endpoint));

        var interval = 0;

        ws.onopen = function() {
          interval = setInterval(function() {
            ws.send(PING);
          }, 5000);
        };

        ws.onmessage = function(event) {
          if (event.data === PONG) {
            return;
          }

          try {
            var data = JSON.parse(event.data);
            _events.unshift(data);
            if (_events.length > MAX_EVENTS) {
              _events.pop();
              console.log('removed event: ' + _events.length);
            }
            if (onMessage) onMessage(data, _events);
          } catch (err) {
            console.log('Failed to parse data from socket:');
            console.log(err);
          }
        };

        ws.onclose = function(err) {
          clearInterval(interval);
          setTimeout(function() {
            _this.connect();
          }, 1000);
        };

        ws.onerror = function(err) {
          if (onError) onError(err);
        };
      };

      this.disconnect = function() {
        if (this.isConnected()) {
          ws.close();
        }
      };

      this.wsUrl = function(endpoint) {
        return http.apiUrl(endpoint).replace('http', 'ws') + '?auth=' + keychain.authToken();
      };
    }
  }]);


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
     * Stores an auth token in the keychain
     */
    AuthService.prototype.setAuthToken = function(token) {
      return keychain.setAuthToken(token);
    };

    /**
     * Registers a new user
     */
    AuthService.prototype.register = function(options) {
      if (!options) throw new Error('options is required');
      if (!options.email) throw new Error('options.email is required');
      if (!options.password) throw new Error('options.password is required');
      if (!options.firstName) throw new Error('options.firstName is required');
      if (!options.lastName) throw new Error('options.lastName is required');

      var _this = this;

      return Auth.register({}, options).$promise.then(function success(auth) {
        _this.setAuthToken(auth.token);
        user.setCurrentUser(auth.user);
      });
    };

    /**
     * Logs in a user via email and password
     */
    AuthService.prototype.login = function(email, password, success, error) {
      success = success || function() {};
      var _this = this;
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
      fb.login(function(err, token) {
        return Auth.loginFacebook({}, {
            facebookToken: token
          })
          .$promise.then(function(auth) {
            _this.setAuthToken(auth.token);
            user.setCurrentUser(auth.user);
            success(auth);
          }, error);
      });
    };

    /**
     * Logs out the current user
     */
    AuthService.prototype.logout = function() {
      this.setAuthToken(null);
      user.setCurrentUser(null);
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
      join: {
        method: 'POST',
        url: 'booking/join'
      },
      accept: {
        method: 'POST',
        url: endpoint + '/accept'
      },
      decline : {
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
      readSplitTable: {
        method: 'GET',
        url: 'booking/split/:code'
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

      var opts = {}
      var _this = this;
      
      opts.sort = options.sort || DEFAULT_SORT;
      opts.limit = options.limit || DEFAULT_LIMIT;
      opts.admin = options.admin || false;
      delete options.sort;
      delete options.limit;
      delete options.admin;
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

    BookingService.prototype.void = function(id, notify, success, error) {
      return Booking.void({}, {
        id: id,
        notify: notify ? true : false
      }, success, error);
    };

    BookingService.prototype.refund = function(id, amount, reason, success, error) {
      return Booking.refund({}, {
        id: id,
        money: amount,
        reason: reason
      }, success, error);
    };

    BookingService.prototype.join = function(splitCode, success, error) {
      return Booking.join({}, {
        splitCode: splitCode,
      }, success, error);
    };

    BookingService.prototype.accept = function(id, success, error) {
      return Booking.accept({}, {
        id: id
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

    BookingService.prototype.readSplitTable = function(splitCode, success, error) {
      return Booking.readSplitTable({
        code: splitCode
      }, {}, success, error);
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
		
		var CampaignService = Service.extend(User);

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

angular
	.module('tl')
	.factory('tl.city.resource', ['tl.resource', function(resource){
		return resource('/city/:id', {
			id: '@id'
		}, {
			// no extra methods
		});
	}]);

angular
	.module('tl')
	.service('tl.city.service', ['tl.service', 'tl.city.resource', function(Service, City){

		var CityService = Service.extend(City);

		return new CityService();
	}]);
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

      ImageService.prototype.upload = function(file) {

        var deferred = $q.defer();

        var formData = new FormData();
        formData.append('image', file);

        var maxFileSize = 4000000; //4mb

        if (file.size > maxFileSize) deferred.reject('File cannot be greater than 4mb');

        tlhttp.upload('/image', {
          size: 'smallSquare'
        }, formData)
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

    /*==============================================================*
    /* Cities
    /*==============================================================*/

    EventService.prototype.listForCity = function(cityId, success, error) {
      return Event.listForCity({
        cityId: cityId
      }, success, error);
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
        id: '@id'
      }, {
        listForVenue: {
          method: 'GET',
          url: '/inventory',
          isArray: true
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

      return new InventoryService();
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
	.service('tl.item', ['tl.item.resource', 'tl.item.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.item.resource', ['tl.resource', function(resource){

		var endpoint = '/item/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			// add additional methods here
		});
	}]);

angular
	.module('tl')
	.service('tl.item.service', ['tl.service', 'tl.item.resource', function(Service, Item){

		var ItemService = Service.extend(Item);

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
      }

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
      }
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
  .service('tl.payment.service', ['tl.service', 'tl.payment.resource',
    function(Service, Payment) {
      'use strict';

      var PaymentService = Service.extend(Payment);

      PaymentService.prototype.addProfile = function(name, number, month, year, cvv, address, city, state, zip, success, error) {
        var data = {
          cardholderName: name,
          cardNumber: number,
          cardExpMonth: month,
          cardExpYear: year,
          cardCvv: cvv,
          cardZip: zip,
          address: {
            address: address,
            city: city,
            state: state
          }
        }

        return this.create(data, success, error);
      };

      PaymentService.prototype.updateProfile = function(profileId, name, number, month, year, cvv, address, city, state, zip, success, error) {
        if (!profileId) {
          return this.addProfile(name, number, month, year, cvv, address, city, state, zip, success, error);
        }

        var data = {
          cardholderName: name,
          cardNumber: number,
          cardExpMonth: month,
          cardExpYear: year,
          cardCvv: cvv,
          cardZip: zip,
          address: {
            address: address,
            city: city,
            state: state
          }
        }

        return this.update(profileId, data, success, error);
      };

      return new PaymentService();
    }
  ]);


angular
	.module('tl')
	.service('tl.promo', ['tl.promo.resource', 'tl.promo.service', function(resource, service){
		this.resource = resource;
		this.service = service;
	}]);

angular
	.module('tl')
	.factory('tl.promo.resource', ['tl.resource', function(resource){
		
		var endpoint = '/promo/:id';

		return resource(endpoint, {
			id: '@id'
		}, {
			redeem: {
				method: 'POST',
				url: '/promo/redeem'
			},
		});
	}]);
(function() {
  'use strict';

  angular
    .module('tl')
    .service('tl.promo.service', ['tl.storage', 'tl.promo.resource', 'tl.service',
      function(storage, Promo, Service) {

        var PromoService = Service.extend(Promo);

        PromoService.prototype.redeem = function(promoCode, success, error) {
          var _this = this;
          return Promo.redeem({
            code: promoCode
          });
        };

        return new PromoService();
      }
    ]);
}());


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
				url: '/report/types'
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

		return new ReviewService();
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

		// Referral
		ReferralEntered: "TLReferralEntered",
		ReferralSentFB: "TLReferralSentFB",
		ReferralSentTW: "TLReferralSentTW",
		ReferralSentSMS: "TLReferralSentSMS",
		ReferralSentEmail: "TLReferralSentEmail",

		// Payment
		PaymentAdded: "TLPaymentAdded",
		PaymentUpdated: "TLPaymentUpdated",

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
		EasterEggAccountProfilePicture: "TLEasterEggAccountProfilePicture"
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
			// add additional methods here
		});
	}]);

angular
	.module('tl')
	.service('tl.track.service', ['tl.service', 'tl.track.resource', 'TRACK_EVENTS', 'tl.config', function(Service, Track, EVENTS, config){

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

			if(config.SUB_CLIENT) track.client.os = track.client.os + ('-' + config.SUB_CLIENT);

			return Track.save({}, track);
		};

		return new TrackService();
	}]);

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
        url: '/user/:id/paymentProfiles',
        isArray: true
      },
      listReferrals: {
        method: 'GET',
        url: '/user/:id/referral',
        isArray: true
      },
      listPromos: {
        method: "GET",
        url: "/user/:id/promo",
        isArray: true
      },
      listTasks: {
        method: 'GET',
        url: '/user/:id/task',
        isArray: true
      },
      listQuestions: {
        method: 'GET',
        url: '/user/:id/question',
        isArray: true
      },
      listAnswers: {
        method: 'GET',
        url: '/user/:id/answer',
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
        url: '/user/:id/credit'
      },
      findByReferral: {
        method: "GET",
        url: '/referral/:code'
      },
      getReferralStats: {
        method: "GET",
        url: '/user/:id/referral/stats'
      },
      listVenues: {
        method: "GET",
        url: '/user/:id/venue',
        isArray: true
      },
      favorite: {
        method: "POST",
        url: '/user/:id/favorite',
        isArray: false
      },
      unfavorite: {
        method: "DELETE",
        url: '/user/:id/favorite/:favoriteId',
        isArray: false
      },
      listFavorites: {
        method: "GET",
        url: '/user/:id/favorite',
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

      var UserService = Service.extend(User);

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

      UserService.prototype.addCredit = function(userId, amount, campaignId, success, error) {
        var _this = this;
        return User.addCredit({
          id: userId
        }, {
          amount: amount,
          campaign: campaignId
        }, success, error);
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
        var favoriteId = options.favoriteId
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

      return new UserService();
    }
  ]);


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
      cityId: '@cityId'
    }, {

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
        isArray: true
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
      /* Staff
      /*==============================================================*/

      listStaff: {
        method: 'GET',
        url: endpoint + '/user',
        isArray: true
      },
      addStaff: {
        method: 'POST',
        url: endpoint + '/user',
        isArray: true
      },
      updateStaff: {
        method: 'PUT',
        url: endpoint + '/user/:userId',
        isArray: true
      },
      removeStaff: {
        method: 'DELETE',
        url: endpoint + '/user/:userId',
        isArray: true
      },

      listBookings: {
        method: 'GET',
        url: endpoint + '/booking',
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

      /*==============================================================*
    /* Cities
    /*==============================================================*/

      VenueService.prototype.listForCity = function(cityId, success, error) {
        return Venue.listForCity({
          cityId: cityId
        }, success, error);
      };

      VenueService.prototype.listCityFeatured = function(cityId, success, error) {
        return Venue.listCityFeatured({
          cityId: cityId
        }, success, error);
      };

      VenueService.prototype.listCityTonight = function(cityId, success, error) {
        return Venue.listCityTonight({
          cityId: cityId
        }, success, error);
      };

      /*==============================================================*
    /* Inventory
    /*==============================================================*/

      VenueService.prototype.listInventory = function(options) {
        if (!options) throw new Error('options.required');
        if (!options.id) throw new Error('options.id is required');

        options.start = options.start || moment().startOf('month').format("YYYY-MM-DD");
        options.end = options.end || moment().endOf('month').format("YYYY-MM-DD");
        options.ticket = options.ticket || 'false';

        return Venue.listInventory(options).$promise;
      };

      /*==============================================================*
    /* Items
    /*==============================================================*/

      VenueService.prototype.listItems = function(id, success, error) {

        return Venue.listItems({
          id: id
        }, success, error);
      };


      VenueService.prototype.listBookings = function(params, success, error) {

        return Venue.listBookings(params, success, error);
      };

      return new VenueService();
    }
  ]);
