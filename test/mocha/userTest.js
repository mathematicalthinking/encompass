// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/users/";

chai.use(chaiHttp);

describe('User CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  async function runTests(user) {
    await describe(`User CRUD operations as ${user.details.testDescriptionTitle}` , function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole, _id, name } = user.details;
      const { modifiableUser, unaccessibleUser, accessibleUser, accessibleUserCount, outsideCollab, outsideStudent } = user.users;
      const isStudent = accountType === 'S' || actingRole === 'S';
      const defaultSelfPutBody = {
        user: {
          username,
          accountType,
        }
      };

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

      describe('/GET users', () => {
        it('should get all users', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('user');
            expect(res.body.user).to.be.a('array');
            expect(res.body.user.length).to.eql(accessibleUserCount);
            done();
          });
        });
      });
      if (accountType !== 'A' && accountType !== 'P') {
        /** GET **/
        // Users can now get any user if they know exact username
        // check for which info should be sent back?
        xdescribe('/GET unaccessible user by username', () => {
          xit('should return 404 error', done => {
            agent
            .get(baseUrl)
            .query(`username=${unaccessibleUser.username}`)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(404);
              done();
            });
          });
        });

        /** GET **/
        describe('/GET unaccessible user by id', () => {
          it('should return 403 error', done => {
            const url = baseUrl + unaccessibleUser._id;
            agent
            .get(url)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(403);
              done();
            });
          });
        });

        describe('/PUT update unaccessible user name', () => {
          it('should return 403 error', done => {
            const url = baseUrl + unaccessibleUser._id;
            agent
            .put(url)
            .send({
              user: {
                'name': 'test name',
                'username': unaccessibleUser.username,
                'accountType': unaccessibleUser.accountType,
              }
            })
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(403);
              done();
            });
          });
        });


      }

        describe('/GET accessible user by username', () => {
          it(`should return user with the username "${accessibleUser.username}"`, done => {
            agent
            .get(baseUrl)
            .query(`username=${accessibleUser.username}`)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('user');
              expect(res.body.user).to.be.a('array');
              expect(res.body.user[0].username).to.eql(accessibleUser.username);
              done();
            });
          });
        });



        describe('/GET user by id', () => {
          it(`should return the user "${accessibleUser.username}"`, done => {
            const url = baseUrl + accessibleUser._id;
            agent
            .get(url)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('user');
              expect(res.body.user).to.be.a('object');
              expect(res.body.user.username).to.eql(accessibleUser.username);
              done();
            });
          });
        });

        describe('/GET createdBy from an accessible user', () => {
          it(`should return the user "${accessibleUser.creatorUsername}"`, done => {
            const url = baseUrl + accessibleUser.createdBy;
            agent
            .get(url)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('user');
              expect(res.body.user).to.be.a('object');
              expect(res.body.user.username).to.eql(accessibleUser.creatorUsername);
              done();
            });
          });
        });

        describe('/GET createdBy from a public problem', () => {
          const problem = userFixtures.publicProblem;
          it(`should return the user "${problem.creatorUsername}"`, done => {
            const url = baseUrl + problem.createdBy;
            agent
            .get(url)
            .end((err, res) => {
              if (err) {
                console.error(err);
              }
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('user');
              expect(res.body.user).to.be.a('object');
              expect(res.body.user.username).to.eql(problem.creatorUsername);
              done();
            });
          });
        });

        describe('/PUT update user name', () => {
          let description;
          let newName = 'test name';
          if (accountType === 'S' || actingRole === 'student') {
            description = 'name should remain the same';
            newName = name;
          } else {
            description = `should change ${modifiableUser.username}'s name from null to test name`;
          }
          it(description, done => {
            const url = baseUrl + modifiableUser._id;
            agent
            .put(url)
            .send({
              user: {
                'name': newName,
                'username': modifiableUser.username,
                'accountType': modifiableUser.accountType,
              }
            })
            .end((err, res) => {
              if (err) {
                console.error(err);
              }

              expect(res).to.have.status(200);
              expect(res.body.user.username).to.eql(modifiableUser.username);
              expect(res.body.user.name).to.eql(newName);
              done();
            });
          });
        });

        describe('Put request to update acting role', function() {
          let description;
          let newRole;
          if (accountType === 'S') {
            description = 'actingRole should not change';
            newRole = 'teacher';
          } else if (actingRole === 'student') {
            description = 'should toggle actingRole back to teacher';
            newRole = 'teacher';
          } else {
            description = 'should toggle actingRole to student';
            newRole = 'student';
          }

          it(description, done => {
            const url = baseUrl + user.details._id;
            agent
            .put(url)
            .send({
              user: {
                username,
                accountType,
                actingRole: newRole
              }
            })
            .end((err, res) => {
              if (err) {
                console.log(err);
              }
              if (accountType === 'S') {
                expect(res).to.have.status(200);
                expect(res.body.user.actingRole).to.not.exist;

                done();
              } else {
                expect(res).to.have.status(200);
                expect(res.body.user.actingRole).to.eql(newRole);
                done();
              }
            });
          });
        });

        describe('Modifying your own account type', function() {
          beforeEach(async function(){
            try {
              await helpers.setup(agent, username, password);
            }catch(err) {
              console.log(err);
            }
          });
          xdescribe('Setting account type to "S"', function() {
            let putBody = {...defaultSelfPutBody};
            putBody.user.accountType = 'S';
            let status = 200;
            let res;
            if (isStudent) {
              status = 403;
            }
            it(`should return status ${status}`, async function() {
              res = await agent.put(baseUrl + _id).send(putBody);
              expect(res).to.have.status(status);
            });

            if (!isStudent) {
              it('Users account type should now be "S"', function() {
                expect(res.body.user.accountType).to.eql('S');
              });
            }

          });
          describe('Setting account type to "A"', function() {
            let description = 'account type should remain the same';

            it(description, async function() {
              let putBody = {...defaultSelfPutBody};
            putBody.user.accountType = 'A';

            let res;
            let newAccountType = accountType;

              res = await agent.put(baseUrl + _id).send(putBody);
              expect(res).to.have.status(200);
              expect(res.body.user.accountType).to.eql(newAccountType);
            });
          });

          describe('Setting account type to "P"', function() {
            let description = 'it should change account type to "P"';

            it(description, async function() {
              let putBody = {...defaultSelfPutBody};
              putBody.user.accountType = 'P';
              let newAccountType = 'P';
              let res;

              if (accountType !== 'A' || isStudent) {
                description = 'account type should remain the same';
                newAccountType = accountType;
              }
              res = await agent.put(baseUrl + _id).send(putBody);
              expect(res).to.have.status(200);
              expect(res.body.user.accountType).to.eql(newAccountType);
            });
          });
          describe('Setting account type to "T"', function() {
            let description = 'it should change account type to "T"';

            it(description, async function() {
              let putBody = {...defaultSelfPutBody};
              putBody.user.accountType = 'T';
              let newAccountType = 'T';
              let res;

              if (isStudent) {
                description = 'account type should remain the same';
                newAccountType = accountType;
              }
              res = await agent.put(baseUrl + _id).send(putBody);
              expect(res).to.have.status(200);
              expect(res.body.user.accountType).to.eql(newAccountType);
            });
          });
        });

        //outside org, not owner, creator, editor, etc of any workspace you have access to

          describe('Accessing a workspace collaborator who is outside your org', function() {
            it('should be able to access', function(done) {
              agent
              .get(baseUrl + outsideCollab._id)
              .end((err, res) => {
                if (err) {
                  console.error(err);
                  done();
                } else {
                  expect(res).to.have.status(200);
                  expect(res.body).to.have.all.keys('user');
                  expect(res.body.user).to.be.an('object');
                  expect(res.body.user.username).to.eql(outsideCollab.username);
                  done();
                }
              });
            });
          });
          if (outsideStudent) {
            describe('Accessing a student (outisde org) from one of your sections', function() {
              it('should be able to access', function(done) {
                agent
                .get(baseUrl + outsideStudent._id)
                .end((err, res) => {
                  if (err) {
                    console.error(err);
                    done();
                  } else {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.all.keys('user');
                    expect(res.body.user).to.be.an('object');
                    expect(res.body.user.username).to.eql(outsideStudent.username);
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
    await runTests(testUser);
  }
});

