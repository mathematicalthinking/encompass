var system = require('system');
var fs     = require('fs');
var _      = require('underscore');
var file   = 'config.json';

var host   = 'http://localhost:8080';

if(fs.isReadable(file)) {
  console.log('readable');
  var data   = fs.read(file);
  var config = JSON.parse(data);
  host       = config.test.host;
} else {
  console.warn('config file ' +file+ ' not readable, using hardcoded default for host');
}

module.exports = host;
