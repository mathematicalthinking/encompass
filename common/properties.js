/**
 * # Properties Module
 * @description access properties for the variety of javascript objects we deal with: standard javascript, ember, mongoose
 * @authors Amir Tahvildaran <amir@mathforum.org>
 * @since 1.0.1
 *
 */
var _ = require('underscore');

module.exports = {
  resolveOwner: function(object) {
    return this.resolveProperty('owner', object);
  },
  resolveEditors: function(object) {
    return this.resolveProperty('editors', object);
  },

  // returns value of field if on object
  // else throws error if hard is truthy
  // else only warns if hard is falsy
  resolveProperty: function(field, object, hard) {
    // should this throw an error?
    if(!field || !object) {
      return;
    }
    // if there is a get function, get the username from there
    if(_.isFunction(object.get)) {
      return object.get(field);
    }
    // sometimes the object has a property but it's undefined (Ember) so we check .get first
    if(_.has(object, field)) {
      return object[field];
    }
    if(hard) {
      console.error(object);
      throw "alleged object is neither string, object with field key, nor array thereof";
    } else {
      console.warn("alleged object is neither string, object with field key, nor array thereof" + object);
    }
  },

  // returns single username if user is a string
  // returns array of usernames if user is ember
  // array or array
  resolveUsername: function(user) {
    // error handling?
    if(!user) {
      return;
    }

    // if the username is just a string, use that
    if(_.isString(user)) {
      return user;
    }
    // if we got an ember array that isLoaded
    // ember arrays have toArray method which
    // converts the enumerable into a genuine array
    if(_.has(user, 'content') && (user.isLoaded || user.isFulfilled)) {
      return this.resolveUsername('content._internalModel._data.username');
    }
    // if we got a list, send it back resolved

    if(_.isArray(user)) {
      return _.map(user, this.resolveUsername, this);
    }
    return this.resolveProperty('username', user);
  }
}
