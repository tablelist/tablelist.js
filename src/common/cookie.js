/**
 * Angular module for setting, reading and removing cookies
 * 
 * @src: https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 */
angular
	.module('tl')
	.factory('tl.cookie', function(){

		var Cookie = function(){};

		Cookie.prototype.get = function(sKey) {
			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		};

		Cookie.prototype.set = function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
			if (!sValue) return this.remove(sKey, sPath, sDomain);
			if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
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
		    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		    return true;
		};

		Cookie.prototype.remove = function(sKey, sPath, sDomain) {
			if (!sKey || !this.exists(sKey)) { return false; }
			document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
			return true;
		};

		Cookie.prototype.exists = function(sKey) {
			return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		};

		return new Cookie();
	});