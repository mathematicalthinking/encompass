// not currently used, but seems very useful for debugging.
import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function (optionalValue) {
  console.log('Current Context');
  console.log('====================');
  console.log(this);

  if (optionalValue) {
    console.log('Value');
    console.log('====================');
    console.log(optionalValue);
  }
});
