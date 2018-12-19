/*
  * # The Cache
  * @description Cache is responsible for saving submission data from an external source to the database
  *              This source may be a url or a file.
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

var optimist = require('optimist'),
    _        = require('underscore'),
    mongoose = require('mongoose'),
    cache    = require('./api/cache');

/** ## CLI Options
  * We use [Optimist](https://github.com/substack/node-optimist) to make our command line interface
  */

var program = optimist.options({
  h: {
    describe: "Help. You're looking at it.",
    type: 'boolean'
  },
  pd: {
    describe: "Assigns retrieved submissions to a named PD set.",
    type: 'string'
  },
  id: {
    describe: "ID(s) of submissions to retrieve. Use multiple times for multiple IDs",
    type:'number'
  },
  range: {
    describe: "Use this flag to treat `id` as an ID range instead.",
    alias: ['r'],
    'boolean': true
  },
  user: {
    describe: "Username of the user requesting submissions.",
    alias: ['u'],
    type: 'string'
  },
  teacher: {
    describe: "Username of the teacher whose submissions we're requesting.",
    alias: ['t'],
    type: 'string'
  },
  publication: {
    describe: "The publication to pull submissions from.",
    alias: ['pub'],
    type: 'number'
  },
  puzzle: {
    describe: "The puzzle to pull submissions from.",
    alias: ['p'],
    type: 'number'
  },
  date: {
    describe: "Specify the date to retrieve submissions from. Use twice to specify a date range",
    alias: ['d'],
    type:'string',
    // 'default': Date(powConf.since).toString() We should only look back a year but a lot of people don't have recent submissions
  }
})
.usage("\nCache accepts a source file or url path from which to retrieve JSON submission data and saves this to the database.\n" +
  "It may also compose this request itself given other parameters. Use the --pd option to save retrieved submissions to\n" +
  "a PD set for future use.\n\n" +
  "Usage: node cache [options] {file or url}").argv;


/*
 * @method formatCacheOptions
 * @description Converts our accepted command line arguments to allowed cache options
 * @returns {Object} A cache options object
 */
function formatCacheOptions() {
  // Clone arguments to this script
  var query = JSON.parse( JSON.stringify(program) );

  // Remove those that aren't relevant to the query
  delete query.$0;
  delete query.h;
  delete query.src;
  delete query.s;
  delete query.f;
  delete query.range;
  delete query.r;
  delete query.t;
  delete query.d;
  delete query.c;
  delete query.pub;
  delete query.p;
  delete query.u;
  delete query.id;

  // Rename those that should be named differently
  /* jshint camelcase: false */
  if( query._ ) { query.source = program._[0]; }
  if( query.pd ) { query.collection = program.pd; }
  delete  query._;
  delete query.pd;

  // Massage those that have multiple query methods
  var complex = {
    ids: program.id,
    dates: program.date
  };

  if(!!complex.ids &&  _.isArray(complex.ids) ) {
    if(!program.range) {
      query.submissions = complex.ids;
    }
    else {
      query.since_id = complex.ids[0];
      query.max_id   = complex.ids.slice(-1).pop(); //returns the last item w/o modifying array
    }
  }

  if( _.isArray(complex.dates) ) {
    try {
      query.since_date = Date.parse(program.date[0]);
      query.max_date = Date.parse(program.date[1]);
    }
    catch(err) {
      delete query.since_date;
      delete query.max_date;
    }
    finally {
      delete query.date;
    }
  }
  else if( query.date ) {
    try {
      query.since_date = Date.parse(query.date);
    }
    catch(err) {
      delete query.since_date;
    }
    finally {
      delete query.date;
    }
  }

  return query;
}

// Return help if requested
if(program.h) {
  optimist.showHelp(console.info);
  throw new Error(program.h);
}

// Run cache and print result or throw errors and close db connection
var options = formatCacheOptions();
cache(options)
  .then(console.log)
  .then(mongoose.connection.close)
  .done(process.exit);
