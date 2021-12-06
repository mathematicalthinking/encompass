import { helper } from '@ember/component/helper';

export default helper(function getAttr([obj, attr]) {
  try {
    return obj.get(attr);
  } catch (err) {
    const path = attr.split('.');
    if (path.length > 1) {
      const value = obj[path[0]].get(path[1]);
      return value;
    }
    return obj[path[0]];
  }
});
