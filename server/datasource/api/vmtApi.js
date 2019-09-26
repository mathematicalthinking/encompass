/**
  * # VMT API
  * @description This is the API for vmt based requests
  * @author Daniel Kelly
*/

//REQUIRE MODULES
const _ = require('underscore');
const axios = require('axios');

//REQUIRE FILES
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const { signJwt } = require('../../utils/jwt');
const { getEncIssuerId, getVmtIssuerId } = require('../../middleware/appUrls');
const { accessCookie, refreshCookie } = require('../../constants/sso');

// const objectUtils = require('../../utils/objects');
// const { isNonEmptyArray, } = objectUtils;
// const accessUtils = require('../../middleware/access/utils');

let secret;
if (process.env.NODE_ENV === 'seed') {
  secret = process.env.MT_USER_JWT_SECRET_TEST;
} else {
  secret = process.env.MT_USER_JWT_SECRET;
}


module.exports.get = {};
module.exports.post = {};
module.exports.put = {};


function getVmtUrl() {
  let nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    return process.env.VMT_URL_PROD;
  }

  if (nodeEnv === 'staging') {
    return process.env.VMT_URL_STAGING;
  }
  return 'http://localhost:3001';
}

const generateVmtToken = (user) => {
let payload = {
  ssoId: user.ssoId,
  encUserId: user._id,
  vmtUserId: user.vmtUserId
};
let options = {
  expiresIn: '5m',
  issuer: getEncIssuerId(),
  audience: getVmtIssuerId(),
  subject: 'room',
};

return signJwt(payload, secret, options);
};
const getVmtRoom = async (req, res, next) => {
  try {
    let user = userAuth.requireUser(req);
    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in', res);
    }

    let mtAccessCookie = req.cookies[accessCookie.name];
    let mtRefreshCookie = req.cookies[refreshCookie.name];
    let roomId = req.params.id;
    // let accessibleWorkspaceIds = await accessUtils.getAccessibleWorkspaceIds(user, {vmtRoomIds: roomId });

    // // no accessible workspace associated with requested vmt room
    // if (!isNonEmptyArray(accessibleWorkspaceIds)) {
    //   return utils.sendResponse(res, null);
    // }

    let vmtToken = await generateVmtToken(user);


    let url = `${getVmtUrl()}/api/rooms/${roomId}/populated?events=true`;

    let headers = {
      Authorization: `Bearer ${vmtToken}`,
      Cookie: `${accessCookie.name}=${mtAccessCookie}; ${refreshCookie.name}=${mtRefreshCookie};`
    };
    let result = await axios.get(url, {headers});

    let room = _.propertyOf(result)(['data', 'result']);

    if (!room) {
      return utils.sendResponse(res, null);
    }
    let data = { room };
    return utils.sendResponse(res, data);

  }catch(err) {
    console.error(`Error getVmtRoom: ${err}`);
    return utils.sendError.InternalError(null, res);
  }

};


module.exports.get.vmtRoom = getVmtRoom;
