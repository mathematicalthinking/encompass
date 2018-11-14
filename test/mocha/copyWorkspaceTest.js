// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');
const fixtures = require('./fixtures/copyWorkspace');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/cloneWorkspace/";

chai.use(chaiHttp);
// [[prop, expectedValue]]
function checkLengths(tuples) {
  _.each(tuples, (tuple) => {
    expect(tuple[0]).to.have.lengthOf(tuple[1]);
  });
}



describe(`Copy Workspace operations by account type`, async function() {
  const testUsers = userFixtures.users;
    /*
    options: {
      wsId: oId,
      owner: oId,
      name: string
      isShallow: bool,
      isFullDeepClone: bool,
      answerOptions: {
        "all": bool,
        "none": bool,
        answerIds: [ oIds ]
      }
      folderOptions: {
        includeStructureOnly: bool,
        folderSetOptions: {
          doCreateFolderSet: bool,
          name: string,
          privacySetting: "M" or "E" or "O"
        },
        "all": bool,
        "none": bool,
        "folderIds": [ oIds ]
      },
      selectionOptions: {
        "all": bool,
        "none": bool,
        "selectionIds": [oIds]
      },
      commentOptions: {
        "all": bool,
        "none": bool,
        "commentIds": [oIds]
      },
      responseOptions: {
        "all": bool,
        "none": bool,
        "responseIds": [ oIds ]
      }
    }
    */

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

      function isOriginalRecordUnaltered(model, originalId, originalJSON, callback) {
        it('should return 403 error', done => {
          const url = `/api/${model}s/${originalId}`;
          agent
          .get(url)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            expect(res).to.have.status(200);
            expect(res).to.have.all.keys(model);
            expect(res.body[model]).to.be.a('object');

            const fetchedRecord = res.body[model];
            let isEqual = _.isEqual(fetchedRecord, originalJSON);
            console.log('isEqual', isEqual);
            done();
          });
          callback();
      });
      }

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
        describe('Basic shallow request', function() {
          const request = {
            originalWsId: baseWsId,

            optionsHash: {
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
            it('should post request successfully', done => {
              agent
              .post(baseUrl)
              .send(request)
              .end((err, res) => {
                if (err) {
                  console.log('err', err);
                } else if (isStudent) {
                  expect(res).to.have.status(403);
                  done();
                } else {
                  expect(res).to.have.status(200);
                  expect(res.body).to.have.all.keys('workspace');
                  const workspace = res.body.workspace;
                  const { owner, name, mode, submissions, folders, taggings, selections, comments, responses } = workspace;
                  const tuples = [
                    [submissions, originalWs.submissions.length ],
                    [folders, originalWs.folders.length ],
                    [taggings, 0], [selections, 0], [comments, 0], [responses, 0]
                  ];
                  checkLengths(tuples);
                  expect(owner).to.eql(newWsOwner);
                  expect(name).to.eql(newWsName);
                  done();
                }

              });
            });



        });

        describe('Basic Deep Clone Workspace', function() {
          const request = {
            originalWsId: baseWsId,

            optionsHash: {
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
               none: true
              }
            }

          };
            it('should post request successfully', done => {
              agent
              .post(baseUrl)
              .send(request)
              .end((err, res) => {
                if (err) {
                  console.log('err', err);
                } else if (isStudent) {
                  expect(res).to.have.status(403);
                  done();
                } else {
                  expect(res).to.have.status(200);
                  expect(res.body).to.have.all.keys('workspace');
                  const workspace = res.body.workspace;
                  console.log('res ws', workspace);
                  const { owner, name, mode, submissions, folders, taggings, selections, comments, responses } = workspace;
                  const tuples = [
                    [submissions, originalWs.submissions.length ],
                    [folders, originalWs.folders.length ],
                    [taggings, originalWs.taggings.length], [selections, originalWs.selections.length], [comments, originalWs.comments.length], [responses, 0]
                  ];
                  checkLengths(tuples);
                  expect(owner).to.eql(newWsOwner);
                  expect(name).to.eql(newWsName);
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

