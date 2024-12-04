import moment from 'moment';

export default function (date, format, doUseRelativeTime) {
  if (date === null || date === undefined) {
    return 'N/A';
  }
  if (!(date instanceof Date)) {
    return date;
  }
  let formattedDate;

  let momentObj = moment(date);

  if (!momentObj.isValid()) {
    return 'N/A';
  }

  if (doUseRelativeTime) {
    formattedDate = momentObj.fromNow();
  } else {
    formattedDate = momentObj.format(format);
  }

  return formattedDate;
}
