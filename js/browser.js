(function (self) {
  'use strict';

  function Clone() {
  }

  self.clone = function (obj) {
    Clone.prototype = obj;
    return new Clone();
  };

  self.loadJSON = function (file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === XMLHttpRequest.DONE) {
        if (xobj.status !== 200 && xobj.status !== 304) {
          return callback('Failed to load: ' + file + '!');
        }
        callback(null, xobj.responseText);
      }
    };
    xobj.send(null);
  };

})(window);
