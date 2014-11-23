/**
 * Module dependencies.
 */
var requestify = require('requestify'),
    fs = require('fs-extra');

exports.endpoint = 'http://www.drupalgap.org/drupalgap/dgm_resources/project_download';
exports.drupalgap_github_name = 'signalpoint/DrupalGap';

/**
 * Returns project info.
 */
exports.getProjectInfo = function(project_name, callback) {
  requestify.post(exports.endpoint, {
    project_name: project_name
  })
    .then(function(response) {
      callback(null, response.getBody());
    });
};

/**
 * Returns available releases of project.
 */
exports.getProjectRelease = function(github_name, callback) {
  requestify.get('https://api.github.com/repos/' + github_name + '/tags')
    .then(function(response) {
      callback(null, response.getBody());
    });
};

/**
 * Returns whether the module exist.
 */
exports.moduleExist = function(module_name) {
  return fs.existsSync('app/modules/' + module_name) || fs.existsSync('app/modules/custom/' + module_name);
};

/**
 * Returns whether the theme exist.
 */
exports.themeExist = function(theme_name) {
  return fs.existsSync('app/themes/' + theme_name);
};
