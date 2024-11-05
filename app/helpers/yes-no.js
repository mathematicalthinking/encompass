import { helper } from '@ember/component/helper';

export default helper(function ([val]) {
  return val === true ? 'Yes' : 'No';
});
