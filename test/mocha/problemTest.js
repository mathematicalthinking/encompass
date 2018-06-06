const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=steve; EncAuth=ff6d8301-dd2f-4a83-9e3e-1ff4a459a292'; // this is always changing
const baseUrl = "/api/problems/";
const problemId = '5b0d939baca0b80f78807cf5';

chai.use(chaiHttp);

/** GET **/
describe('/GET problems', () => {
  it('should get all problems', done => {
    chai.request('http://localhost:8080')
    .get(baseUrl)
    .set('Cookie', userCredentials) // what to do about this?
    .end((err, res) => {
      // expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('problems');
      expect(res.body.problems).to.be.a('array');
      expect(res.body.problems.length).to.be.above(0);
      done();
    });
  });
});

/** POST **/
describe('/POST problem', () => {
  it('should post a new problem', done => {
    chai.request('http://localhost:8080')
    .post(baseUrl)
    .set('Cookie', userCredentials)
    .send({problem: fixtures.problem.validProblem})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.problem).to.have.any.keys('puzzleId', 'categories', 'title');
      expect(res.body.problem.title).to.eql('test math problem');
      done();
    });
  });
});

/** PUT name**/
describe('/PUT update problem name', () => {
  it('should change the title to test science problem', done => {
    let url = baseUrl + problemId;
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send({problem: {title: 'test science problem'}})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.problem).to.have.any.keys('puzzleId', 'title', 'categories');
      expect(res.body.problem.title).to.eql('test science problem');
      done();
    });
  });
});
