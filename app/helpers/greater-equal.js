import { helper as buildHelper } from '@ember/component/helper';






export default buildHelper(function (args) {
  let [leftSide, rightSide] = args;
  return leftSide >= rightSide;
});
