
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
