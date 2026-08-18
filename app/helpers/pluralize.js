export default function (number, singular, plural) {
  if (number === 1) {
    return singular;
  } else {
    return typeof plural === 'string' ? plural : singular + 's';
  }
}
