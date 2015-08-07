
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
