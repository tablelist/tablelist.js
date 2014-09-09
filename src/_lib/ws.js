
angular
	.module('tl')
	.factory('tl.ws', ['tl.config', 'tl.http', function(config, http){

		var MAX_EVENTS = 50; // hold on to 50 events max

		return function(endpoint, onMessage, onError) {

		    /*==================================================*
		    /* Instance Vars
		    /*==================================================*/

		    var _this   = this;
		    var _events = [];
		    var ws      = null;
		    var PING    = 'ping';
		    var PONG    = 'pong';

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

		        ws = new WebSocket(wsUrl(endpoint));

		        var interval = 0;

		        ws.onopen = function() {
		            interval = setInterval(function(){
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
		                    console.log('removed event: '+_events.length);
		                }
		                if (onMessage) onMessage(data, _events);
		            } catch(err) {
		                console.log('Failed to parse data from socket:');
		                console.log(err);
		            }
		        };

		        ws.onclose = function(err) {
		            clearInterval(interval);
		            setTimeout(function(){
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
		    	return http.apiUrl(endpoint).replace('http', 'ws');
		    };
		}
	}]);