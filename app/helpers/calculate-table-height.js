import { helper } from '@ember/component/helper';

export default helper(function calculateTableHeight(args) {
  let [amount] = args;
  return amount * 31 + 'px';
});
