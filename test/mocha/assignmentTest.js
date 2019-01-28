// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/assignments/";

chai.use(chaiHttp);

describe('Assignment CRUD operations by account type', function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Assignment CRUD operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleAssignmentCount, accessibleAssignment, inaccessibleAssignment } = user.assignments;
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

      describe('/GET assignments', () => {
        it('should get all assignments', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('assignments');
            expect(res.body.assignments).to.be.a('array');
            expect(res.body.assignments).to.have.lengthOf(accessibleAssignmentCount);
            done();
          });
        });
      });

      if (accountType !== 'A' && accountType !== 'P') {
        describe('/GET inaccessible assignment by id', () => {
          it('should return 403 error', done => {
            const url = baseUrl + inaccessibleAssignment._id;
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
      describe('/GET accessible assignment by id', () => {
        it('should get one assignment with matching id', done => {
          const url = baseUrl + accessibleAssignment._id;
          agent
          .get(url)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.assignment).to.have.any.keys('section', 'problem', 'students', 'assignedDate', 'dueDate');
            expect(res.body.assignment._id).to.eql(accessibleAssignment._id);
            done();
          });
        });
      });

      /** POST **/
      // xdescribe('/POST assignment', () => {
      //   it('should post a new assignment', done => {
      //     agent
      //     .post(baseUrl)
      //     .send({assignment: validAssignment})
      //     .end((err, res) => {
      //       if (err) {
      //         console.error(err);
      //       }
      //       expect(res).to.have.status(200);
      //       expect(res.body.assignment).to.have.any.keys('problem', 'assignment');
      //       expect(res.body.assignment.explanation).to.eql('I put 2 and 2 together');
      //       done();
      //     });
      //   });
      // });

      // /** PUT name**/
      // xdescribe('/PUT update assignment explanation for already submitted', () => {
      //   it('should return an error,', done => {
      //     let url = baseUrl + _id;
      //     agent
      //     .put(url)
      //     .send({assignment: updated})
      //     .end((err, res) => {
      //       if (err) {
      //         console.error(err);
      //       }
      //       expect(res).to.have.status(403);
      //       done();
      //     });
      //   });
      // });

    });
  }

  for (let user of Object.keys(testUsers)) {
    let testUser = testUsers[user];
    // eslint-disable-next-line no-await-in-loop
    runTests(testUser);
  }


});