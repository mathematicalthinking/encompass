const jwt = require('jsonwebtoken');


const { User } = require('../datasource/schemas/');

const { isValidMongoId} = require('../utils/mongoose');

const secret = process.env.MT_USER_JWT_SECRET;

const getMtUser = async (req) => {
  try {
    let mtToken = req.cookies.mtToken;

    if (!mtToken) {
      return null;
    }

    // if token is not verified, error will be thrown
    let verifiedToken = await jwt.verify(mtToken, secret);

    return verifiedToken;

  }catch(err) {
    console.error(`Error getMtUser: ${err}`);
    return null;

  }

};

const prepareMtUser = (req, res, next) => {
  return getMtUser(req)
  .then((user) => {
    // user is null or verified payload from jwt token
    // set on request for later user to retrieve encompass user record
    req.mt.auth.user = user;
    next();
  })
  .catch((err) => {
    console.log('pmt error', err);
  });
};

const prepareEncUser = (req, res, next) => {
  let mtUserDetails = req.mt.auth.user;

  if (mtUserDetails === null) {
    req.mt.auth.encUser = null;
    return next();
  }

  return User.findById(mtUserDetails.encUserId).exec()
  .then((user) => {
    user.lastSeen = new Date();
    user.save();
    req.mt.auth.encUser = user.toObject();
    next();
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

module.exports.extractBearerToken = req => {
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