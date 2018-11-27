/*eslint no-loop-func: 0*/
// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');
const fixtures = require('./baseFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/";

chai.use(chaiHttp);


describe('Base API tests by account type', function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Base API operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('20s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole} = user.details;
      const collections = ['answers', 'assignments', 'selections', 'sections', 'problems', 'workspaces', 'submissions', 'taggings', 'organizations', 'comments', 'folders', 'categories', 'responses', 'users', 'images'];

      // const forbiddenStudentGetPaths = ['workspaces', 'comments', 'folders', 'taggings', 'selections', 'pdSets', 'folderSets', 'submissions'];
      const forbiddenStudentGetPaths = [];

      const adminTrashedPaths = ['problems'];

      const isStudent = accountType === 'S' || actingRole === 'student';
      const isAdmin = accountType === 'A';
      let nonexistantMongoId = new mongoose.Types.ObjectId();

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
      for (let collection of collections) {
        let shouldBe403Error = isStudent && forbiddenStudentGetPaths.includes(collection);
        let collectionName = collection.slice(0, collection.length - 1);
        describe(`requesting a trashed ${collectionName} by id`, done => {
          let id = fixtures[collection].trashedRecord._id;
          let msg;
          if (shouldBe403Error) {
            msg = 'should return 403 error';
          } else {
            msg = 'should return 404 error';
          }
          it(msg, done => {
            let url = `${baseUrl}${collection}/${id}`;
            agent
            .get(url)
            .end((err, res) => {
              if (err) {
                console.log(err);
              }
              if (isStudent && forbiddenStudentGetPaths.includes(collection) ) {
                expect(res).to.have.status(403);
                done();
              } else if (isAdmin && adminTrashedPaths.includes(collection)) {
                expect(res).to.have.status(200);
                done();
              } else {
                expect(res).to.have.status(404);
                done();
              }
            });
        });
      });

      describe(`Requesting ${collection} by id with an invalid id`, function() {
        describe('valid mongoId but nonexistant', function() {
          let id = nonexistantMongoId;
          it('should return 404 error', done => {
              let url = `${baseUrl}${collection}/${id}`;
              agent
              .get(url)
              .end((err, res) => {
                if (err) {
                  console.log(err);
                }
                if (isStudent && forbiddenStudentGetPaths.includes(collection) ) {
                  expect(res).to.have.status(403);
                  done();
                } else {
                  expect(res).to.have.status(404);
                  done();
                }
              });

          });
        });
        describe('invalid ObjectId', function() {
          let options = {
            badString: 'badId',
            badNumber: 34534,
            badJson: {"hello": "yes"}
          };

          function getRecordById(id) {
            describe(`id as ${JSON.stringify(id)}`, function() {
              it('should return 409 error', done => {
                let url = `${baseUrl}${collection}/${id}`;
                agent
                .get(url)
                .end((err, res) => {
                  if (err) {
                    console.log(err);
                  }
                  if (isStudent && forbiddenStudentGetPaths.includes(collection) ) {
                    expect(res).to.have.status(403);
                    done();
                  } else {
                    expect(res).to.have.status(409);
                    done();
                  }

                });
              });
            });
          }
          for (let key of Object.keys(options)){
            let id = options[key];
            getRecordById(id);
          }
        });
      });
      }

  });
}

  for (let user of Object.keys(testUsers)) {
    let testUser = testUsers[user];
    // eslint-disable-next-line no-await-in-loop
    runTests(testUser);
  }


});