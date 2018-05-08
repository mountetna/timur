/*  
 * From a file called cookie.js
 *
 * A complete cookies reader/writer framework with full unicode support.
 *
 * https://developer.mozilla.org/en-US/docs/DOM/document.cookie
 *
 * This framework is released under the GNU Public License, version 3 or later.
 * http://www.gnu.org/licenses/gpl-3.0-standalone.html
 *
 * Syntaxes:
 *
 * Cookies.setItem(name, value[, end[, path[, domain[, secure]]]])
 * Cookies.getItem(name)
 * Cookies.removeItem(name[, path], domain)
 * Cookies.hasItem(name)
 * Cookies.keys()
 *
 */

export const getItem = function (sKey){
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
};

export const setItem = function(sKey, sValue, vEnd, sPath, sDomain, bSecure){

  if(!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)){ return false; }
  
  var sExpires = "";
  if(vEnd){

    switch(vEnd.constructor){

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

export const removeItem = function(sKey, sPath, sDomain){
  if(!sKey || !this.hasItem(sKey)){ return false; }
  document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
  return true;
};

export const hasItem = function(sKey){
  return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
};

  /* optional method: you can safely remove it! */ 
export const keys = function(){
  var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
  for(var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }

  if(aKeys.length == 1){
    if(aKeys[0] == ""){
      return null;
    }
  }
  
  return aKeys;
};
