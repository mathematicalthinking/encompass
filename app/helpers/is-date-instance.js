import { helper } from '@ember/component/helper';

export default helper(function isDateInstance([obj]) {
  return obj instanceof Date;
});
