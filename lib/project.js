/**
 * Module dependencies.
 */
var requestify = require('requestify');

exports.endpoint = 'http://www.drupalgap.org/drupalgap/dgm_resources/project_download';

exports.getProjectInfo = function(project_name, callback) {
  requestify.post('http://www.drupalgap.org/?q=drupalgap/dgm_resources/project_download', {
    project_name: project_name
  })
    .then(function(response) {
      callback(response.getBody());
    });
};

exports.getProjectInfo = function(project_name, callback) {
  requestify.post('http://www.drupalgap.org/?q=drupalgap/dgm_resources/project_download', {
    project_name: project_name
  })
    .then(function(response) {
      callback(response.getBody());
    });
};

exports.getProjectRelease = function(github_name, callback) {
  requestify.get('https://api.github.com/repos/' + github_name + '/tags')
    .then(function(response) {
      callback(response.getBody());
    });
};
