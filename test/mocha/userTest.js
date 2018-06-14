const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=superuser; EncAuth=test-admin-key';
const baseUrl = "/api/users/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

describe('User CRUD operations', function() {
  this.timeout('7s');
  before(async function() {
    await dbSetup.prepTestDb();
  });
  // describe('/GET users', () => {
  //   it('should get all users', done => {
  //     chai.request(host)
  //     .get(baseUrl)
  //     .set('Cookie', userCredentials)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.have.all.keys('user');
  //       expect(res.body.user).to.be.a('array');
  //       expect(res.body.user.length).to.be.above(0);
  //       done();
  //     });
  //   });
  // });
  //
  // /** GET **/
  // describe('/GET user by name', () => {
  //   it('should return all users with the name "steve"', done => {
  //     chai.request(host)
  //     .get(baseUrl)
  //     .set('Cookie', userCredentials)
  //     .query('name=steve')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.have.all.keys('user');
  //       expect(res.body.user).to.be.a('array');
  //       res.body.user.forEach(user => {
  //         expect(user.username).to.have.string('steve');
  //       });
  //       done();
  //     });
  //   });
  // });
  //
  // /** GET **/
  // describe('/GET user by id', () => {
  //   it('should return the user "steve"', done => {
  //     const url = baseUrl + fixtures.user._id;
  //     chai.request(host)
  //     .get(url)
  //     .set('Cookie', userCredentials)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.have.all.keys('user');
  //       expect(res.body.user).to.be.a('object');
  //       expect(res.body.user.username).to.eql('steve');
  //       done();
  //     });
  //   });
  // });
  //
  //
  // /** POST NB this test fails now cause we're not resetting the db
  // When db updating is implemented delete the expect statement
  // and then uncomment the remaining expect statements
  // **/
  // describe('/POST user', () => {
  //   it('should post a new user', done => {
  //     chai.request(host)
  //     .post(baseUrl)
  //     .set('Cookie', userCredentials)
  //     .send({user: fixtures.user.validUser})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys('username');
  //       expect(res.body.user.username).to.eql('testUser');
  //       done();
  //     });
  //   });
  // });
  // // PUT USER ROUTE DOES NOT SEEM TO BE WORKING!
  describe('/PUT update user name', () => {
    it('should change steves name from null to test name', done => {
      const url = baseUrl + fixtures.user._id;
      chai.request(host)
      .put(url)
      .set('Cookie', userCredentials)
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
      chai.request(host)
      .put(url)
      .set('Cookie', userCredentials)
      .send({sectionId: fixtures.section._id, role: "teacher"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.user).to.have.any.keys("sections");
        console.log(res.body.user.sections);
        expect(res.body.user.sections[0]).to.eql({role:'teacher', sectionId: fixtures.section._id});
        done();
      });
    });
  });

  // /** PUT removeSection **/
  // describe('/PUT remove section', () => {
  //   it('should remove the section we just added', done => {
  //     const url = baseUrl + 'removeSection/' + fixtures.user._id;
  //     chai.request(host)
  //     .put(url)
  //     .set('Cookie', userCredentials)
  //     .send({section: fixtures.user.section})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys("sections");
  //       expect(res.body.user.sections).to.not.include(fixtures.user.section);
  //       done();
  //     });
  //   });
  // });
  //
  // /** PUT addAssignment **/
  // describe('/PUT add assignment', () => {
  //   it('should add an assignment to the user steve', done => {
  //     const url = baseUrl + 'addAssignment/' + fixtures.user._id;
  //     chai.request(host)
  //     .put(url)
  //     .set('Cookie', userCredentials)
  //     .send({assignment: fixtures.user.assignment})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys("assignments");
  //       expect(res.body.user.assignments[0].problemId).to.eql(fixtures.user.assignment.problemId);
  //       done();
  //     });
  //   });
  // });
  //
  // /** PUT removeAssignment **/
  // describe('/PUT remove assignment', () => {
  //   it('should remove the assignment we just added', done => {
  //     const url = baseUrl + 'removeAssignment/' + fixtures.user._id;
  //     chai.request(host)
  //     .put(url)
  //     .set('Cookie', userCredentials)
  //     .send({assignment: fixtures.user.assignment})
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.user).to.have.any.keys("assignments");
  //       expect(res.body.user.assignments).to.not.include(fixtures.user.assignment);
  //       done();
  //     });
  //   });
  // });
});
