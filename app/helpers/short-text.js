// Get an abbreviated version of the given text.
// app/helpers/short-text.js

import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (text) {
  // Why does the template pass the text string in an array?
  return text[0].substring(0, 100);
});
