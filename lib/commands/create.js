/**
 * Module dependencies.
 */
var cordova = require('cordova'),
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
exports.summary = 'Create a DrupalGap';
exports.usage = '' +
'dgm create PLATFORM PATH\n' +
'\n' +
'Parameters:\n' +
'  PLATFORM    Type of platform: ios or android.\n' +
'  PATH    Path to create application.\n' +
'\n';

/**
 * Available platforms.
 */
exports.platforms = ['ios', 'android'];

/**
 * Run function called when "dgm create" command is used.
 */
exports.run = function (commands, args, options) {
  var platform = args.shift();
  var path = args.shift();

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
      exports.create(path);
      // @todo get rid of delay.
      _.delay(exports.removeAppFolder, 1000, path);
      _.delay(exports.downloadDrupalGap, 1000, path);
      _.delay(exports.addPlatform, 20000, platform, path);

      if (_.has(options, 'url')) {
        // @todo check "/" in the end.
        if (!validator.isURL(options.url, {protocols: ['http','https'], require_tld: true, require_protocol: true, allow_underscores: false })) {
          console.log('Please enter valid URL.');
          process.exit(1);
        }
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
exports.create = function (path) {
  if (fs.existsSync(path)) {
    console.log('Path already exist: ' + path);
    process.exit(1);
  }
  else {
    cordova.create(path);
    console.log('Created Cordova project.');
  }
};

/**
 * Add platform to the Cordova project.
 */
exports.addPlatform = function (platform, path) {
  process.chdir(process.cwd() + '/' + path);
  cordova.platform('add', [platform]);
  // @todo get rid of delays.
  _.delay(cordova.prepare, 1000, platform, path);
  _.delay(cordova.build, 1000, platform, path);
};

/**
 * Remove default app folder(www).
 */
exports.removeAppFolder = function (path) {
  var folder = process.cwd() + '/' + path + '/www';
  if (fs.existsSync(folder)) {
    fs.remove(folder);
    console.log('Removed default www directory.');
  }
};

/**
 * Download and extract DrupalGapSDK.
 */
exports.downloadDrupalGap = function (path) {
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
        fs.move(tmp.folder + '/DrupalGap-drupalgap_' + pjson.release, path + '/www', function (err) {
          if (err) {
            throw err;
          }
          console.log('Extracted DrupalGap development kit.');
          tmp.clean();
        });
      });
  });
};
