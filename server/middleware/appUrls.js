const getMtSsoUrl = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.MT_SSO_URL_PROD;
  }

  if (envName === 'staging') {
    return process.env.MT_SSO_URL_STAGING;
  }

  if (envName === 'seed') {
    return process.env.MT_SSO_URL_TEST;
  }
  return process.env.MT_SSO_URL_DEV;
};

const getVmtUrl = () => {
  let envName = process.env.NODE_ENV;

  if (envName === 'production') {
    return process.env.VMT_URL_PROD;
  }

  if (envName === 'staging') {
    return process.env.VMT_URL_STAGING;
  }
  return process.env.VMT_URL_DEV;
};

module.exports.getMtSsoUrl = getMtSsoUrl;
module.exports.getVmtUrl = getVmtUrl;
