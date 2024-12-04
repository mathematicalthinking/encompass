const ACCOUNT_TYPES = {
  A: 'Admin',
  T: 'Teacher',
  S: 'Student',
  P: 'Pd Admin',
};

export default function (accountType) {
  return ACCOUNT_TYPES[accountType] || 'Undefined';
}
