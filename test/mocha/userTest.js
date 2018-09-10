// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('underscore');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/users/";

chai.use(chaiHttp);

describe('User CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`User CRUD operations as accountType: ${user.accountType}` , function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, modifiableUser, unaccessibleUser, accessibleUser, accessibleUserCount } = user;

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
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('user');
            expect(res.body.user).to.be.a('array');

            const users = res.body.user;
            // const orgUsers = users.filter(user => user.organization === organization);

            // // checking that all users returned are from teachers org
            // expect(users.length).to.eql(orgUsers.length);

            expect(res.body.user.length).to.eql(accessibleUserCount);
            done();
          });
        });
      });
      if (user.accountType !== 'A') {
        /** GET **/
        describe('/GET unaccessible user by username', () => {
          it('should return 403 error', done => {
            agent
            .get(baseUrl)
            .query(`username=${unaccessibleUser.username}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('user');
              expect(res.body.user).to.be.a('array');
              expect(res.body.user.length).to.eql(0);
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
              expect(res).to.have.status(403);
              done();
            });
          });
        });


      }

        describe('/GET accessible user by username', () => {
          it('should return user with the username "rick"', done => {
            agent
            .get(baseUrl)
            .query(`username=${accessibleUser.username}`)
            .end((err, res) => {
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
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('user');
              expect(res.body.user).to.be.a('object');
              expect(res.body.user.username).to.eql(accessibleUser.username);
              done();
            });
          });
        });

        xdescribe('/GET createdBy from an accessible user', () => {
          it('should return the user "rick"', done => {
            const url = baseUrl + accessibleUser.createdBy;
            agent
            .get(url)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('user');
              expect(res.body.user).to.be.a('object');
              expect(res.body.user.username).to.eql('rick');
              done();
            });
          });
        });

        describe('/PUT update user name', () => {
          it('should change steves name from null to test name', done => {
            const url = baseUrl + modifiableUser._id;
            agent
            .put(url)
            .send({
              user: {
                'name': 'test name',
                'username': modifiableUser.username,
                'accountType': modifiableUser.accountType,
              }
            })
            .end((err, res) => {
              if (user.accountType === 'S') {
                expect(res).to.have.status(403);
                done();
                return;
              }
              expect(res).to.have.status(200);
              expect(res.body.user.username).to.eql(modifiableUser.username);
              expect(res.body.user.name).to.eql('test name');
              done();
            });
          });
        });
    });
  }

  for (let user of Object.keys(testUsers)) {
    let testUser = testUsers[user];
    await runTests(testUser);
  }
});

