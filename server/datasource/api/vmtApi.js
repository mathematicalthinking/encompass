/**
  * # VMT API
  * @description This is the API for vmt based requests
  * @author Daniel Kelly
*/

//REQUIRE MODULES
const _ = require('underscore');
const axios = require('axios');
const bcrypt = require('bcrypt');

//REQUIRE FILES
// const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');

// const objectUtils = require('../../utils/objects');
// const { isNonEmptyArray, } = objectUtils;
// const accessUtils = require('../../middleware/access/utils');

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

function getVmtSecret() {
  let nodeEnv = process.env.NODE_ENV;

  if (nodeEnv === 'production') {
    return process.env.VMT_ENC_SECRET_PROD;
  }

  if (nodeEnv === 'staging') {
    return process.env.VMT_ENC_SECRET_STAGING;
  }
  return process.env.VMT_ENC_SECRET_DEV;
}

const getVmtRoom = async (req, res, next) => {
  try {
    // let user = userAuth.requireUser(req);
    let roomId = req.params.id;
    // let accessibleWorkspaceIds = await accessUtils.getAccessibleWorkspaceIds(user, {vmtRoomIds: roomId });

    // // no accessible workspace associated with requested vmt room
    // if (!isNonEmptyArray(accessibleWorkspaceIds)) {
    //   return utils.sendResponse(res, null);
    // }

    let secret = getVmtSecret();
    const SALT_ROUNDS = 12;
    let hash = await bcrypt.hash(secret, SALT_ROUNDS);

    let url = `${getVmtUrl()}/api/rooms/${roomId}/populated?events=true`;
    let headers = {
      'Authorization': hash
    };
    let result = await axios.get(url, {headers});

    let room = _.propertyOf(result)(['data', 'result']);
    if (!room) {
      return utils.sendResponse(res, null);
    }
    let data = { 'room': room };
    return utils.sendResponse(res, data);

  }catch(err) {
    console.error(`Error getVmtRoom: ${err}`);
    return utils.sendError.InternalError(null, res);
  }

};


module.exports.get.vmtRoom = getVmtRoom;
