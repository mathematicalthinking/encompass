import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [base, numberToAdd] = args;
  return base + numberToAdd;
});