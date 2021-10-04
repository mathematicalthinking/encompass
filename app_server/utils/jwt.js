const jwt = require('jsonwebtoken');

module.exports.verifyJwt = (token, key, options) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, options || {}, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports.signJwt = (payload, secret, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options || {}, (err, encoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(encoded);
      }
    });
  });
};
