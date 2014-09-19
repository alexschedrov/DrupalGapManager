var cordova = require('cordova'),
    dgm_core = require('../dgm_core'),
    fs = require('fs'),
    _ = require('underscore');

process.on('uncaughtException', function (err) {
  console.error(err.message);
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
    switch (platform) {
      case 'ios':
        exports.create(path);
        // @todo get rid of delay.
        _.delay(exports.platformAdd, 1000, platform, path);
        break;

      case 'android':
        exports.create(path);
        // @todo get rid of delay.
        _.delay(exports.platformAdd, 1000, platform, path);;
        break;

      default:
        console.log('Undefined platform: ' + platform);
        console.log(exports.usage);
        break;
    }
  }
};

exports.create = function (path) {
  if (fs.existsSync(path)) {
    console.log('Path already exist: ' + path);
    process.exit(1);
  }
  else {
    cordova.create(path);
  }
};

exports.platformAdd = function (platform, path) {
  process.chdir(process.cwd() + '/' + path);
  cordova.platform('add', [platform]);
  // @todo get rid of delays.
  _.delay(cordova.prepare, 1000, platform, path);
  _.delay(cordova.build, 1000, platform, path);
};
