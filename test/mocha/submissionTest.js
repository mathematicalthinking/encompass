const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=superuser; EncAuth=test-admin-key';
const baseUrl = "/api/submissions/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

describe('Submission CRUD operations', function() {
  this.timeout('17s');
  before( async function () {
    await dbSetup.prepTestDb();
  });
  /** GET **/
  describe('/GET submissions', () => {
    it('should get all submissions', done => {
      chai.request(host)
      .get(baseUrl)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('submissions');
        expect(res.body.submissions).to.be.a('array');
        done();
      });
    });
  });
  describe('/GET submission by ID', () => {
    it('should get submission', done => {
      chai.request(host)
      .get(baseUrl + fixtures.submission._id)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('submission');
        expect(res.body.submission).to.be.a('object');
        expect(res.body.submission.pdSet).to.eql("Feather and Fur - Mary");
        done();
      });
    });
  });

  /** POST **/
  describe('/POST submission', () => {
    it('should post a new submission', done => {
      chai.request(host)
      .post(baseUrl)
      .send(fixtures.submission.validSubmission)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.submission).to.be.a('array')
        console.log("SUBMISSION: ", res.body.submission);
        expect(res.body.submission[0]).to.have.any.keys('longAnswer', 'shortAnswer', 'answer');
        expect(res.body.submission[0].longAnswer).to.eql(fixtures.submission.validSubmission.longAnswer);
        done();
      });
    });
  });
//   //
//   /** PUT submission text**/
//   describe('/PUT update submission text', () => {
//     it('should change the submission text to "updated text"', done => {
//       let url = baseUrl + fixtures.submission._id;
//       chai.request(host)
//       .put(url)
//       .set('Cookie', userCredentials)
//       .send({submission: {text: 'updated text', submission: fixtures.submission.validSubmission.submission}})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.submission).to.have.any.keys('text', 'submission', 'taggingins', 'workspace');
//         expect(res.body.submission.text).to.eql('updated text');
//         done();
//       });
//     });
//   });
});
