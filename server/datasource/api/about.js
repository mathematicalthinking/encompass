/**
  * # Statistics API
  * @description Returns statistics on Encompass. Useful for running tests.
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
const nconf = require('../../config').nconf;

module.exports.get = {};

function about(req, res, next){
  res.send(nconf.get('release'));
}

module.exports.get.about = about;
