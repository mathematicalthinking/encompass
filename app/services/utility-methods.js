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
  }
});