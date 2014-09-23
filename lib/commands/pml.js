/**
 * Module dependencies.
 */
var drupalgap = require('../drupalgap'),
    utils = require('../utils'),
    project = require('../project'),
    fs = require('fs-extra'),
    Table = require('cli-table'),
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
exports.summary = 'Show a list of available modules.';

exports.usage = '' +
'dgm pml\n' +
'\n';

/**
 * Run function called when "dgm en" command is used.
 */
exports.run = function (commands, args, options) {
  // @todo check <MODULE>.js?
  drupalgap.init(function(drupalgapContext) {
    var contrib = [];
    var custom = [];
    var status = '';

    if (fs.existsSync('./app/modules')) {
      contrib = fs.readdirSync('./app/modules');
    }

    if (fs.existsSync('./app/modules/custom')) {
      custom = fs.readdirSync('./app/modules/custom');
    }

    // Create table.
    var table = new Table({
      head: ['Module', 'Type', 'Status'],
      colWidths: [40, 20, 20]
    });

    // Remove custom directory from contrib modules.
    if (_.has(contrib, 'custom')) {
      contrib.splice(contrib.indexOf('custom'), 1);
    }

    // Contrib modules.
    _.each(contrib, function(context) {
      status = 'Disabled';
      if (_.has(drupalgapContext.Drupal.modules.contrib, context)) {
        status = 'Enabled';
      }
      table.push([context, 'Contrib', status]);
    });

    // Custom modules.
    _.each(custom, function(context) {
      status = 'Disabled';
      if (_.has(drupalgapContext.Drupal.modules.custom, context)) {
        status = 'Enabled';
      }
      table.push([context, 'Custom', status]);
    });

    console.log(table.toString());
  });
};
