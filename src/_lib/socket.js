
angular
	.module('tl')
	.factory('tl.socket', ['$websocket', 'tl.http', 'tl.keychain', function($websocket, http, keychain){

    var MAX_EVENTS = 200; // hold on to 200 events max

    return function(endpoint, onMessage, onError) {
      onMessage = onMessage || function() {};
      onError = onError || function() {};

      // instance vars
      var _events = [];
      var ws = null;

      this.connect = function() {

        this.ws = ws = $websocket(this.socketUrl(endpoint), {
					reconnectIfNotNormalClose: true
				});

        ws.onMessage(function(message) {
					var data;

					try {
						data = JSON.parse(message.data);
					} catch(err) {
						return;
					}

          _events.unshift(data);

          onMessage(data);

					if (_events.length >= MAX_EVENTS) {
            _events.pop();
          }
        });

				return this;
      };

      this.events = function() {
        return _events;
      };

      this.isConnected = function() {
        return ws.readyState === 1;
      };

      this.close = function() {
        return ws.close(true);
      };

      this.socketUrl = function(endpoint) {
        var auth = keychain.authToken();
        var prospect = keychain.prospectToken();

        var params = {};
        if (prospect) params.prospect = prospect;
        if (auth) params.auth = auth;

        var url = http.wsUrl(endpoint, params);
        return url.replace('http', 'ws');
      };
    };
	}]);
