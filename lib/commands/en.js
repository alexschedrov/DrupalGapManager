/**
 * Module dependencies.
 */
var drupalgap = require('../drupalgap'),
    utils = require('../utils'),
    project = require('../project'),
    fs = require('fs-extra'),
    _ = require('underscore');

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

  drupalgap.init(function(drupalgapContext) {
    var project_name = args.shift();
    if (project_name === undefined) {
      console.log('Please enter MODULE name.' + '\n');
      console.log(exports.usage);
      process.exit(1);
    }

    // Check if module is exist.
    // @todo check <MODULE>.js?
    if (project.moduleExist(project_name)) {
      fs.readFile('app/settings.js', 'utf8', function (err, data) {
        if (err) {
          return console.log(err.message);
        }

        // Build settings line.
        var settings_line = "Drupal.modules." + module_type + "['" + project_name + "'] = {};";

        // Check if settings.js already contain this settings.
        if (_.has(drupalgapContext.Drupal.modules.contrib, project_name) || _.has(drupalgapContext.Drupal.modules.custom, project_name)) {
          console.log('Module ' + project_name + ' is already enabled.');
          process.exit(1);
        }
        else {
          // Add module to the settings.js.
          // @todo need to improve adding.
          data += settings_line + '\n';
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
  });
};
