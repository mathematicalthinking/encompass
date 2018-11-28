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
mongoose.Promise = global.Promise;

chai.use(chaiHttp);
// [[prop, expectedValue]]
function checkLengths(tuples) {
  _.each(tuples, (tuple) => {
    expect(tuple[0]).to.have.lengthOf(tuple[1]);
  });
}

function areRecordsEqual(model, originalJSON, wsId) {
  return models[model].findById(wsId).lean().exec()
    .then((doc) => {
      if (_.isNull(doc)) {
        return false;
      }
      let newJSON = JSON.parse(JSON.stringify(doc));
      return _.isEqual(originalJSON, newJSON);
    });
}

describe(`Copy Workspace operations by account type`, function () {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Copy Workspace operations as ${user.details.testDescriptionTitle}`, function () {
      this.timeout('20s');

      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole, _id } = user.details;

      const originalWs = fixtures.originalWorkspace;
      const isStudent = accountType === 'S' || actingRole === 'student';
      let baseWsId = originalWs._id;
      let newWsName = "New Cloned Workspace";
      let newWsOwner = "5b9149552ecaf7c30dd4748e";
      let studentOwner = "5b914a102ecaf7c30dd47492";

      /*
      {
        baseWsId: ,
        newOwnerId,
        newWsName,
        newMode,
        doCreateFolderSet: bool
        hasPermission: bool

      }
      */
      // return array [ copyWorkspaceRequest, hash of expected lengths]
      function buildShallowRequest(settings, workspace, answerIds = null, doIncludeFolders = false) {
        let { newOwnerId, newWsName, newMode, permissions } = settings;
        if (!Array.isArray(permissions)) {
          permissions = [];
        }

        let includeAllAnswers;
        let subsLength;
        let foldersLength;

        if (Array.isArray(answerIds)) {
          includeAllAnswers = false;
          subsLength = answerIds.length;
        } else {
          includeAllAnswers = true;
          subsLength = workspace.submissions.length;
          answerIds = [];
        }

        if (doIncludeFolders) {
          foldersLength = workspace.folders.length;
        } else {
          foldersLength = 0;
        }


        let lengths = {
          submissions: subsLength,
          taggings: 0,
          selections: 0,
          comments: 0,
          responses: 0,
          folders: foldersLength,
          permissions: permissions.length
        };
        return [
          {
            copyWorkspaceRequest: {
              originalWsId: workspace._id,
              owner: newOwnerId,
              name: newWsName,
              mode: newMode,
              answerOptions: {
                all: includeAllAnswers,
                answerIds: answerIds
              },
              folderOptions: {
                includeStructureOnly: true,
                folderSetOptions: {
                  doCreateFolderSet: false,
                },
                all: doIncludeFolders,
                none: !doIncludeFolders
              },
              selectionOptions: {
                none: true
              },
              commentOptions: {
                none: true,

              },
              responseOptions: {
                none: true
              },
              permissionOptions: {
                permissionObjects: permissions
              }
            }
          },
          lengths

        ];
      }

      function buildDeepCloneRequest(settings, workspace, expectedLengths, answerIds = null, doIncludeFolders = true) {
        let { newOwnerId, newWsName, newMode, permissions } = settings;
        if (!Array.isArray(permissions)) {
          permissions = [];
        }

        let includeAllAnswers;
        let subsLength;
        let foldersLength;

        let { taggings, selections, comments, responses } = expectedLengths;

        if (Array.isArray(answerIds)) {
          includeAllAnswers = false;
          subsLength = answerIds.length;
        } else {
          includeAllAnswers = true;
          subsLength = workspace.submissions.length;
          answerIds = [];
        }

        if (doIncludeFolders) {
          foldersLength = workspace.folders.length;
        } else {
          foldersLength = 0;
        }


        let lengths = {
          submissions: subsLength,
          taggings: taggings,
          selections: selections,
          comments: comments,
          responses: responses,
          folders: foldersLength,
          permissions: permissions.length
        };
        return [
          {
            copyWorkspaceRequest: {
              originalWsId: workspace._id,
              owner: newOwnerId,
              name: newWsName,
              mode: newMode,
              answerOptions: {
                all: includeAllAnswers,
                answerIds: answerIds
              },
              folderOptions: {
                includeStructureOnly: false,
                folderSetOptions: {
                  doCreateFolderSet: false,
                },
                all: doIncludeFolders,
                none: !doIncludeFolders
              },
              selectionOptions: {
                all: true
              },
              commentOptions: {
                all: true,

              },
              responseOptions: {
                all: true
              },
              permissionOptions: {
                permissionObjects: permissions
              }
            }
          },
          lengths

        ];
      }
      function makeCopyRequestAsync(request, expectedCollectionLengths) {
        try {
          let newWs;
          let res;

          it(`should post successfully`, async function () {
            res = await agent.post(baseUrl).send(request);
            expect(res).to.exist;
          });
          if (isStudent) {
            it(`should return 403 error`, function () {
              expect(res).to.have.status(403);
              return;
            });
          } else {
            it('should return with status 200 and newly created workspace id', function () {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('copyWorkspaceRequest');
              expect(res.body.copyWorkspaceRequest.createdWorkspace).to.exist;
            });
            it(`original workspace should not have been modified`, async function () {
              expect(await areRecordsEqual('Workspace', originalWs, originalWs._id)).to.be.true;
            });

            it(`new workspace should be found in database`, async function () {
              newWs = await models.Workspace.findById(res.body.copyWorkspaceRequest.createdWorkspace).lean().exec();
              expect(newWs).to.exist;
            });

            it(`new Workspace collections should be expected lengths`, function () {
              const { owner, name, mode, submissions, folders, taggings, selections, comments, responses, permissions, sourceWorkspace } = newWs;
              const tuples = [
                [submissions, expectedCollectionLengths.submissions],
                [folders, expectedCollectionLengths.folders],
                [taggings, expectedCollectionLengths.taggings], [selections, expectedCollectionLengths.selections], [comments, expectedCollectionLengths.comments], [responses, expectedCollectionLengths.responses], [permissions, expectedCollectionLengths.permissions]
              ];
              checkLengths(tuples);
              expect(owner.toString()).to.eql(request.copyWorkspaceRequest.owner);
              expect(name).to.eql(request.copyWorkspaceRequest.name);
              expect(mode).to.eql(request.copyWorkspaceRequest.mode);
              expect(sourceWorkspace.toString()).to.eql(request.copyWorkspaceRequest.originalWsId);
            });
          }
        } catch (err) {
          throw err;
        }
      }
      before(async function () {
        try {
          await helpers.setup(agent, username, password);
          mongoose.connect('mongodb://localhost:27017/encompass_seed');

        } catch (err) {
          console.log(err);
        }
      });

      after(() => {
        mongoose.connection.close();
        agent.close();
      });
      describe('Shallow Requests', function () {
        describe('Copying All Submissions', function () {
          describe('Not Including Folders', function () {
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,

                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as editor', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs);
              makeCopyRequestAsync(request, lengths);
            });
          });

          describe('Including Folders', function () {
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, null, true);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,

                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, null, true);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as editor', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, null, true);
              makeCopyRequestAsync(request, lengths);


            });
          });

        });

        describe('Copying Subset of Submissions', function () {
          describe('Not Including Folders', function () {
            describe('Current user as owner', function () {
              let answerIds = ["5bec35898c73047613e2f34b"];

              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, answerIds);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as owner', function () {
              let answerIds = ["5bec35898c73047613e2f34b"];

              let settings = {
                newOwnerId: studentOwner,

                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, answerIds);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as editor', function () {
              let answerIds = ["5bec35898c73047613e2f34b"];

              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, answerIds);
              makeCopyRequestAsync(request, lengths);
            });
          });

          describe('Including Folders', function () {
            describe('Current user as owner', function () {
              let answerIds = ["5bec35898c73047613e2f34b"];

              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, answerIds, true);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as owner', function () {
              let answerIds = ["5bec35898c73047613e2f34b"];

              let settings = {
                newOwnerId: studentOwner,

                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, answerIds, true);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as editor', function () {
              let answerIds = ["5bec35898c73047613e2f34b"];

              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, answerIds, true);
              makeCopyRequestAsync(request, lengths);
            });
          });

        });
      });

      describe('Deep Clone Requests', function () {
        describe('Copying All Submissions', function () {
          describe('Including Folders', function () {
            let expectedLengths = {
              taggings: originalWs.taggings.length,
              selections: originalWs.selections.length,
              comments: originalWs.comments.length,
              responses: originalWs.responses.length
            };
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              //         let { taggings, selections, comments, responses } = expectedLengths;


              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,
                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as editor', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths);
              makeCopyRequestAsync(request, lengths);


            });
          });
          describe('Not Including Folders', function () {
            let expectedLengths = {
              taggings: 0,
              selections: originalWs.selections.length,
              comments: originalWs.comments.length,
              responses: originalWs.responses.length
            };
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              //         let { taggings, selections, comments, responses } = expectedLengths;


              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, null, false);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,
                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, null, false);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as editor', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'
                }]
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, null, false);
              makeCopyRequestAsync(request, lengths);
            });
          });
        });
        describe('Copying Subset of Submissions', function () {
          let answerIds = ["5bb813fc9885323f6d894972"];
          describe('Including Folders', function () {
            let expectedLengths = {
              taggings: 2,
              selections: 2,
              comments: 2,
              responses: 1
            };
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              //         let { taggings, selections, comments, responses } = expectedLengths;


              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, answerIds);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,
                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, answerIds);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as editor', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, answerIds);
              makeCopyRequestAsync(request, lengths);


            });
          });
          describe('Not Including Folders', function () {
            let expectedLengths = {
              taggings: 0,
              selections: 2,
              comments: 2,
              responses: 1
            };
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };

              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, answerIds, false);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,
                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, answerIds, false);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as editor', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'
                }]
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, answerIds, false);
              makeCopyRequestAsync(request, lengths);
            });
          });
        });
      });
    });
  }

  return Promise.all(_.map(testUsers, (testUser, key) => {
    return runTests(testUser);
  }));
});


