/*eslint no-loop-func: 0*/
// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/folders/";

chai.use(chaiHttp);

describe('Folder CRUD operations by Account Type',
 async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Folder CRUD operations as ${user.details.testDescriptionTitle}`, function(){
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleFolderCount, inaccessibleFolder,  accessibleFolder, validFolder, modifiableFolder } = user.folders;

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

      describe('/GET Folders', () => {
        it('should get all folders', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }

            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('folders');
            expect(res.body.folders).to.be.a('array');
            expect(res.body.folders).to.have.lengthOf(accessibleFolderCount);
            done();
          });
        });
      });
      if (accountType !== 'A') {
        describe('/GET inaccessible folder by id', () => {
          it('should return 403 error', done => {
            const url = baseUrl + inaccessibleFolder._id;
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
        describe('/GET accessible folder by ID', () => {
          it('should one folder with matching id', done => {
            agent
            .get(baseUrl + accessibleFolder._id)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('folder');
              expect(res.body.folder).to.be.a('object');
              expect(res.body.folder._id).to.eql(accessibleFolder._id);
              done();
            });
          });
        });
      }

      /** POST **/
      describe('/POST folder', () => {
        let msg = 'should post a new folder';
        if (isStudent) {
          msg = 'should return 403 error';
        }
        it(msg, done => {
          agent
          .post(baseUrl)
          .send({folder: validFolder})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            if (isStudent) {
              expect(res).to.have.status(403);
              done();
            } else {
              expect(res).to.have.status(200);
              expect(res.body.folder).to.have.any.keys('name', 'workspace');
              expect(res.body.folder.name).to.eql(validFolder.name);
              done();
            }
          });
        });
      });

      /** PUT name**/
      describe('/PUT update folder name with permission', () => {
        let newName = `phil's folder`;
        let msg = `should change the folder name to ${newName}`;

        let folder = modifiableFolder;
        if (isStudent) {
          msg = 'should return 403 error';
        }

        it(msg, done => {
          let url = baseUrl + folder._id;
          agent
          .put(url)
          .send({
                folder: {
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
              expect(res.body.folder).to.have.any.keys('name', );
              expect(res.body.folder.name).to.eql(newName);
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
