import { format, isValid } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';

const FORMAT_ALIASES = {
  'MMMM Do YYYY': 'MMMM do yyyy',
  'MMM Do YYYY hh:mm A': 'MMM do yyyy hh:mm a',
  'MMM Do YYYY': 'MMM do yyyy',
  'MMMM Do, YYYY': 'MMMM do, yyyy',
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'MM/DD/YY': 'MM/dd/yy',
  'h:mm A': 'hh:mm a',
  L: 'P',
  'Do MMM YYYY': 'do MMM yyyy',
  'l h:mm a': 'P h:mm a',
  'MM-D-YYYY @h:mm A': 'MM-d-yyyy @h:mm a',
  'MM-DD-YYYY @h:mm A': 'MM-dd-yyyy @h:mm a',
};

export default function formatDate(
  date,
  fmt = 'PPP',
  doUseRelativeTime = false
) {
  if (date === null || date === undefined) return 'N/A';
  if (!(date instanceof Date)) return date;
  if (!isValid(date)) return 'N/A';

  const resolvedFormat = FORMAT_ALIASES[fmt] || fmt;

  if (doUseRelativeTime) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  try {
    return format(date, resolvedFormat);
  } catch {
    return date.toLocaleString();
  }
}
