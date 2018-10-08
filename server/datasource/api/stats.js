/**
  * # Statistics API
  * @description Returns statistics on Encompass. Useful for running tests.
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
const Q        = require('q');
const inflect  = require('i')();
const models   = require('../schemas');

module.exports.get = {};

function stats(req, res, next){
  var counts = ['Workspace', 'Submission', 'Selection', 'Folder', 'User', 'Comment', 'Tagging', 'Error'];
  var promises = [];
  counts.forEach(function(m){
    promises.push(models[m].count().exec());
  });
  var all = Q.all(promises);

  all.then(function(results){
    var response = { counts: {} };
    for(var i=0; i<results.length; i++) {
      var model = inflect.pluralize(counts[i].toLowerCase());
      response.counts[model] = results[i];
    }
    res.send(response);
  });
}

module.exports.get.stats = stats;
