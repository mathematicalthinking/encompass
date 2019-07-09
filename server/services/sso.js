const axios = require('axios');
const jwt = require('jsonwebtoken');

const { getMtSsoUrl, getEncIssuerId, getMtIssuerId } = require('../middleware/appUrls');
const { apiToken } = require('../constants/sso');

const secret = process.env.MT_USER_JWT_SECRET;
const BASE_URL = getMtSsoUrl();

const generateAnonApiToken = (expiration = apiToken.expiresIn) => {
  let payload = { iat: Date.now() };
  let options = { expiresIn: expiration, issuer: getEncIssuerId(), audience: getMtIssuerId() };

  return jwt.sign(payload, secret, options);
};

module.exports.post = async (path, body) => {
  try {
    // encoded jwt which sso server will use to verify request came from
    // vmt or enc
    let token = await generateAnonApiToken();
    let config = {
      headers: { Authorization: 'Bearer ' + token },
    };

    let results = await axios.post(`${BASE_URL}${path}`, body, config);

    return results.data;

  }catch(err) {
    throw (err);
  }
};

module.exports.get = async (path, params = {}) => {
  try {
    // encoded jwt which sso server will use to verify request came from
    // vmt or enc
    let token = await generateAnonApiToken();
    let headers =
    { Authorization: 'Bearer ' + token };

    let config = { params, headers};

    let results = await axios.get(`${BASE_URL}${path}`, config);

    return results.data;

  }catch(err) {
    throw (err);
  }
};

module.exports.login = (details) => {
  return this.post('/auth/login', details);
};

module.exports.signup = (details) => {
  return this.post('/auth/signup/enc', details);
};

module.exports.forgotPassword = (details) => {
  return this.post('/auth/forgot/password', details);
};

module.exports.validateResetPasswordToken = (token) => {
  return this.get(`/auth/reset/password/${token}`);
};

module.exports.resetPassword = (details, token) => {
  return this.post(`/auth/reset/password/${token}`, details);
};

module.exports.resetPasswordById = (details) => {
  return this.post('/auth/reset/password/user', details);
};
module.exports.requestNewAccessToken = (refreshToken) => {
  return this.post('/auth/accessToken', {refreshToken});
};