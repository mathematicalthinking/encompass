// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const config = require('../../server/config');

const expect = chai.expect;
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

const admin = {
  username: 'rick',
  password: 'sanchez'
};

const regUser = {
  username: 'morty',
  password: 'smith'
};

const loginUrl = '/auth/login';

const setup = async function(agent, url=loginUrl, user=admin.username, pass=admin.password) {
  try {
    await dbSetup.prepTestDb();
    await agent.post(url)
      .send({ username: user, password: pass });
  }catch(err) {
    console.log(err);
  }
};

module.exports.setup = setup;
module.exports.admin = admin;
module.exports.regUser = regUser;
module.exports.host = host;