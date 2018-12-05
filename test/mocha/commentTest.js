// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/comments/";

chai.use(chaiHttp);

describe('Comment CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Comment CRUD operations as ${user.details.testDescriptionTitle}`, function(){
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleCommentCount, inaccessibleComment,  accessibleComment, validComment, modifiableComment } = user.comments;

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


      describe('/GET comments', () => {
        it('should get all comments', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.comments).to.be.a('array');
            expect(res.body.comments).to.have.lengthOf(accessibleCommentCount);
            if (accessibleCommentCount > 0) {
              expect(res.body.comments[0]).to.have.any.keys('label', 'ancestors', 'children', 'text');
            }
            done();
          });
        });
      });
      if (accountType !== 'A') {
        describe('/GET inaccessible comment by id', () => {
          it('should return 403 error', done => {
            const url = baseUrl + inaccessibleComment._id;
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
        describe('/GET accessible comment by id', () => {
          it('should get one comment with matching id', done => {
            const url = baseUrl + accessibleComment._id;
            agent
            .get(url)
            .end((err, res) => {
              if (err) {
                console.log(err);
              }
              expect(res).to.have.status(200);
              expect(res.body.comment).to.have.any.keys('label', 'text', 'submission', 'workspace');
              expect(res.body.comment._id).to.eql(accessibleComment._id);
              done();
            });
          });
        });
      }


       /** POST **/

        describe('/POST valid comment', () => {
          let msg = 'should post a new comment';
          if (isStudent) {
            msg = 'should return 403 error';
          }
          it(msg, done => {
            agent
            .post(baseUrl)
            .send({comment: validComment})
            .end((err, res) => {
              if (err) {
                console.log(err);
              }
              if (isStudent) {
                expect(res).to.have.status(403);
                done();
              } else {
                expect(res).to.have.status(200);
                expect(res.body.comment.text).to.eql(validComment.text);
                done();
              }
            });
          });
        });

        xdescribe('/PUT update comment text', () => {
          let changeTextMsg = 'should change the text field to "this is a test"';
          let failMissingFieldsMsg= 'should fail to update because of missing required fields';
          let commentId;

          if (isStudent) {
            changeTextMsg = 'should return 403 error';
            failMissingFieldsMsg = 'should return 403 error';
            commentId = '53e37a4ab48b12793f00104c';
          } else {
            commentId = accessibleComment._id;
          }
          it(changeTextMsg, done => {
            const url = baseUrl + commentId;
            let body;
            if (isStudent) {
              body = validComment;
            } else {
              body = modifiableComment;
              body.text = 'new test text';
            }
            // copy the comment and update it
            agent
            .put(url)
            .send({comment: body})
            .end((err, res) => {
              if (err) {
                console.log(err);
              }
              if (isStudent) {
                expect(res).to.have.status(403);
                done();
              } else {
                expect(res).to.have.status(200);
                expect(res.body.comment.text).to.eql('new test text');
                done();
              }
            });
          });
          it(failMissingFieldsMsg, done => {
            let commentId;
            if (isStudent) {
              commentId = '53e37a4ab48b12793f00104c';
            } else {
              commentId = modifiableComment._id;
            }
            const url = baseUrl + commentId;

            // copy the comment and update it
            agent
            .put(url)
            .send({comment: {
              workspace: validComment.workspace,
              // Missing submission field will cause the failure as expected
              selection: validComment.workspace,
              text: 'new test text'
            }})
            .end((err, res) => {
              if (err) {
                console.log(err);
              }

              expect(res).to.have.status(400);
              done();

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

