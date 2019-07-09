const jwt = require('jsonwebtoken');

module.exports.verifyJWT = (
  token,
  key,
  options,
) =>{
  return new Promise(
    (resolve, reject) => {
      jwt.verify(
        token,
        key,
        options || {},
        (err, decoded)=> {
          if (err) {
            resolve([err, null]);
          } else {
            resolve([null, decoded]);
          }
        },
      );
    },
  );
};