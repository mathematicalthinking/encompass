import { helper } from '@ember/component/helper';

export default helper(function getAttr([obj, attr]) {
  return obj.get(attr);
});
