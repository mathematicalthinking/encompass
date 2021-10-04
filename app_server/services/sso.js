const axios = require('axios');

const { getMtSsoUrl, getEncIssuerId, getMtIssuerId } = require('../middleware/appUrls');
const { apiToken } = require('../constants/sso');
const { signJwt } = require('../utils/jwt');

let secret;
if (process.env.NODE_ENV === 'seed') {
  secret = process.env.MT_USER_JWT_SECRET_TEST;
} else {
  secret = process.env.MT_USER_JWT_SECRET;
}
const BASE_URL = getMtSsoUrl();

const generateSsoApiToken = (reqUser) => {
  let payload = { iat: Date.now() };

  if (reqUser) {
    payload.ssoId = reqUser.ssoId;
  }
  let options = { expiresIn: apiToken.expiresIn, issuer: getEncIssuerId(), audience: getMtIssuerId() };

  return signJwt(payload, secret, options);
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

// details { username, password }
module.exports.login = (details) => {
  return this.post('/auth/login', details);
};

// used for both signups from signup form and also
// for logged in users creating new users from users page
module.exports.signup = (details, reqUser) => {
  return this.post('/auth/signup/enc', details, reqUser);
};

// details { email } or { username }
module.exports.forgotPassword = (details) => {
  return this.post('/auth/forgot/password', details);
};

module.exports.validateResetPasswordToken = (token) => {
  return this.get(`/auth/reset/password/${token}`);
};

// details { password } where password is new password
// user is not logged in when making the request
module.exports.resetPassword = (details, token) => {
  return this.post(`/auth/reset/password/${token}`, details);
};

// user must be logged in
// user can reset own password
// user can reset other user's password IF authorized
// admins or teachers/pdadmins for their students
module.exports.resetPasswordById = (details, reqUser) => {
  return this.post('/auth/reset/password/user', details, reqUser);
};
module.exports.requestNewAccessToken = (refreshToken) => {
  return this.post('/auth/accessToken', {refreshToken});
};

module.exports.confirmEmail = (token) => {
  return this.get(`/auth/confirmEmail/confirm/${token}`);
};

// user must be logged in to request new confirmEmail email
module.exports.resendConfirmEmail = (reqUser) => {
  return this.get('/auth/confirmEmail/resend', {}, reqUser);
};

module.exports.confirmEmailById = (ssoId, reqUser) => {
  return this.post(`/auth/confirmEmail/confirm/user`, { ssoId }, reqUser);
};
