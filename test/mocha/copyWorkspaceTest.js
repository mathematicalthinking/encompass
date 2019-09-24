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
      // const isPdAdmin = username === 'pdadmin';
      // let baseWsId = originalWs._id;
      let newWsName = "New Cloned Workspace";
      // let newWsOwner = "5b9149552ecaf7c30dd4748e";
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
      function buildShallowRequest(settings, workspace, submissionIds = null, doIncludeFolders = false) {
        let { newOwnerId, newWsName, newMode, permissions, folderSetOptions } = settings;
        if (!Array.isArray(permissions)) {
          permissions = [];
        }

        let includeAllSubmissions;
        let subsLength;
        let foldersLength;

        if (Array.isArray(submissionIds)) {
          includeAllSubmissions = false;
          subsLength = submissionIds.length;
        } else {
          includeAllSubmissions = true;
          subsLength = workspace.submissions.length;
          submissionIds = [];
        }

        if (doIncludeFolders) {
          foldersLength = workspace.folders.length;
        } else {
          foldersLength = 0;
        }

        let fsOptions;

        if (folderSetOptions) {
          fsOptions = folderSetOptions;
        } else {
          fsOptions = {
            doCreateFolderSet: false,
          };
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
              submissionOptions: {
                all: includeAllSubmissions,
                submissionIds: submissionIds
              },
              folderOptions: {
                includeStructureOnly: true,
                folderSetOptions: fsOptions,
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

      function buildDeepCloneRequest(settings, workspace, expectedLengths, submissionIds = null, doIncludeFolders = true) {
        let { newOwnerId, newWsName, newMode, permissions, folderSetOptions } = settings;
        if (!Array.isArray(permissions)) {
          permissions = [];
        }

        let includeAllSubmissions;
        let subsLength;
        let foldersLength;

        let { taggings, selections, comments, responses } = expectedLengths;

        if (Array.isArray(submissionIds)) {
          includeAllSubmissions = false;
          subsLength = submissionIds.length;
        } else {
          includeAllSubmissions = true;
          subsLength = workspace.submissions.length;
          submissionIds = [];
        }

        if (doIncludeFolders) {
          foldersLength = workspace.folders.length;
        } else {
          foldersLength = 0;
        }

        let fsOptions;

        if (folderSetOptions) {
          fsOptions = folderSetOptions;
        } else {
          fsOptions = {
            doCreateFolderSet: false,
          };
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
              submissionOptions: {
                all: includeAllSubmissions,
                submissionIds: submissionIds
              },
              folderOptions: {
                includeStructureOnly: false,
                folderSetOptions: fsOptions,
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

      function buildCustomRequest(settings, workspace, customConfig, expectedLengths, existingFolderSetInfo) {
        let { newOwnerId, newWsName, newMode, permissions } = settings;

        if (!Array.isArray(permissions)) {
          permissions = [];
        }
        let { submissionOptions, folderOptions } = customConfig;
        let subsLength, foldersLength;

        if (submissionOptions.all === true) {
          subsLength = workspace.submissions.length;
        } else {
          subsLength = submissionOptions.submissionIds.length;
        }
        if (folderOptions.all === true) {
          foldersLength = workspace.folders.length;
        } else if (existingFolderSetInfo) {
          foldersLength = existingFolderSetInfo.numFolders;
        } else {
          foldersLength = 0;
        }

        let { taggings, selections, comments, responses } = expectedLengths;

        let lengths = {
          submissions: subsLength,
          taggings: taggings,
          selections: selections,
          comments: comments,
          responses: responses,
          folders: foldersLength,
          permissions: permissions.length
        };

        let customRequest = {};

        let target = {
          originalWsId: workspace._id,
          owner: newOwnerId,
          name: newWsName,
          mode: newMode,
          permissionOptions: {
            permissionObjects: permissions
          }
      };

        let combined = Object.assign(target, customConfig);
        customRequest.copyWorkspaceRequest = combined;
        return [
          customRequest,
          lengths
        ];
      }

      function makeCopyRequestAsync(request, expectedCollectionLengths, doExpectNewFolderSet) {
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

            if (doExpectNewFolderSet) {
              it('should have newly created Folder Set id on response', function() {
                expect(res.body.copyWorkspaceRequest.createdFolderSet).to.exist;
              });
            }
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
          mongoose.connect('mongodb://localhost:27017/encompass_seed', {useMongoClient: true});

        } catch (err) {
          throw(err);
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
            describe('Student as view only collab', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs);
              makeCopyRequestAsync(request, lengths);
            });
          });

          describe('Including Folders', function () {
            describe('Creating New Folder Set', function() {
              let settings = {
                newOwnerId: _id,

                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: [],
                folderSetOptions: {
                  doCreateFolderSet: true,
                  name: 'Test New Folder Set',
                  privacySetting: 'M'
                }
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, null, true);
              makeCopyRequestAsync(request, lengths, true);
            });
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
            describe('Student as view only collaborator', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'

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
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as owner', function () {
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: studentOwner,

                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as editor', function () {
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as view only collaborator', function () {
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds);
              makeCopyRequestAsync(request, lengths);
            });
          });

          describe('Including Folders', function () {
            describe('Current user as owner', function () {
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds, true);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as owner', function () {
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: studentOwner,

                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds, true);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as editor', function () {
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'editor'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds, true);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as view only collaborator', function () {
              let submissionIds = ["5bec36958c73047613e2f34d"];

              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'

                }]
              };
              let [request, lengths] = buildShallowRequest(settings, originalWs, submissionIds, true);
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
            // if (isPdAdmin) {
            //   expectedLengths.responses =
            // }
            describe('Creating New Folder Set', function() {
              let settings = {
                newOwnerId: _id,

                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: [],
                folderSetOptions: {
                  doCreateFolderSet: true,
                  name: 'Test New Folder Set',
                  privacySetting: 'M'
                }
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, null, true);
              makeCopyRequestAsync(request, lengths, true);
            });
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };

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
            describe('Student as view only collaborator', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'

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
            describe('Student as view only collaborator', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'
                }]
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, null, false);
              makeCopyRequestAsync(request, lengths);
            });
          });
        });
        describe('Copying Subset of Submissions', function () {
          let submissionIds = ["5bec36958c73047613e2f34c"];
          describe('Including Folders', function () {
            let expectedLengths = {
              taggings: 2,
              selections: 2,
              comments: 2,
              responses: 3
            };
            // if (isPdAdmin) {
            //   expectedLengths.responses = 2;
            // }
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };
              //         let { taggings, selections, comments, responses } = expectedLengths;


              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,
                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds);
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
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds);
              makeCopyRequestAsync(request, lengths);


            });
            describe('Student as view only collaborator', function () {
              let settings = {
                newOwnerId: _id,

                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'

                }]
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds);
              makeCopyRequestAsync(request, lengths);


            });
          });
          describe('Not Including Folders', function () {
            let expectedLengths = {
              taggings: 0,
              selections: 2,
              comments: 2,
              responses: 3
            };

            // if (isPdAdmin) {
            //   expectedLengths.responses = 2;
            // }
            describe('Current user as owner', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: newWsName,
                newMode: originalWs.mode,
                permissions: []
              };

              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds, false);
              makeCopyRequestAsync(request, lengths);
            });

            describe('Student as owner', function () {
              let settings = {
                newOwnerId: studentOwner,
                newWsName: `Tracy's copy`,
                newMode: originalWs.mode,
                permissions: []
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds, false);
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
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds, false);
              makeCopyRequestAsync(request, lengths);
            });
            describe('Student as view only collaborator', function () {
              let settings = {
                newOwnerId: _id,
                newWsName: `Tracy as Editor`,
                newMode: originalWs.mode,
                permissions: [{
                  user: studentOwner,
                  global: 'viewOnly'
                }]
              };
              let [request, lengths] = buildDeepCloneRequest(settings, originalWs, expectedLengths, submissionIds, false);
              makeCopyRequestAsync(request, lengths);
            });
          });
        });
      });

      describe('Custom Requests', function() {
        describe('Copying All Submissions', function () {
          describe('Including Folders', function () {
            describe('Including structure only', function() {
              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const associatedCommentIds = ["5bec375d8c73047613e2f35e","5bec37e38c73047613e2f366"];
                let expectedLengths = {
                  taggings: 0,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37708c73047613e2f35f","5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: commentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
            });
            describe('Including Folder Contents', function() {
              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: originalWs.taggings.length,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: originalWs.taggings.length,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: originalWs.taggings.length,
                  selections: originalWs.selections.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const associatedCommentIds = ["5bec375d8c73047613e2f35e","5bec37e38c73047613e2f366"];
                const associatedTaggingIds = ["5bec37f48c73047613e2f367", "5bec38338c73047613e2f36b"];
                let expectedLengths = {
                  taggings: associatedTaggingIds.length,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37708c73047613e2f35f","5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: originalWs.taggings.length,
                  selections: originalWs.selections.length,
                  comments: commentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
            });

          });

          describe('Not Including Folders', function() {
            describe('Using Existing Folder Set', function() {
              const folderSetInfo = {
                folderSetId: "5bec409176124a776f2ff00e",
                numFolders: 9
              };

              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: originalWs.responses.length,
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const associatedCommentIds = ["5bec375d8c73047613e2f35e","5bec37e38c73047613e2f366"];
                let expectedLengths = {
                  taggings: 0,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };

                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37708c73047613e2f35f","5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: commentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };

                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              });
            });
            describe('Not Using Existing Folder Set', function() {
              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: originalWs.responses.length,
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: originalWs.comments.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const associatedCommentIds = ["5bec375d8c73047613e2f35e","5bec37e38c73047613e2f366"];
                let expectedLengths = {
                  taggings: 0,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37708c73047613e2f35f","5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: 0,
                  selections: originalWs.selections.length,
                  comments: commentIds.length,
                  responses: originalWs.responses.length
                };

                let customConfig = {
                  submissionOptions: {
                    all: true,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
            });

          });
        });
        describe('Copying Subset of Submissions', function() {
          let submissionIds = [ "5bec36958c73047613e2f34d"];
          let allSelectionIds = ["5bec37838c73047613e2f361", "5bec37a78c73047613e2f365"];
          let allResponseIds = ["5bec6497aa4a927d50cd5b9b"];
          let allCommentIds = ["5bec37a08c73047613e2f364", "5bec37e38c73047613e2f366"];
          let allTaggingIds = ["5bec37f48c73047613e2f367","5bec38018c73047613e2f368"];
          describe('Including Folders', function () {
            describe('Including structure only', function() {
              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: allResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds,
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec37838c73047613e2f361"];
                const associatedCommentIds = ["5bec37a08c73047613e2f364"];
                const associatedResponseIds = ["5bec36958c73047613e2f34d"];
                let expectedLengths = {
                  taggings: 0,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: associatedResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: commentIds.length,
                  responses: allResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  includeStructureOnly: true,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
            });
            describe('Including Folder Contents', function() {
              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: allTaggingIds.length,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: allResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: allTaggingIds.length,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: allTaggingIds.length,
                  selections: allSelectionIds.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec37838c73047613e2f361"];
                const associatedCommentIds = ["5bec37a08c73047613e2f364"];
                const associatedResponseIds = ["5bec36958c73047613e2f34d"];
                const associatedTaggingIds = ["5bec38018c73047613e2f368"];
                let expectedLengths = {
                  taggings: associatedTaggingIds.length,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: associatedResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds,
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };

                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: allTaggingIds.length,
                  selections: allSelectionIds.length,
                  comments: commentIds.length,
                  responses: allResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  includeStructureOnly: false,
                  folderSetOptions: {
                    doCreateFolderSet: false,
                  },
                  all: true,
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };

                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
            });

          });

          describe('Not Including Folders', function() {
            describe('Using Existing Folder Set', function() {
              const folderSetInfo = {
                folderSetId: "5bec409176124a776f2ff00e",
                numFolders: 9
              };

              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: allResponseIds.length,
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec37838c73047613e2f361"];
                const associatedCommentIds = ["5bec37a08c73047613e2f364"];
                const associatedResponseIds = ["5bec36958c73047613e2f34d"];
                let expectedLengths = {
                  taggings: 0,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: associatedResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };

                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: commentIds.length,
                  responses: allResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: folderSetInfo.folderSetId,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };

                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths, folderSetInfo);
                makeCopyRequestAsync(request, lengths);
              });
              });
            });
            describe('Not Using Existing Folder Set', function() {
              describe('All Selections, Comments, and Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: allResponseIds.length,
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
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
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections and Comments with No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: allCommentIds.length,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('All Selections with No Comments and No Responses', function() {
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: 0,
                  responses: 0
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  none: true
                },
                responseOptions: {
                  none: true
                }
              };
                describe('Current user as owner', function () {
                  let settings = {
                    newOwnerId: _id,
                    newWsName: newWsName,
                    newMode: originalWs.mode,
                    permissions: []
                  };

                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });

                describe('Student as owner', function () {
                  let settings = {
                    newOwnerId: studentOwner,
                    newWsName: `Tracy's copy`,
                    newMode: originalWs.mode,
                    permissions: []
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
                describe('Student as view only collaborator', function () {
                  let settings = {
                    newOwnerId: _id,

                    newWsName: `Tracy as Editor`,
                    newMode: originalWs.mode,
                    permissions: [{
                      user: studentOwner,
                      global: 'viewOnly'

                    }]
                  };
                  let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                  makeCopyRequestAsync(request, lengths);
                });
              });
              describe('Subset of selections with all comments/responses', function() {
                const selectionIds = ["5bec37838c73047613e2f361"];
                const associatedCommentIds = ["5bec37a08c73047613e2f364"];
                const associatedResponseIds = ["5bec36958c73047613e2f34d"];
                let expectedLengths = {
                  taggings: 0,
                  selections: selectionIds.length,
                  comments: associatedCommentIds.length,
                  responses: associatedResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: false,
                  selectionIds
                },
                commentOptions: {
                  all: true,

                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };

                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
              describe('Subset of comments with all selections/responses', function() {
                // const selectionIds = ["5bec373d8c73047613e2f35c", "5bec37a78c73047613e2f365"];
                const commentIds = ["5bec37a08c73047613e2f364"];
                let expectedLengths = {
                  taggings: 0,
                  selections: allSelectionIds.length,
                  comments: commentIds.length,
                  responses: allResponseIds.length
                };

                let customConfig = {
                  submissionOptions: {
                    submissionIds,
                },
                folderOptions: {
                  folderSetOptions: {
                    existingFolderSetToUse: null,
                  },
                  all: false,
                  none: true
                },
                selectionOptions: {
                  all: true
                },
                commentOptions: {
                  all: false,
                  commentIds
                },
                responseOptions: {
                  all: true
                }
              };
              describe('Current user as owner', function () {
                let settings = {
                  newOwnerId: _id,
                  newWsName: newWsName,
                  newMode: originalWs.mode,
                  permissions: []
                };
                //         let { taggings, selections, comments, responses } = expectedLengths;


                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });

              describe('Student as owner', function () {
                let settings = {
                  newOwnerId: studentOwner,
                  newWsName: `Tracy's copy`,
                  newMode: originalWs.mode,
                  permissions: []
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
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
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              describe('Student as view only collaborator', function () {
                let settings = {
                  newOwnerId: _id,

                  newWsName: `Tracy as Editor`,
                  newMode: originalWs.mode,
                  permissions: [{
                    user: studentOwner,
                    global: 'viewOnly'

                  }]
                };
                let [request, lengths] = buildCustomRequest(settings, originalWs, customConfig, expectedLengths);
                makeCopyRequestAsync(request, lengths);
              });
              });
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


