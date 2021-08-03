// REQUIRE MODULES

// REQUIRE FILES
const dbSetup = require('../data/restore');
const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('clientPort');
const host = `http://localhost:${port}`;

const admin = {
  username: 'rick',
  password: 'sanchez'
};

const regUser = {
  username: 'morty',
  password: 'smith'
};

const pdAdmin = {
  username: 'pdadmin',
  password: 'pdadmin'
};

// const student = {
//   username: 'alex8',
//   password: 'alex'
// };

const loginUrl = '/auth/login';

const setup = async function(agent, user=admin.username, pass=admin.password, url=loginUrl) {
  try {
    await dbSetup.prepTestDb();
    await agent.post(url)
      .send({ username: user, password: pass });
  }catch(err) {
    console.log(err);
  }
};


function putApiResourceById(agent, resource, id, body) {
  let url = `/api/${resource}/${id}`;

  let model = resource.slice(0, resource.length - 1);
  return agent
    .put(url)
    .send({[model]: body});
}

function getApiResourceById(agent, resource, id) {
  let url = `/api/${resource}/${id}`;
  return agent.get(url);
}

module.exports.setup = setup;
module.exports.admin = admin;
module.exports.regUser = regUser;
module.exports.host = host;
module.exports.pdAdmin = pdAdmin;
module.exports.loginUrl = loginUrl;
module.exports.putApiResourceById = putApiResourceById;
module.exports.getApiResourceById = getApiResourceById;