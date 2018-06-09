const spawn = require('child_process').spawn;
const exec = require('child_process').exec 
const path = require('path');
const pathToBackup = path.resolve(__dirname, 'data/encompass_test');
const testDb = 'encompass_test';

const restoreDb = function(dbName, backupPath) {
  return new Promise(function (resolve, reject) {
    const args = ['--db', dbName, backupPath];
    const mongorestore = spawn('/usr/local/bin/mongorestore', args);
    mongorestore.stdout.on('data', function (data) {
      restoreOutput = data;
      console.log('stdout: ' + data);
    });

    mongorestore.on('error', function (err) {
        reject(err);
    });

    mongorestore.on('exit', function () { 
      resolve('Mongorestore completed succesfully: ');
    });
  });
};

// const dropDb = function() {
//   return new Promise(function (resolve, reject) {
//     const args = ['--db', testDb, pathToBackup];
//     const mongor = spawn('/usr/local/bin/mongorestore', args);

//     child.stdout.on('data', function (data) {
//       console.log('stdout: ' + data);
//     });

//     child.on('error', function (data) {
//         reject('Mongorestore errored');
//     });

//     child.on('exit', function () {
//         resolve('Mongorestore completed succesfully');
//     });
// });
// };
// const mongorestore = spawn('/usr/local/bin/mongorestore', args);

// mongorestore.stdout.on('data', function(data) {
//   console.log('stdout: ' + data);
// });

// mongorestore.stderr.on('data', function(data) {
//   console.log('stderr: ' + data);
// });

// mongorestore.on('exit', function (code) {
//   console.log('mongorestore exited with code ' + code);
// });

const dropTestdb = function() {
  return new Promise((resolve, reject) => {
    exec('npm run drop-testdb', (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      console.log('db drop results: ', stdout);
      //console.log('db drop errors: ', stderr);
      resolve('Dropped successfully');
    });
  });
}
// const restoreTestdb = function() {
//   return new Promise((resolve, reject) => {
//     exec('npm run restore-testdb', (err, stdout, stderr) => {
//       if (err) {
//         reject(err);
//       }
//       console.log('Testdb restore results: ', stdout);
//       resolve('Restored successfully');
//     });
//   });
// }

const prepTestDb = async function() {
  try {
    let dropped = await dropTestdb();
    console.log(dropped);
    
    let restored = await restoreDb(testDb, pathToBackup);
    console.log(restored);
  }catch(err) {
    console.log(err);
  }
};

module.exports.prepTestDb = prepTestDb;