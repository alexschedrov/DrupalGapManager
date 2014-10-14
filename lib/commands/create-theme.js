/**
 * Module dependencies.
 */
var drupalgap = require('../drupalgap'),
    fs = require('fs-extra'),
    _ = require('underscore'),
    tmp = require('../tmp'),
    project = require('../project'),
    Seq = require('seq');

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
 * Source theme which contains base templates.
 */
exports.source_theme = 'themes/easystreet3';

/**
 * Mail folder for custom templates.
 */
exports.themes_directory = 'app/themes';

/**
 * Templates which should be created.
 */
exports.templates = [
  'node.tpl.html',
  'page.tpl.html',
  'user-profile.tpl.html'
];

/**
 * Run function called when "dgm create-theme" command is used.
 */
exports.run = function (commands, args, options) {
  drupalgap.init(function(drupalgapContext) {
    var theme_name = args.shift();
    if (theme_name === undefined) {
      console.log('Please enter THEME name.' + '\n');
      console.log(exports.usage);
      process.exit(1);
    }

    // Check if theme is exist.
    if (!project.themeExist(theme_name)) {

      // Run series of tasks.
      var tasks = Seq();
      tasks.seq(function () {
        exports.createThemesDirectory(this);
      });
      tasks.seq(function () {
        exports.createThemeDirectory(theme_name, this);
      });
      tasks.seq(function () {
        exports.createTemplates(theme_name, this);
      });
      tasks.seq(function () {
        exports.createThemeMainFile(theme_name, this);
      });
      tasks.seq(function () {
        exports.addBlocksToSettings(theme_name, this);
      });
    }
    else {
      console.log(theme_name + ' already exists.');
    }
  });
};

/**
 * Create app/themes folder if it not exists.
 */
exports.createThemesDirectory = function (callback) {
  if (!fs.existsSync(exports.themes_directory)) {
    fs.mkdirSync(exports.themes_directory);
    console.log('Directory ' + exports.themes_directory + ' has been created.');
  }
  callback(null);
};

/**
 * Create directory for new theme.
 */
exports.createThemeDirectory = function (theme_name, callback) {
  fs.mkdirSync(exports.themes_directory + '/' + theme_name);
  console.log('Directory ' + exports.themes_directory + '/' + theme_name + ' has been created.');
  callback(null);
};

/**
 * Create basic templates.
 */
exports.createTemplates = function (theme_name, callback) {
  _.each(exports.templates, function(item) {
    fs.copySync(exports.source_theme + '/' + item, exports.themes_directory + '/' + theme_name + '/' + item);
    console.log('Template ' + exports.themes_directory + '/' + theme_name + '/' + item + ' has been created.');
  });
  callback(null);
};

/**
 * Create main theme file.
 */
exports.createThemeMainFile = function (theme_name, callback) {
  // @todo create {theme}.js
  // @todo add regions to the {theme}.js
  callback(null);
};

/**
 * Create blocks to the settings.js.
 */
exports.addBlocksToSettings = function (theme_name, callback) {
  // @todo add blocks to the settings.js
  callback(null);
};
