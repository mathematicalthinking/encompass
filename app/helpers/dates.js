import { helper as buildHelper } from '@ember/component/helper';
import moment from 'moment';






export default buildHelper(function (date, format) {
  return moment(date).format(format);
});
