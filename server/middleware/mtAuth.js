const jwt = require('jsonwebtoken');
const axios = require('axios');

const { User } = require('../datasource/schemas/');

const { isValidMongoId} = require('../utils/mongoose');

const secret = process.env.MT_USER_JWT_SECRET;

const { getEncIssuerId, getMtIssuerId, getMtSsoUrl} = require('../middleware/appUrls');


const { accessCookie, refreshCookie, apiToken } = require('../constants/sso');

const getMtUser = async (req) => {
  try {
    let accessToken = req.cookies[accessCookie.name];

    if (accessToken === undefined) {
      return null;
    }

    // if token is not verified, error will be thrown
    let verifiedToken = await jwt.verify(accessToken, secret);

    return verifiedToken;

  }catch(err) {
    console.error(`Error getMtUser: ${err}`);
    return null;

  }

};

// used when communicating to MT SSO for forgot/reset password
const generateAnonApiToken = (expiration = apiToken.expiresIn) => {
  let payload = { iat: Date.now() };
  let options = { expiresIn: expiration, issuer: getEncIssuerId(), audience: getMtIssuerId() };

  return this.generateSignedJWT(payload, secret, options);
};

const requestNewAccessToken = async (refreshToken) => {
  let url = `${getMtSsoUrl()}/auth/accessToken`;
  let body = {refreshToken};

  let token = await generateAnonApiToken();
  let config = {
    headers: { Authorization: 'Bearer ' + token },
  };
  let results = await axios.post(url, body, config);
  return results.data;

};

const prepareMtUser = async (req, res, next) => {
  try {
    let verifiedSsoUserDetails = await getMtUser(req);
    // user is null or verified payload from jwt token
    // set on request for later user to retrieve encompass user record

    if (verifiedSsoUserDetails !== null) {
      req.mt.auth.user = verifiedSsoUserDetails;
      return next();
    }

    // check for refresh token and see
    let currentRefreshToken = req.cookies[refreshCookie.name];
    if (currentRefreshToken === undefined) {
      return next();
    }

    let { accessToken, refreshToken} = await requestNewAccessToken(currentRefreshToken);

    let verifiedAccessToken = await jwt.verify(accessToken, secret);
    req.mt.auth.user = verifiedAccessToken;

    this.setSsoCookie(res, accessToken);

    if (typeof refreshToken === 'string') {
      // only in case where refreshToken had expired and new one was issued
      this.setSsoRefreshCookie(res, refreshToken);
    }

    next();
  }catch(err) {
    console.log('err prepareMT: ', err);
    next(err);
  }


};

const prepareEncUser = (req, res, next) => {
  let mtUserDetails = req.mt.auth.user;

  if (mtUserDetails === undefined) {
    req.mt.auth.encUser = null;
    return next();
  }

  return User.findById(mtUserDetails.encUserId).exec()
  .then((user) => {
    if (user === null) {
      req.mt.auth.encUser = null;
      return next();
    }
    user.lastSeen = new Date();
    user.save();
    req.mt.auth.encUser = user.toObject();
    next();
  })
  .catch((err) => {
    next(err);
  });
};

const getEncUser = (mtUserDetails) => {
  if (mtUserDetails === null) {
    // token was not verified; no user authenticated
    return null;
  }
  let { encUserId } = mtUserDetails;

  if (isValidMongoId(encUserId)) {
    return User.findById(encUserId).lean().exec();
  }
  return null;

};

const extractBearerToken = req => {
  let { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    return;
  }
  return authorization.split(' ')[1];
};

const generateSignedJWT = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);

};

const setSsoCookie = (res, encodedToken) => {
  let doSetSecure =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  res.cookie(accessCookie.name, encodedToken, { httpOnly: true, maxAge: accessCookie.maxAge, secure: doSetSecure });
};

const setSsoRefreshCookie = (res, encodedToken) => {
  let doSetSecure =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  res.cookie(refreshCookie.name, encodedToken, { httpOnly: true,secure: doSetSecure, maxAge: refreshCookie.maxAge });

};

module.exports.getMtUser = getMtUser;
module.exports.prepareMtUser = prepareMtUser;
module.exports.getEncUser = getEncUser;
module.exports.prepareEncUser = prepareEncUser;
module.exports.extractBearerToken = extractBearerToken;
module.exports.generateSignedJWT = generateSignedJWT;
module.exports.setSsoCookie = setSsoCookie;
module.exports.setSsoRefreshCookie = setSsoRefreshCookie;
module.exports.generateAnonApiToken = generateAnonApiToken;