import { helper as buildHelper } from '@ember/component/helper';
import isEqual from 'lodash/isEqual';

export default buildHelper(function ([leftSide, rightSide]) {
  return isEqual(leftSide, rightSide);
});
