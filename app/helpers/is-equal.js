import isEqual from 'lodash/isEqual';

export default function (leftSide, rightSide) {
  return isEqual(leftSide, rightSide);
}
