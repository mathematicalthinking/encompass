import isEqual from 'lodash-es/isEqual';

export default function (leftSide, rightSide) {
  return !isEqual(leftSide, rightSide);
}
