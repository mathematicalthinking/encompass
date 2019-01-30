/*global _:false */
Encompass.UtilityMethodsService = Ember.Service.extend({
  isNullOrUndefined(val) {
    return _.isNull(val) || _.isUndefined(val);
  },

  isNonEmptyArray(val) {
    return _.isArray(val) && !_.isEmpty(val);
  },

  isNonEmptyString(val) {
    return _.isString(val) && val.length > 0;
  },
  // not array or function
  isNonEmptyObject(val) {
  return _.isObject(val) && !_.isArray(val) && !_.isFunction(val) && !_.isEmpty(val);
},
isValidMongoId(val) {
  let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  return checkForHexRegExp.test(val);
},
getBelongsToId(record, relationshipName) {
  if (!this.isNonEmptyObject(record) || !this.isNonEmptyString(relationshipName)) {
    return null;
  }

  let hasEachRelationship = 'eachRelationship' in record;
  if (!hasEachRelationship) {
    return null;
  }

  let hasRequestedRelationship = false;

  record.eachRelationship((name, descriptor) => {
  if (name === relationshipName) {
    hasRequestedRelationship = true;
  }
});
  if (!hasRequestedRelationship) {
    return null;
  }

  let ref = record.belongsTo(relationshipName);

  if (ref) {
    return ref.id();
  }

  return null;
},
getHasManyIds(record, relationshipName) {
  if (!this.isNonEmptyObject(record) || !this.isNonEmptyString(relationshipName)) {
    return [];
  }
  let hasEachRelationship = 'eachRelationship' in record;
  if (!hasEachRelationship) {
    return [];
  }

  let hasRequestedRelationship = false;

  record.eachRelationship((name, descriptor) => {
  if (name === relationshipName) {
    hasRequestedRelationship = true;
  }
});
  if (!hasRequestedRelationship) {
    return [];
  }

  let ref = record.hasMany(relationshipName);
  if (ref) {
    return ref.ids();
  }
  return [];
}
});