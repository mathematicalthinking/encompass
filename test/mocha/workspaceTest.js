// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');
const _ = require('underscore');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/workspaces/";


chai.use(chaiHttp);

describe('Workspace CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Workspace CRUD operations as ${user.details.testDescriptionTitle}`, function(){
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, } = user.details;
      const { inaccessibleWorkspace, accessibleWorkspacesCount, accessibleWorkspace } = user.workspaces;

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

       /** GET **/
    describe('/GET workspaces', () => {
      it('should get all workspaces', done => {
        agent
        .get(baseUrl)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('workspaces', 'meta');
        expect(res.body.workspaces).to.be.a('array');
        expect(res.body.workspaces.length).to.eql(accessibleWorkspacesCount);
        done();
        });
      });
    });

    if (accountType !== 'A' && accountType !== 'S') {
      /** GET **/
      describe('/GET inaccessible workspace by id', () => {
        it('should return 403 error', done => {
          const url = baseUrl + inaccessibleWorkspace._id;
          agent
          .get(url)
          .end((err, res) => {
            if (err) {
              throw(err);
            }
            expect(res).to.have.status(403);
            done();
          });
        });
      });
    }

    describe('/GET workspace by ID', () => {
      it('should get workspace', done => {
        agent
        .get(baseUrl + accessibleWorkspace._id)
        .end((err, res) => {
          if (err) {
            throw(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('workspace', 'folder', 'selection', 'submission', 'tagging', 'response', 'comment', 'user');
          expect(res.body.workspace).to.be.a('object');

          let arraysToCheck = ['submissions', 'comments', 'responses', 'taggings', 'selections', 'folders'];

          arraysToCheck.forEach((prop) => {
            expect(res.body.workspace[prop]).to.have.members(accessibleWorkspace[prop]);
          });

          let sideSubmissions = res.body.submission;

          let sideResponses = _.chain(sideSubmissions)
            .map(s => s.responses)
            .flatten()
            .uniq()
            .value();
          expect(sideResponses).to.have.members(accessibleWorkspace.responses);

          done();
        });
      });
    });


  });
  }

for (let user of Object.keys(testUsers)) {
  let testUser = testUsers[user];
  // eslint-disable-next-line no-await-in-loop
  await runTests(testUser);
}
});