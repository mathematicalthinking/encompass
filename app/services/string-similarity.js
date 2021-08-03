/*global _:false */
import Service from '@ember/service';







export default Service.extend({
  compareTwoStrings(str1, str2) {
    if (!str1.length && !str2.length) { // if both are empty strings
      return 1;
    }
    if (!str1.length || !str2.length) { // if only one is empty string
      return 0;
    }
    if (str1.toUpperCase() === str2.toUpperCase()) { // identical
      return 1;
    }
    if (str1.length === 1 && str2.length === 1) { // both are 1-letter strings
      return 0;
    }

    const pairs1 = this.wordLetterPairs(str1);
    const pairs2 = this.wordLetterPairs(str2);
    const union = pairs1.length + pairs2.length;
    let intersection = 0;
    pairs1.forEach(pair1 => {
      //eslint-disable-next-line
      for (let i = 0, pair2; pair2 = pairs2[i]; i++) {
        if (pair1 !== pair2) {
          continue; //eslint-disable-line
        }
        intersection++;
        pairs2.splice(i, 1);
        break;
      }
    });
    return intersection * 2 / union;
  },

  findBestMatch(mainString, targetStrings) {
    if (!this.areArgsValid(mainString, targetStrings)) {
      throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
    }
    const ratings = targetStrings.map(target => ({ target, rating: this.compareTwoStrings(mainString, target) }));
    const bestMatch = Array.from(ratings).sort((a, b) => b.rating - a.rating)[0];
    return { ratings, bestMatch };
  },

  flattenDeep(arr) {
    return Array.isArray(arr) ? arr.reduce((a, b) => a.concat(this.flattenDeep(b)), []) : [arr];
  },

  areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== 'string') {
      return false;
    }
    if (!Array.isArray(targetStrings)) {
      return false;
    }
    if (!targetStrings.length) {
      return false;
    }
    if (targetStrings.find(s => typeof s !== 'string')) {
      return false;
    }
    return true;
  },

  letterPairs(str) {
    const pairs = [];
    for (let i = 0, max = str.length - 1; i < max; i++) {
      pairs[i] = str.substring(i, i + 2);
    }
    return pairs;
  },

  wordLetterPairs(str) {
    const pairs = str.toUpperCase().split(' ').map(this.letterPairs);
    return this.flattenDeep(pairs);
  },

  // trims, converts to lowercase, splits into words, removes any stopwords and then rejoins to string
  convertStringForCompare(str, stopwords) {
    if (!_.isString(str)) {
      return;
    }

    let lower = str.trim().toLowerCase();
    let tokens = lower.split(' ');

    if (_.isArray(stopwords)) {
      tokens = _.difference(tokens, stopwords);
    }

    return tokens.join('');
  }
});