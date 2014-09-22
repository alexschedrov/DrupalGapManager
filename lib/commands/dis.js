/**
 * Module dependencies.
 */
var drupalgap = require('../drupalgap'),
    utils = require('../utils'),
    project = require('../project'),
    fs = require('fs-extra');

/**
 * Error handler.
 */
process.on('uncaughtException', function (err) {
  console.error(err.message);
});

/**
 * Usage information and docs.
 */
exports.summary = 'Disable a module';

exports.usage = '' +
'dgm dis MODULE\n' +
'\n' +
'Parameters:\n' +
'  MODULE    Module to disable\n' +
'\n';

/**
 * Run function called when "dgm dis" command is used.
 */
exports.run = function (commands, args, options) {
  var module_type = 'contrib';

  if (options.custom === true) {
    module_type = 'custom';
  }

  drupalgap.init(function(drupalgapContext) {
    var project_name = args.shift();
    if (project_name === undefined) {
      console.log('Please enter MODULE name.' + '\n');
      console.log(exports.usage);
      process.exit(1);
    }

    fs.readFile('app/settings.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err.message);
      }

      // Build settings line.
      var settings_line = "Drupal.modules." + module_type + "['" + project_name + "'] = {};";

      // Check if settings.js already contain this settings.
      if (data.indexOf(settings_line) > 0) {
        // Delete module from the settings.js.
        var result = data.replace(settings_line + '\n', "").replace(settings_line, "");
        fs.writeFile('app/settings.js', result, 'utf8', function (err) {
          if (err) {
            return console.log(err);
          }
          console.log('Updated settings.js.');
        });
      }
      else {
        console.log('Module ' + project_name + ' is already disabled.');
        process.exit(1);
      }
    });
  });
};
