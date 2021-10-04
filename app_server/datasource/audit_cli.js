/*
  * # The Auditor
  * @description This is a tool for manually fixing data in our mongo database
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */

const optimist = require('optimist');
const _        = require('underscore');
const util     = require('util');
const fs       = require('fs');
const mongo    = require('mongodb');
const bson     = mongo.BSONPure;

/** ## CLI Options
  * We use [Optimist](https://github.com/substack/node-optimist) to make our command line interface
  */

var program = optimist.options({
  h: {
    describe: "Help. You're looking at it.",
    type: 'boolean'
  },
  host: {
    describe: "Database host",
    type: 'string',
    'default': "localhost",
  },
  port: {
    describe: "Connection port",
    alias: ['p'],
    type: 'number',
    'default': 27017,
  },
  database: {
    describe: "The database name",
    alias: ['db'],
    type:'string',
    'default': "encompass",
  },
  collection: {
    describe: "The collection to update",
    alias: ['c'],
    type: 'string',
    demand: true,
  },
  find: {
    describe: "The search criteria (use dot.notation)",
    alias: ['f'],
    type: 'string',
    demand: true,
  },
  search: {
    describe: "Flag to process non-hyphenated options as part of find instead of update",
    alias: ['s'],
    'boolean': true,
    'default': false
  },
  update: {
    describe: "Update command to run (use dot.notation)",
    alias: ['u'],
    demand: true,
  },
  multi: {
    describe: "Update all matching documents?",
    alias: ['m'],
    'boolean': true,
    'default': false
  },
})
.usage("\nCache accepts a source file or url path from which to retrieve JSON submission data and saves this to the database.\n" +
  "It may also compose this request itself given other parameters. Use the --pd option to save retrieved submissions to\n" +
  "a PD set for future use.\n\n" +
  "Usage: node cache [options] {file or url}").argv;


/*
 * @method formatAuditOptions
 * @description Converts our accepted command line arguments to allowed audit options
 * @returns {Object} A cache options object
 */
function formatAuditOptions() {
  // Clone arguments to this script
  var query = JSON.parse( JSON.stringify(program) );
  query.errors = [];

  var urlFormat = 'mongodb://%s:%d/%s';
  var cmdFormat = '$%s';

  var upCommands = [
    "inc",
    "set",
    "unset",
    "push",
    "addToSet",
    "pull",
  ];

  var allowMultiple = [
    "push",
    "pull",
    "addToSet",
  ];

  if(!(_.isObject(query.find) && _.isObject(query.update))) {
    query.errors.push(new Error('You must use dot notation to specify find and update criteria e.g find._id 123'));
  }

  if(!_.any(upCommands, function(cmd) { return query.update.hasOwnProperty(cmd); })) {
    query.errors.push(new Error('That update command is not supported'));
  }

  var additionalIds = query._;
  var toObjectId = function(value, index, arr) {
    if(bson.ObjectID.isValid(value)) {
      arr[index] = new bson.ObjectID(value);
    }
  };

  //Massage and verify params
  for(var select in query.find) {
    if( query.find.hasOwnProperty(select) ) {
      var fieldValues = additionalIds.concat(query.find[select]);

      fieldValues.forEach(toObjectId);

      if((fieldValues.length > 1) && query.search) {
        query.find[select] = {$in: fieldValues};
      } else {
        query.find[select] = fieldValues.slice(-1)[0];
      }
    }
  }

  for(var cmd in query.update) {
    if( query.update.hasOwnProperty(cmd) ) {
      for(var target in query.update[cmd]) {
        if( query.update[cmd].hasOwnProperty(target) ) {
          var targetValues = additionalIds.concat(query.update[cmd][target]);

          targetValues.forEach(toObjectId);

          if((targetValues.length > 1) && (allowMultiple.indexOf(cmd) > -1) && !query.search) {
            query.update[cmd][target] = {$each: targetValues};
          } else {
            query.update[cmd][target] = targetValues.slice(-1)[0];
          }
        }
      }

      query.update[util.format(cmdFormat, cmd)] = query.update[cmd];
      delete (query.update[cmd]);
    }
  }

  //Set mongo url
  query.url = util.format(urlFormat, query.host, query.port, query.database);

  return query;
}

// Return help if requested
if(program.h) {
  optimist.showHelp(console.info);
  throw new Error(program.h);
}

// Parse options
var options = formatAuditOptions();

if(options.errors.length) {
  console.error(options.errors);
  throw new Error(options.errors);
}

mongo.connect(options.url, function(err, db) {
  if(err) {
    console.error(err);
  }

  var collection = db.collection(options.collection);
  var noteFormat = '%s: db.%s.update(%s, %s, {multi: %s}); affected %d\n';

  collection.update(options.find, options.update, {multi: options.multi, w: 1}, function(err, affected) {
    if(err) {
      console.log(err);
    }

    var note = util.format(noteFormat, (new Date()).toDateString(), options.collection, JSON.stringify(options.find), JSON.stringify(options.update), options.multi, affected);
    if(affected > 0) {
      fs.appendFile('audit.log', note, function(err) {
        if(err) {
          console.log(err);
        }

        console.log('Audited');
      });
    } else {
      console.log('Audit Failed. Please check your parameters');
      console.log(note);
    }

    db.close();
  });
});
