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

const fixtures = require('./fixtures/assignments');

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

      const { putApiResourceById, getApiResourceById } = helpers;

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
      if (username === 'ssmith') {
        describe('/POSTing assignment and creating linkedWorkspaces', () => {
          let body = fixtures.withLinkedWorkspaces.valid;
          it('should post a new assignment', done => {
            agent
            .post(baseUrl)
            .send({assignment: body})
            .end((err, res) => {
              if (err) {
                throw(err);
              }
              expect(res).to.have.status(200);
              expect(res.body.assignment).to.have.any.keys('problem', 'assignment');
              expect(res.body.assignment.name).to.eql(body.name);
              let createdWorkspaces = res.body.assignment.linkedWorkspacesRequest.createdWorkspaces;

              expect(createdWorkspaces).to.be.an('array');
              expect(createdWorkspaces).to.have.lengthOf(body.students.length);
              done();
            });
          });
        });

        describe('Posting assignment without name', function() {
          let body = fixtures.withoutName.valid.body;
          it('should post a new assignment', done => {
            agent
            .post(baseUrl)
            .send({assignment: body})
            .end((err, res) => {
              if (err) {
                throw(err);
              }
              expect(res).to.have.status(200);
              expect(res.body.assignment).to.have.any.keys('problem', 'assignment');
              expect(res.body.assignment.name).to.eql(fixtures.withoutName.valid.expectedResultName);
              done();
            });
          });
        });
      }

      if (username === 'pdadmin') {
        describe('Changing Assignment Section', function() {
          let {assignment: assn, newSection} = fixtures.pdAdmin.toModify;
          let { section: oldSectionId, students: oldStudentIds } = assn;

          assn.section = newSection._id;

          let putResults;

          before(function() {
            return putApiResourceById(agent, 'assignments', assn._id, assn)
            .then((results) => {
              putResults = results.body.assignment;
            });
          });

          it('should have new sectionId for section value', function() {
            expect(putResults.section).to.eql(newSection._id.toString());
          });

          it('should have only students from new section in students array', function() {
            expect(putResults.students).to.have.members(newSection.students.map(s => s.toString()));
          });

          describe('Checking old section data was updated', function() {
            let oldSection;

            before(function() {
              return getApiResourceById(agent, 'sections', oldSectionId)
              .then((res) => {
                oldSection = res.body.section;
                return;
              });

            });

            it('old section should no longer be linked to assignment', function() {
              expect(oldSection.assignment).to.not.exist;
            });

            it('students from old section should not belong to assignment anymore', function() {
              return agent.get('/api/users')
              .query({ids: oldStudentIds.map(id => id.toString())})
              .then((res) => {
                res.body.user.forEach((user) => {
                  expect(user.assignments).to.not.include(assn._id.toString());
                });
              });

            });

          });
        });
      }


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