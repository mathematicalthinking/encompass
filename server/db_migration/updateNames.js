const mongoose = require('mongoose');
const _ = require('underscore');


const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/encompass');

async function convertToFirstNameLastName() {
  try {
    let users = await models.User.find({name: {$ne: null}}).exec();

    let updatedUsers = users.map((user) => {
      let name = user.name.trim();

      if (name.length === 0) {
        user.firstName = '';
        user.lastName = '';
        return user.save();
      }
      let split = name.split(' ');

      let numNames = split.length;

      let firstName;

      if (numNames <= 2) {
        firstName = split[0];
      } else {
        firstName = split.slice(0, numNames - 1).join(' ');
      }
      let lastName = numNames <= 1 ? '' : split[numNames - 1];
      // console.log(name + ' : ');
      // console.log(firstName + ' ' + lastName);

      user.firstName = firstName;
      user.lastName = lastName;
      return user.save();

    });
    await Promise.all(updatedUsers);
    mongoose.connection.close();
  }catch(err) {
    console.log('error conver names: ', err);
    mongoose.connection.close();
  }
}

convertToFirstNameLastName();