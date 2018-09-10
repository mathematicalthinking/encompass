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

xdescribe('User CRUD operations as admin', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);

  before(async function(){
    try {
      await helpers.setup(agent);
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
        console.log('res get users admin', res.body.user.map(obj => obj.username));
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('user');
        expect(res.body.user).to.be.a('array');
        expect(res.body.user.length).to.eql(33);
        done();
      });
    });
  });

  /** GET **/
  describe('/GET user by username', () => {
    it('should return user with the username "rick"', done => {
      agent
      .get(baseUrl)
      .query('username=rick')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('user');
        expect(res.body.user).to.be.a('array');
        expect(res.body.user[0].username).to.eql('rick');
        done();
      });
    });
  });

  /** GET **/
  describe('/GET user by id', () => {
    it('should return the user "steve"', done => {
      const url = baseUrl + fixtures.user._id;
      agent
      .get(url)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('user');
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.username).to.eql('steve');
        done();
      });
    });
  });


  /** POST **/
  xdescribe('/POST user', () => {
    it('should post a new user', done => {
      agent
      .post(baseUrl)
      .send({user: fixtures.user.validUser})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user).to.have.any.keys('username');
        expect(res.body.user.username).to.eql('testUser3');
        done();
      });
    });
  });

  describe('/PUT update user name', () => {
    it('should change steves name from null to test name', done => {
      const url = baseUrl + fixtures.user._id;
      agent
      .put(url)
      .send({
        user: {
          'name': 'test name',
          'username': fixtures.user.validUser.username,
          'accountType': fixtures.user.validUser.accountType,
        }
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user.username).to.eql('steve');
        expect(res.body.user.name).to.eql('test name');
        done();
      });
    });
  });

  /** PUT addSection **/
  // xdescribe('/PUT add section', () => {
  //   it('should add a section to the user steve', done => {
  //     const url = baseUrl + 'addSection/' + fixtures.user._id;
  //     agent
  //     .put(url)
  //     .send({section: {sectionId: fixtures.section._id, role: "teacher"}})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys("sections");
  //       expect(res.body.user.sections[0]).to.eql({role:'teacher', sectionId: fixtures.section._id});
  //       done();
  //     });
  //   });
  // });

  // /** PUT removeSection **/
  // xdescribe('/PUT remove section', () => {
  //   it('should remove the section we just added', done => {
  //     const url = baseUrl + 'removeSection/' + fixtures.user._id;
  //     agent
  //     .put(url)
  //     .send({sectionId: fixtures.section._id})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys("sections");
  //       expect(res.body.user.sections).to.not.include(fixtures.section._id);
  //       done();
  //     });
  //   });
  // });

  /** PUT addAssignment **/
  // xdescribe('/PUT add assignment', () => {
  //   it('should add an assignment to the user steve', done => {
  //     const url = baseUrl + 'addAssignment/' + fixtures.user._id;
  //     agent
  //     .put(url)
  //     .send({assignment: fixtures.assignment})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys("assignments");
  //       expect(res.body.user.assignments[0].problemId).to.eql(fixtures.assignment.problemId);
  //       done();
  //     });
  //   });
  // });

  /** PUT removeAssignment **/
  // xdescribe('/PUT remove assignment', () => {
  //   it('should remove the assignment we just added', done => {
  //     const url = baseUrl + 'removeAssignment/' + fixtures.user._id;
  //     agent
  //     .put(url)
  //     .send({assignment: fixtures.assignment})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys("assignments");
  //       expect(res.body.user.assignments).to.not.include(fixtures.assignment);
  //       done();
  //     });
  //   });
  // });
});

describe('User CRUD operations as Teacher with actingRole teacher', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);
  const { username, password, organization, unaccessibleUser, accessibleUser, accessibleUserCount } = userFixtures.teacherMT;

  console.log('accessibleUser', accessibleUser);
  console.log('type', username );

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

    describe('/GET user by id', () => {
      it('should return the user "teachertaylor"', done => {
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

    describe('/GET createdBy from an accessible user', () => {
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


    /** POST **/
    xdescribe('/POST user', () => {
      it('should post a new user', done => {
        agent
        .post(baseUrl)
        .send({user: fixtures.user.validUser})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user).to.have.any.keys('username');
          expect(res.body.user.username).to.eql('testUser3');
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

    describe('/PUT update user name', () => {
      it('should change steves name from null to test name', done => {
        const url = baseUrl + accessibleUser._id;
        agent
        .put(url)
        .send({
          user: {
            'name': 'test name',
            'username': accessibleUser.username,
            'accountType': accessibleUser.accountType,
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user.username).to.eql(accessibleUser.username);
          expect(res.body.user.name).to.eql('test name');
          done();
        });
      });
    });
});

describe('User CRUD operations as PdAdmin', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);

  const { username, password, organization, unaccessibleUser, accessibleUser, accessibleUserCount } = userFixtures.pdAdminDrexel;

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
        const orgUsers = users.filter(user => user.organization === organization);

        // checking that all users returned are from PdAdmins org
        expect(users.length).to.eql(orgUsers.length);

        expect(res.body.user.length).to.eql(accessibleUserCount);
        done();
      });
    });
  });

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

    // admin from same org, also creator
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

    // student from same org
    describe('/GET user by id', () => {
      it('should return the user "sam3"', done => {
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

    // describe('/GET createdBy from an accessible user', () => {
    //   it('should return the user "rick"', done => {
    //     const url = baseUrl + '5b245760ac75842be3189525';
    //     agent
    //     .get(url)
    //     .end((err, res) => {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.have.all.keys('user');
    //       expect(res.body.user).to.be.a('object');
    //       expect(res.body.user.username).to.eql('rick');
    //       done();
    //     });
    //   });
    // });


    /** POST **/
    xdescribe('/POST user', () => {
      it('should post a new user', done => {
        agent
        .post(baseUrl)
        .send({user: fixtures.user.validUser})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user).to.have.any.keys('username');
          expect(res.body.user.username).to.eql('testUser3');
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

    describe('/PUT update accessible user name', () => {
      it('should change sam3s name from null to test name', done => {
        const url = baseUrl + accessibleUser._id;
        agent
        .put(url)
        .send({
          user: {
            'name': 'test name',
            'username': accessibleUser.username,
            'accountType': accessibleUser.accountType,
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.user.username).to.eql('sam3');
          expect(res.body.user.name).to.eql('test name');
          done();
        });
      });
    });
});
