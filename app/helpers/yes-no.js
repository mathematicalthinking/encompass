import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [val] = args;

  if (val === true) {
    return 'Yes';
  }
  return 'No';
});