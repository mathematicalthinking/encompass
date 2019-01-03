/*eslint no-loop-func: 0*/
// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/foldersets/";

chai.use(chaiHttp);

describe('FolderSet CRUD operations by Account Type',
 async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`FolderSet CRUD operations as ${user.details.testDescriptionTitle}`, function(){
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleFolderSetCount, inaccessibleFolderSet,  accessibleFolderSet, validFolderSet, modifiableFolderSet } = user.folderSets;

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

      describe('/GET FolderSets', () => {
        it('should get all folderSets', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }

            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('folderSets');
            expect(res.body.folderSets).to.be.a('array');
            expect(res.body.folderSets).to.have.lengthOf(accessibleFolderSetCount);
            done();
          });
        });
      });
      if (accountType !== 'A') {
        describe('/GET inaccessible folderSet by id', () => {
          it('should return 403 error', done => {
            const url = baseUrl + inaccessibleFolderSet._id;
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
      }
      if (!isStudent) {
        describe('/GET accessible folderSet by ID', () => {
          it('should one folderSet with matching id', done => {
            agent
            .get(baseUrl + accessibleFolderSet._id)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('folderSet');
              expect(res.body.folderSet).to.be.a('object');
              expect(res.body.folderSet._id).to.eql(accessibleFolderSet._id);
              done();
            });
          });
        });
      }

      /** POST **/
      describe('/POST folderSet', () => {
        let msg = 'should post a new folderSet';
        it(msg, done => {
          agent
          .post(baseUrl)
          .send({folderSet: validFolderSet})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
              expect(res).to.have.status(200);
              expect(res.body.folderSet).to.have.any.keys('name', 'privacySetting');
              expect(res.body.folderSet.name).to.eql(validFolderSet.name);
              done();
            });
        });
      });

      /** PUT name**/
      xdescribe('/PUT update folderSet name with permission', () => {
        let newName = `phil's folderSet`;
        let msg = `should change the folderSet name to ${newName}`;

        let folderSet = modifiableFolderSet;
        if (isStudent) {
          msg = 'should return 403 error';
        }

        it(msg, done => {
          let url = baseUrl + folderSet._id;
          agent
          .put(url)
          .send({
                folderSet: {
                  name: newName,
                }
              })
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            if (isStudent) {
              expect(res).to.have.status(403);
              done();
            } else {
              expect(res).to.have.status(200);
              expect(res.body.folderSet).to.have.any.keys('name', );
              expect(res.body.folderSet.name).to.eql(newName);
              done();
            }
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
