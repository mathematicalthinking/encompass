const mongoose = require('mongoose');
const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/encompass');

async function convertToFirstNameLastName() {
  try {
    let users = await models.User.find({}).exec();
    let updatedActingRoleCount = 0;

    let updatedUsers = users.map((user) => {
      let name = user.name;

      let actingRole = user.actingRole;

      if (actingRole !== 'student' && actingRole !== 'teacher') {
        user.actingRole = user.accountType === 'S' ? 'student' : 'teacher';
        updatedActingRoleCount++;
      }

      if (typeof name !== 'string' || name.trim().length === 0) {
        user.firstName = undefined;
        user.lastName = undefined;
        user.name = undefined;
        return user.save();
      }
      let trimmed = name.trim();

      let split = trimmed.split(' ');

      let numNames = split.length;

      let firstName;

      if (numNames <= 2) {
        firstName = split[0];
      } else {
        firstName = split.slice(0, numNames - 1).join(' ');
      }
      let lastName = numNames <= 1 ? '' : split[numNames - 1];

      user.firstName = firstName;
      user.lastName = lastName;
      return user.save();

    });
    await Promise.all(updatedUsers);
    console.log(`Updated ${updatedActingRoleCount} users who did not have an acting role previously`);
    mongoose.connection.close();
  }catch(err) {
    console.log('error conver names: ', err);
    mongoose.connection.close();
  }
}

convertToFirstNameLastName();

async function updateMissingNames() {
  let ssoDb;
  let vmtDb;

  let updatedSsoCount = 0;
  let updatedVmtCount = 0;

  try {
    ssoDb = await mongoose.createConnection('mongodb://localhost:27017/mtlogin');
    vmtDb = await mongoose.createConnection('mongodb://localhost:27017/vmt');
    let encUsers = await models.User.find({});

    let updated = encUsers.map(async (user) => {
      let { ssoId, firstName, lastName } = user;

      // there were numerous old enc users with no name
      if (typeof firstName !== 'string' && typeof lastName !== 'string') {
        return;
      }
      if (ssoId) {
        let ssoUserUpdateFilter = {_id: ssoId, firstName: null, lastName: null};
        let ssoUserUpdate = {$set: {firstName, lastName}};

        let ssoUserUpdateResults = await ssoDb.collection('users').findOneAndUpdate(ssoUserUpdateFilter, ssoUserUpdate);

        let vmtUserUpdateFilter = {ssoId: ssoId, firstName: null, lastName: null};
        let vmtUserUpdate = {$set: {firstName, lastName}};

        let vmtUserUpdateResults = await vmtDb.collection('users').findOneAndUpdate(vmtUserUpdateFilter, vmtUserUpdate);


         if (ssoUserUpdateResults.lastErrorObject.updatedExisting) {
           updatedSsoCount++;
         }

         if (vmtUserUpdateResults.lastErrorObject.updatedExisting) {
           updatedVmtCount++;
         }

      }
      return user;
    });
    await Promise.all(updated);
    console.log({numSsoUpdate: updatedSsoCount});
    console.log({numVmtUpdated: updatedVmtCount});

    ssoDb.close();
    vmtDb.close();
    mongoose.connection.close();
  }catch(err) {
    console.log({err});
    ssoDb.close();
    vmtDb.close();
    mongoose.connection.close();

  }

}


// updateMissingNames();