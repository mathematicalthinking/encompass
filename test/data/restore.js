const exec = require('child_process').exec;

const dropAndRestoreDb = function () {
  return new Promise((resolve, reject) => {
    exec(`md-seed run --dropdb`, (err, stdout, stderr) => {
      if (err) {
        console.log("ERROR FROM RESTORE: ", err);
        reject(err);
      }
      console.log('db drop results: ', stdout);
      //console.log('db drop errors: ', stderr);
      resolve('Dropped encompass_test database successfully!');
    });
  });
};

const prepTestDb = async function () {
  try {
    //let restored = await restoreDb(testDb, pathToBackup);
    let restored = await dropAndRestoreDb();
    console.log(restored);
  } catch (err) {
    console.log(err);
  }
};

module.exports.prepTestDb = prepTestDb;
