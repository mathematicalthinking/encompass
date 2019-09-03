/*eslint no-unused-vars: "off"*/

// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');
const models = require('../../server/datasource/schemas');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/answers/";

mongoose.Promise = global.Promise;

chai.use(chaiHttp);

describe('Answer CRUD operations by account type', function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Answer CRUD operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleAnswerCount, accessibleAnswer, inaccessibleAnswer, firstRevision } = user.answers;
      // eslint-disable-next-line no-unused-vars
      const isStudent = accountType === 'S' || actingRole === 'student';
      let isAdmin = accountType === 'A' && !isStudent;
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

      describe('/GET answers', () => {
        it('should get all answers', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('answers', 'meta');
            expect(res.body.answers).to.be.a('array');
            expect(res.body.answers).to.have.lengthOf(accessibleAnswerCount);
            done();
          });
        });
      });

      /** POST **/
      describe('/POST answer', () => {
        it('should post a new answer', done => {
          agent
          .post(baseUrl)
          .send({answer: fixtures.answer.validAnswer})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.answer).to.have.any.keys('problem', 'answer');
            expect(res.body.answer.explanation).to.eql('I put 2 and 2 together');
            done();
          });
        });
      });

      /** PUT name**/
      describe('/PUT update answer explanation for already submitted', () => {

        let desc = 'it should return an error';
        if (isAdmin) {
          desc = 'should allow admin to update already submitted answer';
        }
        it(desc, done => {
          let url = baseUrl + fixtures.answer._id;
          agent
          .put(url)
          .send({answer: fixtures.answer.updated})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            if (isAdmin) {
              expect(res).to.have.status(200);
              expect(res.body.answer).to.have.any.keys('problem', 'answer');
              expect(res.body.answer.explanation).to.eql(fixtures.answer.updated.explanation);
              done();
            } else {
              expect(res).to.have.status(403);
              done();
            }
          });
        });
      });

      if (accountType === 'S') {
        describe('/POST revised answer to assignment with a linked workspace', function() {
          before(async function() {
            await mongoose.connect('mongodb://localhost:27017/encompass_seed', {useMongoClient: true});

          });
          after( function() {
            mongoose.connection.close();
          });

          let newAnswerId;
          let  workspaceToUpdate  = firstRevision.workspacesToUpdate[0];
          let newSubmission;

          it('should post the revision successfully', function(done) {
              agent
              .post(baseUrl)
              .send({answer: firstRevision})
              .end((err, res) => {
                if (err) {
                  throw(err);
                }
                expect(res).to.have.status(200);
                let { answer, meta } = res.body;
                expect(answer).to.have.any.keys('problem', 'answer', 'priorAnswer');
                expect(meta.updatedWorkspacesInfo).to.have.all.keys('updatedWorkspaceInfo', 'updatedParentWsIds');


                let { updatedWorkspaceInfo } = meta.updatedWorkspacesInfo;

                expect(updatedWorkspaceInfo).to.be.an('array');

                expect(updatedWorkspaceInfo).to.have.lengthOf(1);

                let updatedWorkspaceId = updatedWorkspaceInfo[0].updatedWorkspaceInfo.workspaceId;

                let newSubmissionId = updatedWorkspaceInfo[0].updatedWorkspaceInfo.submissionId;

                expect(updatedWorkspaceId).to.eql(workspaceToUpdate);
                expect(newSubmissionId).to.exist;
                newAnswerId = res.body.answer._id;
                done();
              });

          });
          it('should have created a new submission ', async function() {
            try {
              newSubmission = await models.Submission.findOne({answer: newAnswerId, workspaces: workspaceToUpdate}).lean().exec();

              expect(newSubmission).to.exist;
              expect(newSubmission.creator.studentId).to.eql(firstRevision.createdBy);

            }catch(err) {
              throw err;
            }


          });

          it('should have added the submission to the workspace', async function() {
            try {
              let workspace = await models.Workspace.findById(workspaceToUpdate).lean().exec();
              expect(workspace.submissions.map(sub => sub.toString())).to.contain(newSubmission._id.toString());
              expect(workspace.submissions).to.have.lengthOf.at.least(2);
            }catch(err) {
              throw err;
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

