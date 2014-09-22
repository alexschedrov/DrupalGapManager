/**
 * Module dependencies.
 */
var utils = require('./utils'),
    fs = require('fs-extra'),
    vm = require('vm');

// Create DrupalGap sandbox.
var drupalGapSandbox = {
  Drupal: {
    settings: {
      cache: {
        entity: {},
        views: {}
      }
    },
    modules: {
      contrib: {},
      custom: {}
    }
  },
  drupalgap: {
    settings: {}
  },
  menu_popup_get_default_options: function() {}
};

// Create DrupalGap context based on the sandbox data.
var drupalGapContext = vm.createContext(drupalGapSandbox);

if (utils.isDrupalGapDir()) {
  var content = fs.readFileSync('app/settings.js');
  vm.runInContext(content, drupalGapContext);
  exports = drupalGapContext;
}
else {
  console.log('Please run command from DrupalGapSDK directory.');
  process.exit(1);
}
