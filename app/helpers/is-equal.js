// is-equal helper is necessary to determine which option is currently selected.
// app/helpers/is-equal.js
/*global _:false */
import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [leftSide, rightSide] = args;
  return _.isEqual(leftSide, rightSide);
});
