const axios = require('axios');
const { getMtSsoUrl } = require('../middleware/appUrls');
const { generateAnonApiToken } = require('../middleware/mtAuth');

const BASE_URL = getMtSsoUrl();

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
