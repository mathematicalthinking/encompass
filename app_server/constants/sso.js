module.exports = {
  accessCookie: {
    name: 'mt_sso_ac',
    maxAge: 86400000 // ms (1 day)
  },
  refreshCookie: {
    name: 'mt_sso_rf',
    maxAge: 2592000000 // ms (1 year)
  },
  apiToken: {
    expiresIn: '5m',
  }
};