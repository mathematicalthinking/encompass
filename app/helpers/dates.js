import { helper as buildHelper } from '@ember/component/helper';
import * as dayjs from 'dayjs';

export default buildHelper(function (date, format) {
  return dayjs(date).format(format);
});
