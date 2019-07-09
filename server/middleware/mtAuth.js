const { User } = require('../datasource/schemas/');
const { isValidMongoId} = require('../utils/mongoose');
const ssoService = require('../services/sso');
const { accessCookie, refreshCookie,} = require('../constants/sso');
const { verifyJWT } = require('../utils/jwt');

const secret = process.env.MT_USER_JWT_SECRET;

const setSsoCookie = (res, encodedToken) => {
  let doSetSecure =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  res.cookie(accessCookie.name, encodedToken, { httpOnly: true, maxAge: accessCookie.maxAge, secure: doSetSecure });
};

const setSsoRefreshCookie = (res, encodedToken) => {
  let doSetSecure =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

  res.cookie(refreshCookie.name, encodedToken, { httpOnly: true,secure: doSetSecure,});

};

const clearAccessCookie = (res) => {
  res.cookie(accessCookie.name, '', {httpOnly: true, maxAge: 0});
};

const clearRefreshCookie = (res) => {
  res.cookie(refreshCookie.name, '', {httpOnly: true, maxAge: 0});

};

const resolveAccessToken = async (token) => {
  if (typeof token !== 'string') {
    return null;
  }

  let [accessTokenErr, verifiedAccessToken] = await verifyJWT(token, secret);

  return verifiedAccessToken;

};

const getMtUser = async (req, res) => {
  try {
    console.log('getmt user');
    let verifiedAccessToken = await resolveAccessToken(req.cookies[accessCookie.name]);
    let accessTokenErr;

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

    [ accessTokenErr, verifiedAccessToken] = await verifyJWT(accessToken, secret);

    if (accessTokenErr) {
      // should never happen
      return null;
    }

    console.log('received new access token: ', verifiedAccessToken);

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

    clearAccessCookie(res);
    clearRefreshCookie(res);

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
