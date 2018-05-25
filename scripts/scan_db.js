load("./scripts/settings.js");
print("Beginning Sanity Check...");

var DB_COLLECTIONS = db.getCollectionNames();

var errors = {count: 0};
var ERROR = { // We use str.replace as a node util.format workaround
  MISSING_COLLECTION: "Collection %s does not exist",
  BROKEN_RELATIONSHIP: "%s(origin) %s(id) has %s(broken) broken %s(endpoint) relationships out of %s(total)"
}

for(var i=0; i < RELATIONSHIPS.length; i++) {
  var rel = RELATIONSHIPS[i];
  var key = JSON.stringify(rel.objects);
  errors[key] = [];

  for(var origin in rel.objects) {
    var endpoint = rel.objects[origin];

    if ( DB_COLLECTIONS.indexOf(origin) === -1 ) {
      var message = ERROR.MISSING_COLLECTION.replace('%s', origin);
      errors[key].push(new Error(message));
    }

    if( DB_COLLECTIONS.indexOf(endpoint) === -1 ) {
      var message = ERROR.MISSING_COLLECTION.replace('%s', endpoint);
      errors[key].push(new Error(message));
    }

    var origCollection = db.getCollection(origin);
    var endCollection = db.getCollection(endpoint);

    var iterator = origCollection.find();
    var origField = rel.fields.origin;
    var endField = rel.fields.endpoint;

    print("Checking " + origin + " <-> " + endpoint + " relationship..." );
    
    while( iterator.hasNext() ) {
      var query = {};
      var source = iterator.next();
      var numRelated, numSaved, numBroken, numIntact;
      var idFormat = new RegExp('ObjectId|\\"|\\(|\\)', 'g');

      query[origField] = source._id;
      query.isTrashed = {$ne: true};

      if(source) {
        var related = endCollection.find(query, {_id: 1});
        var relatedIds = related.toArray().map(function(obj) { return obj._id.toString().replace(idFormat, ''); }); // Cast to string to enable indexOf comparison
        var hasRelationship = source.hasOwnProperty(endField);
        numRelated = related.count();

        if(hasRelationship) {
          var sourceIds = source[endField].map(function(id) { return id.toString().replace(idFormat, '');; }); // Cast to string to enable indexOf comparison
          numSaved = sourceIds.length;
          numBroken = Math.abs((numSaved - numRelated));
          numIntact = Math.max(numSaved, numRelated) - numBroken;
          var allRelated = (numRelated === numSaved);

        
          if(!allRelated) {
            var brokenAtSource = relatedIds.filter(function(id) { return sourceIds.indexOf(id) < 0; });
            var brokenAtTarget = sourceIds.filter(function(id) { return relatedIds.indexOf(id) < 0; });
            var message = ERROR.BROKEN_RELATIONSHIP.replace('%s(origin)', origin);
                message = message.replace('%s(id)', source._id);
                message = message.replace('%s(broken)', numBroken);
                message = message.replace('%s(total)', numBroken+numIntact);
                message = message.replace('%s(endpoint)', endpoint);

            var details = { error: new Error(message) };
            
            if(brokenAtSource.length) { 
              details["missing_" + rel.fields.endpoint] = {count: brokenAtSource.length, ids: brokenAtSource.join(" ")};
            }

            if(brokenAtTarget.length) {
              details["missing_" + rel.fields.origin] = {count: brokenAtTarget.length, ids: brokenAtTarget.join(" ")};
            }

            errors[key].push(details);
          }
        }
      }
    }
  }

  if(errors[key].length > 0) {
    errors.count += errors[key].length;
    printjson(errors[key]);
    print(errors[key].length + " " + origin + " <-> " + endpoint + " errors.");
    print("\n");
  } 
}

print("Total errors: " + errors.count);
quit();
