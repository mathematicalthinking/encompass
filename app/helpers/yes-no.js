import { helper } from '@ember/helper';

export default helper(function ([val]) {
  return val === true ? 'Yes' : 'No';
});
