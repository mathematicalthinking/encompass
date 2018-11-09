Encompass.UtilityMethodsService = Ember.Service.extend({

  // return input string with first letter capitalized
  capitalizeWord(str) {
    if (!_.isString(str)) {
      // throw Error?
      return;
    }
    if (str.length === 0) {
      return '';
    }

    let firstLetterCap = str.charAt(0).toUpperCase();
    if (str.length === 1) {
      return firstLetterCap;
    }
    let slicedFrom1 = str.slice(1);
    return firstLetterCap + slicedFrom1;
  },

  // expects space separated string, e.g. alice Williams
  // return Alice W.
  getSafeName(str) {
    if (!_.isString(str)) {
      // throw error?
      return;
    }
    if (str.length === 0) {
      return '';
    }

    let split = str.split(' ');
    let firstName = this.capitalizeWord(split[0]);
    let lastName;

    if (!this.isNonEmptyString(split[1])) {
      return firstName;
    }
      let firstChar = split[1].charAt(0);
      lastName = this.capitalizeWord(firstChar);
    return `${firstName} ${lastName}.`;
  },

  capitalizeString(str) {
    if (!_.isString(str)) {
      // throw error?
      return;
    }
    if (str.length === 0) {
      return '';
    }

    let words = str.split(' ');

    let mapped = _.map(words, (word) => {
      return this.capitalizeWord(word);
    });
    return mapped.join(' ');
  },

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