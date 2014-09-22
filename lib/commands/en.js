/**
 * Module dependencies.
 */
var utils = require('../utils'),
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
exports.summary = 'Enable a module';

exports.usage = '' +
'dgm en MODULE\n' +
'\n' +
'Parameters:\n' +
'  MODULE    Module to enable\n' +
'\n';


/**
 * Run function called when "dgm en" command is used.
 */
exports.run = function (commands, args, options) {
  var module_type = 'contrib';

  if (options.custom === true) {
    module_type = 'custom';
  }

  if (utils.isDrupalGapDir()) {
    var project_name = args.shift();
    if (project_name === undefined) {
      console.log('Please enter MODULE name.' + '\n');
      console.log(exports.usage);
      process.exit(1);
    }

    // Check if module is exist.
    if (project.moduleExist(project_name)) {
      fs.readFile('app/settings.js', 'utf8', function (err, data) {
        if (err) {
          return console.log(err.message);
        }

        // Build settings line.
        var settings_line = "Drupal.modules." + module_type + "['" + project_name + "'] = {};";

        // Check if settings.js already contain this settings.
        if (data.indexOf(settings_line) > 0) {
          console.log('Module ' + project_name + ' is already enabled.');
          process.exit(1);
        }
        else {
          // Add module to the settings.js.
          data += '\n' + settings_line + '\n';
          fs.writeFile('app/settings.js', data, 'utf8', function (err) {
            if (err) {
              return console.log(err);
            }
            console.log('Updated settings.js.');
          });
        }
      });
    }
    else {
      console.log(project_name + ' was not found.');
      console.log('You can try to download module: "dgm dl ' + project_name + '"');
    }
  }
  else {
    console.log('Please run command from DrupalGapSDK directory.');
  }
};
