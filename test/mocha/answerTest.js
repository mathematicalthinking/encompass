const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=superuser; EncAuth=test-admin-key';
const baseUrl = "/api/answers/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

describe('Answer CRUD operations', function() {
  this.timeout('17s');
  before(async function(){
    await dbSetup.prepTestDb();
  });
  describe('/GET answers', () => {
    it('should get all answers', done => {
      chai.request(host)
      .get(baseUrl)
      .set('Cookie', userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('answers');
        expect(res.body.answers).to.be.a('array');
        expect(res.body.answers[0].answer).to.eql('12.9%');
        done();
      });
    });
  });

  /** POST **/
  describe('/POST answer', () => {
    it('should post a new answer', done => {
      chai.request(host)
      .post(baseUrl)
      .set('Cookie', userCredentials)
      .send({answer: fixtures.answer.validAnswer})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.answer).to.have.any.keys('problemId', 'studentName', 'answer');
        expect(res.body.answer.explanation).to.eql('I put 2 and 2 together');
        done();
      });
    });
  });

  /** PUT name**/
  describe('/PUT update answer explanation', () => {
    it('should change the explanation', done => {
      let url = baseUrl + fixtures.answer._id;
      chai.request(host)
      .put(url)
      .set('Cookie', userCredentials)
      .send({answer: {explanation: 'actually Im not sticking with that answer'}})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.answer).to.have.any.keys('answer', 'explanation', 'studentName');
        expect(res.body.answer.explanation).to.eql('actually Im not sticking with that answer');
        done();
      });
    });
  });

})
