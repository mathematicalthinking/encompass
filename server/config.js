/**
 * # Config for the application
 * @description This file contains all the defaults and
 *   configured values to be referenced elsewhere in the app
 * @since 2.0.0
 */

/*eslint no-process-env: "off"*/

const nconf = require('nconf');
const logs = require('log4js');
const build = process.env.BUILD;
console.log('build: ', build);

// const today = new Date();
// const aYearAgo = new Date(today.getFullYear() - 1, 8, 18, 0, 0, 1);

nconf.argv().env().file({ file: 'config.json' });

nconf.add('release', { type: 'file', file: 'release.json' });

nconf.defaults({
  port: '8080',
  devPort: '8080',
  testPort: '8082',
  web: {
    base: '/'
  },
  devDBName: 'encompass',
  testDBName: 'encompass_test',
  seedDBName: 'encompass_seed',
  // Default database configuration updated by server.js
  //   - dev, tet and seed are hard coded
  //   - staging and production are updated from .env file values
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
  // cache: {
  //   key: process.env.CACHE_KEY,
  //   file: 'test/data/defaultPd.json',
  //   searchUrl: process.env.POW_SEARCH_URL,
  //   getUrl: process.env.POW_GET_URL,
  //   fromDate: aYearAgo.getTime()
  // },
  logs: {
    server: 'ERROR',
    auth: 'INFO',
    console: 'ERROR',
    misc: 'ERROR'
  }
});

exports.nconf = nconf;

// var logConf = nconf.get('logs');

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
