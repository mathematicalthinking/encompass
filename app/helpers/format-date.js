import { helper as buildHelper } from '@ember/component/helper';
import * as dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export default buildHelper(function (args) {
  // args is array of arguments passed in from template
  let [date, format, doUseRelativeTime] = args;
  if (date === null || date === undefined) {
    return 'N/A';
  }
  if (!(date instanceof Date)) {
    return date;
  }
  let formattedDate;

  let momentObj = dayjs(date);

  if (!momentObj.isValid()) {
    return 'N/A';
  }

  if (doUseRelativeTime) {
    formattedDate = momentObj.fromNow();
  } else {
    formattedDate = momentObj.format(format);
  }

  return formattedDate;
});
