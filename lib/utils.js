/**
 * Module dependencies.
 */
var fs = require('fs-extra');

/**
 * Padding a string to minlength by appending spaces.
 */
exports.paddingRight = function (str, minlength) {
  while (str.length < minlength) {
    str = str + ' ';
  }
  return str;
};

/**
 * Returns length of longest element.
 */
exports.longest = function (arr) {
  return arr.reduce(function (a, x) {
    if (x.length > a) {
      return x.length;
    }
    return a;
  }, 0);
};

/**
 * Check the directory is DrupalGap.
 */
exports.isDrupalGapDir = function() {
  var drupalgap_path = './bin/drupalgap.js';
  var settings_path = './app/settings.js';
  return fs.existsSync(drupalgap_path) && fs.existsSync(settings_path);
};
