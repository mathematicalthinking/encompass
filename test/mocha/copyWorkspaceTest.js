// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('underscore');
const mongoose = require('mongoose');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');
const fixtures = require('./fixtures/copyWorkspace');
const models = require('../../server/datasource/schemas');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/copyWorkspaceRequests/";

chai.use(chaiHttp);
// [[prop, expectedValue]]
function checkLengths(tuples) {
  _.each(tuples, (tuple) => {
    expect(tuple[0]).to.have.lengthOf(tuple[1]);
  });
}

mongoose.Promise = global.Promise;


describe(`Copy Workspace operations by account type`, function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Copy Workspace operations as ${user.details.testDescriptiontitle}`, function() {
      this.timeout('20s');

      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;

      const originalWs = fixtures.originalWorkspace;
      const isStudent = accountType === 'S' || actingRole === 'student';
      let baseWsId = originalWs._id;
      let newWsName = "New Cloned Workspace";
      let newWsOwner = "5b9149552ecaf7c30dd4748e";

      const basicShallowRequest = {
        copyWorkspaceRequest: {

            originalWsId: baseWsId,
            owner: newWsOwner,
            name: newWsName,
            answerOptions: {
              all: true
            },
            folderOptions: {
              includeStructureOnly: true,
              folderSetOptions: {
                doCreateFolderSet: false,
              },
              "all": true
            },
            selectionOptions: {
              none: true
            },
            commentOptions: {
              none: true,

            },
            responseOptions: {
              none: true
            }

      }
    };
      const deepCloneRequest = {
       copyWorkspaceRequest: {
        originalWsId: baseWsId,
        owner: newWsOwner,
        name: newWsName,
        answerOptions: {
          all: true
        },
        folderOptions: {
          includeStructureOnly: false,
          folderSetOptions: {
            doCreateFolderSet: false,
          },
          "all": true
        },
        selectionOptions: {
          all: true
        },
        commentOptions: {
          all: true,

        },
        responseOptions: {
          all: true
        }
      }




      };
      before(async function(){
        try {
          await helpers.setup(agent, username, password);
          mongoose.connect('mongodb://localhost:27017/encompass_seed');

        }catch(err) {
          console.log(err);
        }
      });

      after(() => {
        mongoose.connection.close();
        agent.close();
      });
        describe('Basic shallow request', function() {
          const request = basicShallowRequest;
            it('should post request successfully', function() {
              return agent
              .post(baseUrl)
              .send(request)
              .then((res) => {
                if (isStudent) {
                  expect(res).to.have.status(403);
                  return;
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys('copyWorkspaceRequest');
                expect(res.body.copyWorkspaceRequest.createdWorkspace).to.exist;
                return models.Workspace.findById(res.body.copyWorkspaceRequest.createdWorkspace).lean().exec();
              })
              .then((ws) => {

                if (isStudent) {
                  return;
                }
                expect(ws).to.exist;
                const { owner, name, mode, submissions, folders, taggings, selections, comments, responses } = ws;

                  const tuples = [
                    [submissions, originalWs.submissions.length ],
                    [folders, originalWs.folders.length ],
                    [taggings, 0], [selections, 0], [comments, 0], [responses, 0]
                  ];
                  checkLengths(tuples);
                  expect(owner.toString()).to.eql(newWsOwner);
                  expect(name).to.eql(newWsName);
                  expect(mode).to.eql(originalWs.mode);
              })
              .catch((err) => {
                throw err;
              });
            });
          });

        describe('Basic Deep Clone Workspace', function() {
          const request = deepCloneRequest;
            it('should post request successfully', function() {
              return agent
              .post(baseUrl)
              .send(request)
              .then((res) => {
                if (isStudent) {
                  expect(res).to.have.status(403);
                  return;
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys('copyWorkspaceRequest');
                expect(res.body.copyWorkspaceRequest.createdWorkspace).to.exist;
                return models.Workspace.findById(res.body.copyWorkspaceRequest.createdWorkspace).lean().exec();
              })
              .then((ws) => {

                if (isStudent) {
                  return;
                }
                expect(ws).to.exist;
                const { owner, name, mode, submissions, folders, taggings, selections, comments, responses } = ws;

                const tuples = [
                  [submissions, originalWs.submissions.length ],
                  [folders, originalWs.folders.length ],
                  [taggings, originalWs.taggings.length], [selections, originalWs.selections.length], [comments, originalWs.comments.length], [responses, originalWs.responses.length]
                ];
                  checkLengths(tuples);
                  expect(owner.toString()).to.eql(newWsOwner);
                  expect(name).to.eql(newWsName);
                  expect(mode).to.eql(originalWs.mode);
              })
              .catch((err) => {
                throw err;
              });
            });
        });

        describe('Shallow By AnswerId', function() {
          // ashleyc
          let requestedAnswerIds = ["5bec35898c73047613e2f34b"];
          const request = {
            copyWorkspaceRequest: {
              originalWsId: baseWsId,
              owner: newWsOwner,
              name: newWsName,
              answerOptions: {
                answerIds: requestedAnswerIds
              },
              folderOptions: {
                includeStructureOnly: true,
                folderSetOptions: {
                  doCreateFolderSet: false,
                },
                "all": true
              },
              selectionOptions: {
                none: true
              },
              commentOptions: {
                none: true,

              },
              responseOptions: {
                none: true
              }
            }





          };
          // let submission = fixtures.byAnswerIdSubmission;

          it('should only copy records related to requested answer', function() {
            return agent
            .post(baseUrl)
            .send(request)
            .then((res) => {
              if (isStudent) {
                expect(res).to.have.status(403);
                return;
              }
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('copyWorkspaceRequest');
              expect(res.body.copyWorkspaceRequest.createdWorkspace).to.exist;
              return models.Workspace.findById(res.body.copyWorkspaceRequest.createdWorkspace).lean().exec();
            })
            .then((ws) => {

              if (isStudent) {
                return;
              }
              expect(ws).to.exist;
              const { owner, name, mode, submissions, folders, taggings, selections, comments, responses } = ws;

                const tuples = [
                  [submissions, requestedAnswerIds.length ],
                  [folders, originalWs.folders.length ],
                  [taggings, 0], [selections, 0], [comments, 0], [responses, 0]
                ];
                checkLengths(tuples);
                expect(owner.toString()).to.eql(newWsOwner);
                expect(name).to.eql(newWsName);
                expect(mode).to.eql(originalWs.mode);
            })
            .catch((err) => {
              throw err;
            });
          });
        });

        describe('Deep Clone By AnswerId', function() {
            // tracyc
            let requestedAnswerIds = ["5bb813fc9885323f6d894972"];
            const request = {
              copyWorkspaceRequest: {
                originalWsId: baseWsId,
                owner: newWsOwner,
                name: newWsName,
                answerOptions: {
                  answerIds: requestedAnswerIds
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  "all": true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                 all: true
                }
              }

            };
            // let submission = fixtures.byAnswerIdSubmission;

            it('should only copy records related to requestedAnswer', function() {
              return agent
              .post(baseUrl)
              .send(request)
              .then((res) => {
                if (isStudent) {
                  expect(res).to.have.status(403);
                  return;
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys('copyWorkspaceRequest');
                expect(res.body.copyWorkspaceRequest.createdWorkspace).to.exist;
                return models.Workspace.findById(res.body.copyWorkspaceRequest.createdWorkspace).lean().exec();
              })
              .then((ws) => {

                if (isStudent) {
                  return;
                }
                expect(ws).to.exist;
                const { owner, name, mode, submissions, folders, taggings, selections, comments, responses } = ws;

                const tuples = [
                  [submissions, requestedAnswerIds.length ],
                  [folders, originalWs.folders.length ], [taggings, 2],
                  [selections, 2], [comments, 2], [responses, 1]
                ];
                  checkLengths(tuples);
                  expect(owner.toString()).to.eql(newWsOwner);
                  expect(name).to.eql(newWsName);
                  expect(mode).to.eql(originalWs.mode);
              })
              .catch((err) => {
                throw err;
              });
            });
          });

          xdescribe('Shallow By FolderIds', function() {
            const requestedFolderIds = ["5bec36cd8c73047613e2f354", "5bec36ca8c73047613e2f353"];
            const request = {
              copyWorkspaceRequest: {
                originalWsId: baseWsId,
              owner: newWsOwner,
              name: newWsName,
              answerOptions: {
                all: true
              },
              folderOptions: {
                includeStructureOnly: true,
                folderSetOptions: {
                  doCreateFolderSet: false,
                },
                folderIds: requestedFolderIds
              },
              selectionOptions: {
                none: true
              },
              commentOptions: {
                none: true,

              },
              responseOptions: {
               none: true
              }
              }
            };
            // let submission = fixtures.byAnswerIdSubmission;

            xit('should only copy records related to requested answer', function() {
              return agent
              .post(baseUrl)
              .send(request)
              .then((res) => {
                if (isStudent) {
                  expect(res).to.have.status(403);
                  return;
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.all.keys('copyWorkspaceRequest');
                expect(res.body.copyWorkspaceRequest.createdWorkspace).to.exist;
                return models.Workspace.findById(res.body.copyWorkspaceRequest.createdWorkspace).lean().exec();
              })
              .then((ws) => {

                if (isStudent) {
                  return;
                }
                expect(ws).to.exist;
                const { owner, name, mode, submissions, folders, taggings, selections, comments, responses } = ws;

                const tuples = [
                  [submissions, originalWs.submissions.length ],
                  [folders, requestedFolderIds.length ], [taggings, 0],
                  [selections, 0], [comments, 0], [responses, 0]
                ];
                  checkLengths(tuples);
                  expect(owner.toString()).to.eql(newWsOwner);
                  expect(name).to.eql(newWsName);
                  expect(mode).to.eql(originalWs.mode);
              })
              .catch((err) => {
                throw err;
              });
            });
          });
        });


  }

  return Promise.all(_.map(testUsers, (testUser, key) => {
    return runTests(testUser);
  }));
});


