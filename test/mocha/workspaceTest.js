// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

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
      const { username, password, accountType, actingRole } = user.details;
      const { inaccessibleWorkspace, accessibleWorkspacesCount, accessibleWorkspace } = user.workspaces;
      const isStudent = accountType === 'S' || actingRole === 'student';

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
              console.log(err);
            }
            expect(res).to.have.status(403);
            done();
          });
        });
      });

      // xdescribe('/PUT update unaccessible workspace', () => {
      //   it('should return 403 error', done => {
      //     const url = baseUrl + inaccessibleWorkspace._id;
      //     agent
      //     .put(url)
      //     .send({
      //       user: {
      //         'name': 'test name',
      //         'username': inaccessibleWorkspace.username,
      //         'accountType': inaccessibleWorkspace.accountType,
      //       }
      //     })
      //     .end((err, res) => {
      //       expect(res).to.have.status(403);
      //       done();
      //     });
      //   });
      // });


    }

    describe('/GET workspace by ID', () => {
      it('should get workspace', done => {
        agent
        .get(baseUrl + accessibleWorkspace._id)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('workspace', 'folder', 'selection', 'submission', 'tagging', 'response');
          expect(res.body.workspace).to.be.a('object');

          let arraysToCheck = ['submissions', 'comments', 'responses', 'taggings', 'selections', 'folders'];

          arraysToCheck.forEach((prop) => {
            expect(res.body.workspace[prop]).to.have.members(accessibleWorkspace[prop]);
          });
          // expect(res.body.workspace.pdSet).to.eql("Feather and Fur - Mary");
          done();
        });
      });
    });


  });
  }

  /** POST **/
  // xdescribe('/POST workspace', () => {
  //   it('should post a new workspace', done => {
  //     agent
  //     .post(baseUrl)
  //     .send(fixtures.workspace.validWorkspace)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.workspace).to.be.a('array')
  //       expect(res.body.workspace[0]).to.have.any.keys('longAnswer', 'shortAnswer', 'answer');
  //       expect(res.body.workspace[0].longAnswer).to.eql(fixtures.workspace.validWorkspace.longAnswer);
  //       done();
  //     });
  //   });
  // });
//   //
//   /** PUT workspace text**/
//   describe('/PUT update workspace text', () => {
//     it('should change the workspace text to "updated text"', done => {
//       let url = baseUrl + fixtures.workspace._id;
//       agent
//       .put(url)
//       .set('Cookie', userCredentials)
//       .send({workspace: {text: 'updated text', workspace: fixtures.workspace.validWorkspace.workspace}})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.workspace).to.have.any.keys('text', 'workspace', 'taggingins', 'workspace');
//         expect(res.body.workspace.text).to.eql('updated text');
//         done();
//       });
//     });
//   });
for (let user of Object.keys(testUsers)) {
  let testUser = testUsers[user];
  // eslint-disable-next-line no-await-in-loop
  await runTests(testUser);
}
});