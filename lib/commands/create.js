/**
 * Module dependencies.
 */
var cordova = require('cordova'),
    pjson = require('../../package.json'),
    fs = require('fs-extra'),
    validator = require('validator'),
    _ = require('underscore'),
    request = require('request'),
    tmp = require('../tmp'),
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
exports.summary = 'Create a DrupalGap project';
exports.usage = '' +
'dgm create PLATFORM PATH\n' +
'\n' +
'Parameters:\n' +
'  PLATFORM    Type of platform: ios, android or web.\n' +
'  PATH    Path to create application.\n' +
'Options:\n' +
'  --url    URL of the Drupal site.\n';

/**
 * Available platforms.
 */
exports.platforms = ['ios', 'android', 'web'];

/**
 * Required plugins.
 */
exports.plugins = [
  'org.apache.cordova.console',
  'org.apache.cordova.dialogs',
  'org.apache.cordova.file',
  'org.apache.cordova.inappbrowser',
  'org.apache.cordova.network-information',
  'org.apache.cordova.camera',
  'org.apache.cordova.geolocation'
];

/**
 * Run function called when "dgm create" command is used.
 */
exports.run = function (commands, args, options) {
  var platform = args.shift();
  var path = args.shift();
  var url = '';

  if (platform === undefined) {
    console.log('Please enter PLATFORM.');
    console.log(exports.usage);
  }
  else if (path === undefined) {
    console.log('Please enter PATH.');
    console.log(exports.usage);
  }
  else {
    if (_.contains(exports.platforms, platform)) {

      if (_.has(options, 'url')) {
        // @todo check "/" in the end.
        if (!validator.isURL(options.url, {protocols: ['http','https'], require_tld: true, require_protocol: true, allow_underscores: false })) {
          console.log('Please enter valid URL.');
          process.exit(1);
        }
        else {
          url = options.url;
        }
      }

      // Run series of tasks.
      var tasks = Seq();
      if (platform == 'web') {
        tasks.seq(function () {
          exports.downloadDrupalGap(path, this);
        });
        if (url !== '') {
          tasks.seq(function () {
            exports.initSettings(path, this);
          });
          tasks.seq(function () {
            exports.setSitePath(path, url, this);
          });
        }
      }
      else {
        tasks.seq(function () {
          exports.create(path, this);
        });
        tasks.seq(function () {
          exports.removeAppFolder(path, this);
        });
        tasks.seq(function () {
          exports.downloadDrupalGap(path + '/www', this);
        });
        if (url !== '') {
          tasks.seq(function () {
            exports.initSettings(path + '/www', this);
          });
          tasks.seq(function () {
            exports.setSitePath(path + '/www', url, this);
          });
        }
        // @todo Go to context of cordova project instead using process.chdir in addPlatform().
        tasks.seq(function () {
          exports.addPlatform(platform, path, this);
        });
        tasks.seq(function () {
          exports.addPlugin(this);
        });
        tasks.seq(function () {
          exports.prepare(this);
        });
        tasks.seq(function () {
          exports.build(this);
        });
      }
    }
    else {
      console.log('Undefined platform: ' + platform);
      console.log(exports.usage);
    }
  }
};

/**
 * Create Cordova project.
 */
exports.create = function (path, callback) {
  if (fs.existsSync(path)) {
    console.log('Path already exist: ' + path);
    process.exit(1);
  }
  else {
    cordova.create(path, function (err) {
      console.log('Created Cordova project.');
      callback(null);
    });
  }
};

/**
 * Add platform to the Cordova project.
 */
exports.addPlatform = function (platform, path, callback) {
  process.chdir(process.cwd() + '/' + path);
  if (platform == 'android' && (process.env.ANDROID_HOME === '' || process.env.ANDROID_HOME === undefined)) {
    console.log('You need setup correct $ANDROID_HOME variable.');
    console.log('Examples:');
    console.log('export ANDROID_HOME=`brew --prefix android`');
    console.log('or');
    console.log('export ANDROID_HOME=/path/to/you/sdk');
    console.log('export PATH=$ANDROID_HOME/tools:$PATH');
    process.exit(1);
  }
  // @todo Currently no way to do this without delay, because Cordova can't work synchronously.
  _.delay(cordova.platform, 1000, 'add', [platform]);
  console.log('Added ' + platform + ' platform.');
  callback(null);
};

/**
 * Add plugin to the Cordova project.
 */
exports.addPlugin = function (callback) {
  // @todo To add plugins we use cordova-lib, instead cordova.
  // When we use the same object for platform and plugins, appears strange bugs related to internal cordova errors.
  var plugins = require('cordova-lib');
  // @todo Currently no way to do this without delay, because Cordova can't work synchronously.
  _.delay(plugins.cordova.plugin, 5000, 'add', exports.plugins);
  callback(null);
};

/**
 * Prepare Cordova project.
 */
exports.prepare = function (callback) {
  // @todo Currently no way to do this without delay, because Cordova can't work synchronously.
  _.delay(cordova.prepare, 10000);
  callback(null);
};

/**
 * Build Cordova project.
 */
exports.build = function (callback) {
  // @todo Currently no way to do this without delay, because Cordova can't work synchronously.
  _.delay(cordova.build, 20000);
  callback(null);
};

/**
 * Remove default app folder(www).
 */
exports.removeAppFolder = function (path, callback) {
  var folder = process.cwd() + '/' + path + '/www';
  if (fs.existsSync(folder)) {
    fs.remove(folder);
    console.log('Removed default www directory.');
    callback(null);
  }
};

/**
 * Download and extract DrupalGapSDK.
 */
exports.downloadDrupalGap = function (path, callback) {
  tmp.init();
  var out = fs.createWriteStream(tmp.folder + '/sdk.zip');
  var release_url = 'https://github.com/signalpoint/DrupalGap/archive/' + pjson.release + '.zip';
  request(release_url).pipe(out).on('close', function () {
    console.log('Downloaded DrupalGap development kit.');
    var unzip = require('unzip');
    var fstream = require('fstream');
    var readStream = fs.createReadStream(tmp.folder + '/sdk.zip');
    var writeStream = fstream.Writer(tmp.folder);
    readStream
      .pipe(unzip.Parse())
      .pipe(writeStream).on('close', function() {
        fs.move(tmp.folder + '/DrupalGap-' + pjson.release, path, function (err) {
          if (err) {
            throw err;
          }
          console.log('Extracted DrupalGap development kit.');
          tmp.clean();
          callback(null);
        });
      });
  });
};

/**
 * Initialize settings.js file for an application.
 */
exports.initSettings = function (path, callback) {
  fs.createReadStream(path + '/app/default.settings.js')
    .pipe(fs.createWriteStream(path + '/app/settings.js'))
    .on('close', function() {
      console.log('Initialized DrupalGap settings.js file.');
      callback(null);
    });
};

/**
 * Set site path.
 */
exports.setSitePath = function (path, url, callback) {
  fs.readFile(path + '/app/settings.js', 'utf8', function (err, data) {
    if (err) {
      return console.log(err.message);
    }
    var result = data.replace(/site_path = ''/g, "site_path = '" + url + "'");

    fs.writeFile(path + '/app/settings.js', result, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('Updated site_path in settings.js.');
      callback(null);
    });
  });
};
