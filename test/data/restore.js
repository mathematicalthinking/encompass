const exec = require('child_process').exec;

let commands = {
  enc: 'npm run seed',
  vmt: 'npm run restore-vmt',
  mt: 'npm run restore-mt'
};

const dropAndRestoreDb = function(app) {
  return new Promise((resolve, reject) => {
    let command = commands[app];
    if (command === undefined) {
      return reject('Invalid app name');
    }
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log('ERROR FROM RESTORE: ', err);
        reject(err);
      }
      console.log('db drop results: ', stdout);
      resolve(`Dropped ${app} database successfully!`);
    });
  });
};

const prepTestDb = function() {
  try {
    return Promise.all([
      dropAndRestoreDb('enc'),
      dropAndRestoreDb('mt'),
      dropAndRestoreDb('vmt')
    ]);
  } catch (err) {
    throw(err);
  }
};

module.exports.prepTestDb = prepTestDb;
