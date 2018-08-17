// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/users/";

chai.use(chaiHttp);

describe('User CRUD operations', function() {
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
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('user');
        expect(res.body.user).to.be.a('array');
        expect(res.body.user.length).to.be.above(0);
        done();
      });
    });
  });

  /** GET **/
  describe('/GET user by username', () => {
    it('should return user with the username "steve"', done => {
      agent
      .get(baseUrl)
      .query('username=steve')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('user');
        expect(res.body.user).to.be.a('object');
        expect(res.body.user.username).to.eql('steve');

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
      .send({user: {'name': 'test name'}})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user.username).to.eql('steve');
        expect(res.body.user.name).to.eql('test name');
        done();
      });
    });
  });

  /** PUT addSection **/
  describe('/PUT add section', () => {
    it('should add a section to the user steve', done => {
      const url = baseUrl + 'addSection/' + fixtures.user._id;
      agent
      .put(url)
      .send({section: {sectionId: fixtures.section._id, role: "teacher"}})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user).to.have.any.keys("sections");
        expect(res.body.user.sections[0]).to.eql({role:'teacher', sectionId: fixtures.section._id});
        done();
      });
    });
  });

  /** PUT removeSection **/
  describe('/PUT remove section', () => {
    it('should remove the section we just added', done => {
      const url = baseUrl + 'removeSection/' + fixtures.user._id;
      agent
      .put(url)
      .send({sectionId: fixtures.section._id})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user).to.have.any.keys("sections");
        expect(res.body.user.sections).to.not.include(fixtures.section._id);
        done();
      });
    });
  });

  /** PUT addAssignment **/
  describe('/PUT add assignment', () => {
    xit('should add an assignment to the user steve', done => {
      const url = baseUrl + 'addAssignment/' + fixtures.user._id;
      agent
      .put(url)
      .send({assignment: fixtures.assignment})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user).to.have.any.keys("assignments");
        expect(res.body.user.assignments[0].problemId).to.eql(fixtures.assignment.problemId);
        done();
      });
    });
  });

  /** PUT removeAssignment **/
  describe('/PUT remove assignment', () => {
    xit('should remove the assignment we just added', done => {
      const url = baseUrl + 'removeAssignment/' + fixtures.user._id;
      agent
      .put(url)
      .send({assignment: fixtures.assignment})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user).to.have.any.keys("assignments");
        expect(res.body.user.assignments).to.not.include(fixtures.assignment);
        done();
      });
    });
  });
});
