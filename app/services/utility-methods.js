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
    return;
  }
  let ref = record.belongsTo(relationshipName);
  if (ref) {
    return ref.id();
  }
  return;
}
});