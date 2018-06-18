const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const baseUrl = "/api/problems/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

/** GET **/
describe('Problem CRUD operations', function() {
  this.timeout('17s');
  before(async function() {
    await dbSetup.prepTestDb();
  })
  describe('/GET problems', () => {
    it('should get all problems', done => {
      chai.request(host)
      .get(baseUrl)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('problems');
        expect(res.body.problems).to.be.a('array');
        expect(res.body.problems[0].title).to.eql('Mr. W. Goes Across Australia');
        done();
      });
    });
  });

  /** POST **/
  describe('/POST problem', () => {
    it('should post a new problem', done => {
      chai.request(host)
      .post(baseUrl)
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
      let url = baseUrl + fixtures.problem._id;
      chai.request(host)
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
})
