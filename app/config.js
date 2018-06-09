/* config for application */

var fs = require('fs'),
  nconf = require('nconf'),
  logs = require('log4js'),
  build = process.env.BUILD;


var today = new Date();
var aYearAgo = new Date(today.getFullYear() - 1, 8, 18, 0, 0, 1);

nconf.argv().env().file({ file: 'config.json' });

nconf.add('release', { type: 'file', file: 'release.json' });

nconf.defaults({
  port: '8080',
  devPort: '8080',
  testPort: '8080',
  prodPort: '80',
  web: {
    base: '/'
  },
  sso: {
    // http://dev.nctm.org/SSO/TmfCheckToken.ashx
    baseUrl: 'http://localhost:3000',
    validateUrl: "/SSO/TmfCheckToken.ashx",
    //baseUrl: 'http://dev.nctm.org',
    //validateUrl: "/SSO/TmfCheckToken.ashx"
    service: 'http://localhost:8080/back',
  },
  devDBName: 'encompass',
  testDBName: 'encompass_test',
  prodDBName: 'encompass',
  database: {
    host: 'localhost',
    name: 'encompass',
    user: 'encompass',
    pass: '',
    port: 27017,
    collections: ["workspaces",
      "folders",
      "submissions",
      "selections",
      "comments"
    ]
  },
  cache: {
    key: process.env.CACHE_KEY,
    file: 'test/data/defaultPd.json',
    searchUrl: process.env.POW_SEARCH_URL,
    getUrl: process.env.POW_GET_URL,
    fromDate: aYearAgo.getTime()
  },
  logs: {
    server: 'ERROR',
    auth: 'INFO',
    console: 'ERROR',
    misc: 'ERROR'
  }
});

exports.nconf = nconf;

var logConf = nconf.get('logs');

logs.configure({
  appenders: {
    srv: { type: 'file', filename: 'server.out', category: ['console'] },
    err: { type: 'file', filename: 'error.out', category: ['server'] },
    con: { type: 'console' }
  },
  categories: {
    default: { appenders: ['srv', 'err', 'con'], level: 'debug' }
  },
  replaceConsole: true
});
