import _ from 'underscore';
import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function (args) {
  let [list, val] = args;
  return _.contains(list, val);
});
