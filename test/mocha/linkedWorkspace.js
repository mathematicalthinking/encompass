// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;

chai.use(chaiHttp);


let nonCollabStudent = {
  username: 'morganf',
  password: 'morganf',
  assignment: {
    _id: '5b91743a3da5efca74705773'
  },
  workspace: {
    _id: '5bec36958c73047613e2f34e',
  }
};

let relatedTeacher = {
  username: 'teachertaylor',
  password: 'teachertaylor',
  section: {
    _id: '5b9149a32ecaf7c30dd4748f',
  },
  assignment: {
    _id: '5b91743a3da5efca74705773'
  },
  workspace: {
    _id: '5bec36958c73047613e2f34e',
  }
};

function getAPIResourceById(agent, resource, id) {
  let url = `/api/${resource}/${id}`;
  return agent.get(url);
}

describe('API requests related to the linking of workspaces/assignments', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);

  describe('Accessing a linkedWorkspace from a non-collab student', function() {
    let { username, password, workspace } = nonCollabStudent;

    before(async function(){
      try {
        await helpers.setup(agent, username, password);
      }catch(err) {
        console.log(err);
      }
    });

    after(() => {
      agent.close();
    });

    it('should not be able to access', function() {
      return getAPIResourceById(agent, 'workspaces', workspace._id)
        .then((result) => {
          expect(result).to.have.status(403);
        })
        .catch((err) => {
          throw(err);
        });
    });
  });

  describe('Accessing a linkedWorkspace as a teacher of related section', function() {

    let { username, password, workspace } = relatedTeacher;

    before(async function(){
      try {
        await helpers.setup(agent, username, password);
      }catch(err) {
        console.log(err);
      }
    });

    after(() => {
      agent.close();
    });

    it('should be able to access', function() {
      return getAPIResourceById(agent, 'workspaces', workspace._id)
        .then((result) => {
          expect(result).to.have.status(200);
        })
        .catch((err) => {
          throw(err);
        });
    });

  });
});