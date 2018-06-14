const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=superuser; EncAuth=test-admin-key';
const baseUrl = "/api/selections/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

describe('Selection CRUD operations', function() {
  this.timeout('17s');
  before( async function () {
    await dbSetup.prepTestDb();
  });
  /** GET **/
  describe('/GET selections', () => {
    it('should get all selections', done => {
      chai.request(host)
      .get(baseUrl)
      .set('Cookie', userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('selections');
        expect(res.body.selections).to.be.a('array');
        done();
      });
    });
  });
  describe('/GET selection by ID', () => {
    it('should get selection', done => {
      chai.request(host)
      .get(baseUrl + fixtures.selection._id)
      .set('Cookie', userCredentials)
      .end((err, res) => {
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
      chai.request(host)
      .post(baseUrl)
      .set('Cookie', userCredentials)
      .send({selection: fixtures.selection.validSelection})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.selection).to.have.any.keys('text', 'submission');
        expect(res.body.selection.text).to.eql(fixtures.selection.validSelection.text);
        done();
      });
    });
  });
  //
  /** PUT selection text**/
  describe('/PUT update selection text', () => {
    it('should change the selection text to "updated text"', done => {
      let url = baseUrl + fixtures.selection._id;
      chai.request(host)
      .put(url)
      .set('Cookie', userCredentials)
      .send({selection: {text: 'updated text', submission: fixtures.selection.validSelection.submission}})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.selection).to.have.any.keys('text', 'submission', 'taggingins', 'workspace');
        expect(res.body.selection.text).to.eql('updated text');
        done();
      });
    });
  });
});
