/**
 * Module dependencies.
 */
var fs = require('fs-extra');

/**
 * Path to the temporary folder.
 */
exports.folder = '.tmp';

/**
 * Clean temporary folder.
 */
exports.clean = function() {
  try {
    var files = fs.readdirSync(exports.folder);

    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        var filePath = exports.folder + '/' + files[i];
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
        else {
          exports.clean(filePath);
        }
      }
    }
    fs.rmdirSync(exports.folder);
  }
  catch(e) {
    return false;
  }
};

/**
 * Init temporary folder.
 */
exports.init = function() {
  if (!fs.existsSync(exports.folder)) {
    fs.mkdir(exports.folder);
  }
};
