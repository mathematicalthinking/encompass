/*eslint no-unused-vars: "off"*/

// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const userFixtures = require('./userFixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/problems/";

chai.use(chaiHttp);

/** GET **/
describe('Problem CRUD operations by account type', function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Problem CRUD operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleProblemCount, accessibleProblem, inaccessibleProblem, validProblem, modifiableProblem , outsideOrgCollabProblem} = user.problems;
      // eslint-disable-next-line no-unused-vars
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

      describe('/GET problems', () => {
        it('should get all problems', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('problems', 'meta');
            expect(res.body.problems).to.be.a('array');
            expect(res.body.problems.length).to.eql(accessibleProblemCount);
            done();
          });
        });
      });

      if (accountType !== 'A') {
        describe('/GET inaccessible problem by id', () => {
          it('should return 403 error', done => {
            const url = baseUrl + inaccessibleProblem._id;
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
      describe('/GET accessible problem by id', () => {
        it('should get one problem with matching id', done => {
          const url = baseUrl + accessibleProblem._id;
          agent
          .get(url)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.problem).to.have.any.keys('title', 'privacySetting', 'title', 'text');
            expect(res.body.problem._id).to.eql(accessibleProblem._id);
            done();
          });
        });
      });

      /** POST **/
      describe('/POST problem', () => {
        let newName = validProblem.title;
        let msg = 'should post a new problem';
        if (isStudent) {
          msg = 'should return a 403 error';
        }
        it(msg, done => {
          agent
          .post(baseUrl)
          .send({problem: validProblem})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            if (isStudent) {
              expect(res).to.have.status(403);
              done();
            } else {
              expect(res).to.have.status(200);
            expect(res.body.problem).to.have.any.keys('title', 'privacySetting', 'categories');
            expect(res.body.problem.title).to.eql(newName);
            done();
            }
          });
        });
      });
      describe('/POST problem with duplicate title', () => {
        let description;
          if (isStudent) {
            description = 'should return 403 error';
          } else {
            description = 'should return 422 Validation error';
          }
          let title = fixtures.problem.duplicateTitle.title;

        it(description, done => {
          agent
          .post(baseUrl)
          .send({problem: {
            title: title,
            createdBy: user.details._id,
            privacySetting: 'E'
          }})
          .end((err, res) => {
            if (err) {
              console.error(err);
              done();
            }
            if (isStudent) {
              expect(res).to.have.status(403);
              done();
            } else {
              expect(res).to.have.status(422);
              done();
            }
          });
        });
      });
      describe('/POST public problem with title matching a non-public problem', () => {
        let description;
          if (isStudent) {
            description = 'should return 403 error';
          } else {
            description = 'should post successfully';
          }
          let title = fixtures.problem.duplicateTitle.nonPublic;

        it(description, done => {
          agent
          .post(baseUrl)
          .send({problem: {
            title: title,
            createdBy: user.details._id,
            privacySetting: 'E'
          }})
          .end((err, res) => {
            if (err) {
              console.error(err);
              done();
            }
            if (isStudent) {
              expect(res).to.have.status(403);
              done();
            } else {
              expect(res).to.have.status(200);
              expect(res.body.problem).to.have.any.keys('title', 'privacySetting', 'categories');
              expect(res.body.problem.title).to.eql(title);
              done();
            }
          });
        });
      });
      //TODO test with other account types
      if (accountType === 'P') {
        describe('Get private problem as outside-org collaborator', function() {
          it('should be able to access', function(done) {
            const url = baseUrl + outsideOrgCollabProblem._id;
            agent
            .get(url)
            .end((err, res) => {
              if (err) {
                console.log(err);
                throw(err);
              }
              expect(res).to.have.status(200);
              expect(res.body.problem).to.have.any.keys('title', 'privacySetting', 'title', 'text');
              expect(res.body.problem._id).to.eql(outsideOrgCollabProblem._id);
              done();
            });
          });
        });
      }


      /** PUT name**/
      if (accountType === 'A' || isStudent) {
        xdescribe('/PUT update problem name', () => {
          it('should change the title to test science problem', done => {
            let url = baseUrl + modifiableProblem._id;
            agent
            .put(url)
            .send({
                  problem: {
                    title: 'test science problem',
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
                expect(res.body.problem).to.have.any.keys('privacySetting', 'title', 'categories');
                expect(res.body.problem.title).to.eql('test science problem');
                done();
              }
            });
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






