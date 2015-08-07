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
