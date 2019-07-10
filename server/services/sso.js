const axios = require('axios');
const jwt = require('jsonwebtoken');

const { getMtSsoUrl, getEncIssuerId, getMtIssuerId } = require('../middleware/appUrls');
const { apiToken } = require('../constants/sso');

const secret = process.env.MT_USER_JWT_SECRET;
const BASE_URL = getMtSsoUrl();

const generateSsoApiToken = (reqUser) => {
  let payload = { iat: Date.now() };

  if (reqUser) {
    payload.ssoId = reqUser.ssoId;
  }
  let options = { expiresIn: apiToken.expiresIn, issuer: getEncIssuerId(), audience: getMtIssuerId() };

  return jwt.sign(payload, secret, options);
};
module.exports.post = async (path, body, reqUser) => {
  try {
    // encoded jwt which sso server will use to verify request came from
    // vmt or enc
    let token = await generateSsoApiToken(reqUser);
    let config = {
      headers: { Authorization: 'Bearer ' + token },
      withCredentials: true
    };

    let results = await axios.post(`${BASE_URL}${path}`, body, config);

    return results.data;

  }catch(err) {
    throw (err);
  }
};

module.exports.get = async (path, params = {}, reqUser) => {
  try {
    // encoded jwt which sso server will use to verify request came from
    // vmt or enc
    let token = await generateSsoApiToken(reqUser);
    let headers =
    { Authorization: 'Bearer ' + token };

    let config = { params, headers, withCredentials: true};

    let results = await axios.get(`${BASE_URL}${path}`, config);

    return results.data;

  }catch(err) {
    throw (err);
  }
};

module.exports.login = (details) => {
  return this.post('/auth/login', details);
};

module.exports.signup = (details, reqUser) => {
  return this.post('/auth/signup/enc', details, reqUser);
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

module.exports.resetPasswordById = (details, reqUser) => {
  return this.post('/auth/reset/password/user', details, reqUser);
};
module.exports.requestNewAccessToken = (refreshToken) => {
  return this.post('/auth/accessToken', {refreshToken});
};

module.exports.confirmEmail = (token) => {
  return this.get(`/auth/confirmEmail/confirm/${token}`);
};

module.exports.resendConfirmEmail = (reqUser) => {
  return this.get('/auth/confirmEmail/resend', {}, reqUser);
};