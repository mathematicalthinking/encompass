import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function ([list, val]) {
  return list.includes(val);
});
