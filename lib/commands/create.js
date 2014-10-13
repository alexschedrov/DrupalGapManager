/**
 * Module dependencies.
 */
var cordova = require('cordova-lib'),
    pjson = require('../../package.json'),
    fs = require('fs-extra'),
    validator = require('validator'),
    _ = require('underscore'),
    request = require('request'),
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

      if (platform == 'web') {
        if (fs.existsSync(path)) {
          console.log('Path already exist: ' + path);
          process.exit(1);
        }

        // Download only SDK.
        exports.downloadDrupalGap(path, function (err) {
          if (url !== '') {
            exports.initSettings(path, function (err) {
              exports.setSitePath(path, url, function (err) {});
            });
          }
        });

      }
      else {
        exports.create(path, function (err) {
          exports.removeAppFolder(path, function (err) {
            exports.downloadDrupalGap(path + '/www', function (err) {
              if (url !== '') {
                exports.initSettings(path + '/www', function (err) {
                  exports.setSitePath(path + '/www', url, function (err) {
                    exports.addPlatform(platform, path, function (err) {});
                  });
                });
              }
              else {
                exports.addPlatform(platform, path, function (err) {});
              }
            });
          })
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
    cordova.cordova.create(path, function (err) {
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
  cordova.cordova.platform('add', [platform]);
  // @todo get rid of delays.
  _.delay(cordova.cordova.plugin, 10000, 'add', exports.plugins);
  _.delay(cordova.cordova.prepare, 20000, platform, path);
  _.delay(cordova.cordova.build, 30000, platform, path);
};

/**
 * Add plugin to the Cordova project.
 */
exports.addPlugin = function (callback) {
  cordova.plugin('add', exports.plugins);
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
  var release_url = 'https://github.com/signalpoint/DrupalGap/archive/drupalgap_' + pjson.release + '.zip';
  request(release_url).pipe(out).on('close', function () {
    console.log('Downloaded DrupalGap development kit.');
    var unzip = require('unzip');
    var fstream = require('fstream');
    var readStream = fs.createReadStream(tmp.folder + '/sdk.zip');
    var writeStream = fstream.Writer(tmp.folder);
    readStream
      .pipe(unzip.Parse())
      .pipe(writeStream).on('close', function() {
        fs.move(tmp.folder + '/DrupalGap-drupalgap_' + pjson.release, path, function (err) {
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
