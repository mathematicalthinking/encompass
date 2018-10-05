// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/selections/";

chai.use(chaiHttp);

describe('Selection CRUD operations', function() {
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
  describe('/GET selections', () => {
    it('should get all selections', done => {
      agent
      .get(baseUrl)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('selections');
        expect(res.body.selections).to.be.a('array');
        done();
      });
    });
  });

  describe('/GET selection by ID', () => {
    it('should get selection', done => {
      agent
      .get(baseUrl + fixtures.selection._id)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('selection');
        expect(res.body.selection).to.be.a('object');
        let respText = res.body.selection.text.trim();
        expect(respText).include("looking");
        done();
      });
    });
  });

  /** POST **/
  describe('/POST selection', () => {
    it('should post a new selection', done => {
      agent
      .post(baseUrl)
      .send({selection: fixtures.selection.validSelection})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.selection).to.have.any.keys('text', 'submission');
        expect(res.body.selection.text).to.eql(fixtures.selection.validSelection.text);
        done();
      });
    });
  });

  /** PUT selection text**/
  describe('/PUT update selection text', () => {
    it('should change the selection text to "updated text"', done => {
      let url = baseUrl + fixtures.selection._id;
      agent
      .put(url)
      .send(
        {
            selection: {
              text: 'updated text',
              coordinates: fixtures.selection.validSelection.coordinates,
              submission: fixtures.selection.validSelection.submission,
              createdBy: fixtures.selection.validSelection.createdBy,
            }
        })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.selection).to.have.any.keys('text', 'submission', 'taggingins', 'workspace');
        expect(res.body.selection.text).to.eql('updated text');
        done();
      });
    });
  });
});
