// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/submissions/";

chai.use(chaiHttp);

describe('Submission CRUD operations', function() {
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

  /** GET **/
  describe('/GET submissions', () => {
    it('should get all submissions', done => {
      agent
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
      agent
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
      agent
      .post(baseUrl)
      .send(fixtures.submission.validSubmission)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.submission).to.be.a('array')
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
//       agent
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
