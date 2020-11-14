const { User } = require('../datasource/schemas/');
const { isValidMongoId} = require('../utils/mongoose');
const ssoService = require('../services/sso');
const { accessCookie, refreshCookie,} = require('../constants/sso');
const { verifyJwt } = require('../utils/jwt');

let secret;

if (process.env.NODE_ENV === 'seed') {
  secret = process.env.MT_USER_JWT_SECRET_TEST;
} else {
  secret = process.env.MT_USER_JWT_SECRET;
}

const setSsoCookie = (res, encodedToken) => {
  let doSetSecure =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  let options = { httpOnly: true, maxAge: accessCookie.maxAge, secure: doSetSecure };

  if (doSetSecure) {
    options.domain = process.env.SSO_COOKIE_DOMAIN;
  }

  res.cookie(accessCookie.name, encodedToken, options);};

const setSsoRefreshCookie = (res, encodedToken) => {
  let doSetSecure =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  let options = { httpOnly: true, secure: doSetSecure };
  if (doSetSecure) {
    options.domain = process.env.SSO_COOKIE_DOMAIN;
  }

  res.cookie(refreshCookie.name, encodedToken, options);

};

const clearAccessCookie = (res) => {
  let isSecure = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
  let domain = isSecure ? process.env.SSO_COOKIE_DOMAIN : 'localhost';

  let options = { domain, httpOnly: true, secure: isSecure };

  res.clearCookie(accessCookie.name, options);

};

const clearRefreshCookie = (res) => {
  let isSecure = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
  let domain = isSecure ? process.env.SSO_COOKIE_DOMAIN : 'localhost';

  let options = { domain, httpOnly: true, secure: isSecure };
  res.clearCookie(refreshCookie.name, options);

};

const resolveAccessToken = async (token) => {
  try {
    if (typeof token !== 'string') {
      return null;
    }
    let verifiedToken = await verifyJwt(token, secret);

    return verifiedToken;
  }catch(err) {
    // invalid access token
    return null;
  }
};

const getMtUser = async (req, res) => {
  try {
    let verifiedAccessToken = await resolveAccessToken(req.cookies[accessCookie.name]);

    if (verifiedAccessToken !== null) {
      return verifiedAccessToken;
    }
    // access token verification failed request new access token with refresh token

    let currentRefreshToken = req.cookies[refreshCookie.name];

    if (currentRefreshToken === undefined) {
      return null;
    }

    // request new accessToken with refreshToken
    let { accessToken } = await ssoService.requestNewAccessToken(currentRefreshToken);

    verifiedAccessToken = await verifyJwt(accessToken, secret);

    setSsoCookie(res, accessToken);
    return verifiedAccessToken;

  }catch(err) {
    console.error(`Error getMtUser: ${err}`);
    return null;
  }
};

const prepareMtUser = async (req, res, next) => {
  try {
    let verifiedSsoUserDetails = await getMtUser(req, res);
    // user is null or verified payload from jwt token
    // set on request for later user to retrieve encompass user record

    if (verifiedSsoUserDetails !== null) {
      req.mt.auth.user = verifiedSsoUserDetails;
      return next();
    }
    // clear any invalid cookies
    if (req.cookies[accessCookie.name]) {
      clearAccessCookie(res);
    }

    if (req.cookies[refreshCookie.name]) {
    clearRefreshCookie(res);
    }

    next();
  }catch(err) {
    console.log('err prepareMtUSer: ', err);
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


module.exports.getMtUser = getMtUser;
module.exports.prepareMtUser = prepareMtUser;
module.exports.getEncUser = getEncUser;
module.exports.prepareEncUser = prepareEncUser;
module.exports.extractBearerToken = extractBearerToken;
module.exports.setSsoCookie = setSsoCookie;
module.exports.setSsoRefreshCookie = setSsoRefreshCookie;
module.exports.clearAccessCookie = clearAccessCookie;
module.exports.clearRefreshCookie = clearRefreshCookie;
