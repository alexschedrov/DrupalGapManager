/**
 * Module dependencies.
 */
var fs = require('fs-extra'),
    _ = require('underscore'),
    tmp = require('../tmp');

/**
 * Error handler.
 */
process.on('uncaughtException', function (err) {
  console.error(err.message);
  tmp.clean();
});

/**
 * Usage information and docs.
 */
exports.summary = 'Create a theme';
exports.usage = '' +
'dgm create-theme NAME\n' +
'\n' +
'Parameters:\n' +
'  NAME    Name of the theme.\n' +
'\n';

/**
 * Run function called when "dgm create-theme" command is used.
 */
exports.run = function (commands, args, options) {
  var name = args.shift();

  if (name === undefined) {
    console.log('Please enter NAME.');
    console.log(exports.usage);
  }
  else {
    // @todo implementation.
  }
};
