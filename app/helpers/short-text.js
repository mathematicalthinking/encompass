// Get an abbreviated version of the given text.
// app/helpers/short-text.js

Encompass.ShortTextHelper = Ember.Helper.helper( function( text ){
  // Why does the template pass the text string in an array?
  return text[0].substring(0,100);
});
