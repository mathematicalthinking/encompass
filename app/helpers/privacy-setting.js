const PRIVACY_SETTINGS = {
  M: 'Just Me',
  O: 'My Organization',
  E: 'Everyone',
};

export default function (setting) {
  return PRIVACY_SETTINGS[setting] || 'Undefined';
}
