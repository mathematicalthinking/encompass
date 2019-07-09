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
        actingRole = user.accountType === 'S' ? 'student' : 'teacher';
        updatedActingRoleCount++;
      }

      if (typeof name !== 'string' || name.trim().length === 0) {
        user.firstName = undefined;
        user.lastName = undefined;
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