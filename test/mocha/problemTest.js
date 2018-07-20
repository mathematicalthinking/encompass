// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/problems/";

chai.use(chaiHttp);

/** GET **/
describe('Problem CRUD operations', function() {
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

  describe('/GET problems', () => {
    it('should get all problems', done => {
      agent
      .get(baseUrl)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('problems');
        expect(res.body.problems).to.be.a('array');
        expect(res.body.problems.length).to.eql(3);
        done();
      });
    });
  });

  /** POST **/
  describe('/POST problem', () => {
    it('should post a new problem', done => {
      agent
      .post(baseUrl)
      .send({problem: fixtures.problem.validProblem})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.problem).to.have.any.keys('title', 'puzzleId', 'categories');
        expect(res.body.problem.title).to.eql('test math problem');
        done();
      });
    });
  });

  /** PUT name**/
  describe('/PUT update problem name', () => {
    it('should change the title to test science problem', done => {
      let url = baseUrl + fixtures.problem._id;
      agent
      .put(url)
      .send({problem: {title: 'test science problem'}})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.problem).to.have.any.keys('puzzleId', 'title', 'categories');
        expect(res.body.problem.title).to.eql('test science problem');
        done();
      });
    });
  });
});
