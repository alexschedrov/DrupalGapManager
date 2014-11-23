/**
 * Module dependencies.
 */
var drupalgap = require('../drupalgap'),
    utils = require('../utils'),
    project = require('../project'),
    tmp = require('../tmp'),
    fs = require('fs-extra'),
    request = require('request');

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
exports.summary = 'Download a module';

exports.usage = '' +
'dgm dl MODULE\n' +
'\n' +
'Parameters:\n' +
'  MODULE    Module to install\n' +
'\n';


/**
 * Run function called when "dgm dl" command is used.
 */
exports.run = function (commands, args, options) {
  // @todo ask version on --select option.
  // @todo ask about overwriting.
  drupalgap.init(function(drupalgapContext) {
    var version = '';
    var project_name = args.shift();
    if (project_name === undefined) {
      console.log('Please enter MODULE name.' + '\n');
      console.log(exports.usage);
      process.exit(1);
    }

    // Get project info.
    project.getProjectInfo(project_name, function(error, project_info) {
      if (project_info[0] === null) {
        console.log('Could not download requested project.');
        process.exit(1);
      }
      else {
        var repo_name = project_info.github.full_name;
        if (repo_name !== undefined) {
          project.getProjectRelease(repo_name, function (error, releases) {
            if (releases.length > 0) {
              // Contains release.
              var latest_release = releases[0];
              version = latest_release.name;
              console.log('Downloading module ' + project_info.github.name + ' ' + version + '.');
            }
            else {
              // Download dev version.
              version = '7.x-1.x';
              console.log('Downloading module ' + project_info.github.name + ' latest dev snapshot of ' + version + '.');
            }

            if (version !== undefined && version !== '') {
              tmp.init();
              var release_url = 'https://github.com/' + repo_name + '/archive/' + version + '.zip';
              var file = tmp.folder + '/' + project_info.github.name + '-' + version;
              var out = fs.createWriteStream(file + '.zip');

              // Download project.
              request(release_url).pipe(out).on('close', function () {

                // Extract project.
                console.log('Downloaded ' + project_info.github.name + ' ' + version + '.');
                var unzip = require('unzip');
                var fstream = require('fstream');
                var readStream = fs.createReadStream(file + '.zip');
                var writeStream = fstream.Writer(tmp.folder);
                readStream
                  .pipe(unzip.Parse())
                  .pipe(writeStream).on('close', function() {

                    // Move project to the appropriate directory.
                    fs.move(file, 'app/modules/' + project_info.github.name, function (err) {
                      if (err) {
                        throw err;
                      }
                      console.log('Extracted ' + project_info.github.name + ' ' + version + ' to the "app/modules/' + project_info.github.name + '".');
                      tmp.clean();
                    });
                  });
              });
            }
          });
        }
      }
    });
  });
};
