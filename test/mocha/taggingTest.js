const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const baseUrl = "/api/taggings/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

describe('Tagging CRUD operations', function() {
  this.timeout('17s');
  before( async function () {
    await dbSetup.prepTestDb();
  });
  /** GET **/
  describe('/GET taggings', () => {
    it('should get all taggings', done => {
      chai.request(host)
      .get(baseUrl)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('taggings');
        expect(res.body.taggings).to.be.a('array');
        done();
      });
    });
  });
  describe('/GET tagging by ID', () => {
    it('should get tagging', done => {
      chai.request(host)
      .get(baseUrl + fixtures.tagging._id)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('tagging');
        expect(res.body.tagging).to.be.a('object');
        expect(res.body.tagging.folder).to.eql('53e118f3b48b12793f000a41');
        done();
      });
    });
  });

  /** POST **/
  describe('/POST tagging', () => {
    it('should post a new tagging', done => {
      chai.request(host)
      .post(baseUrl)
      .send({tagging: fixtures.tagging.validTagging})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.tagging).to.have.any.keys('folder', 'workspace', 'submission');
        expect(res.body.tagging.folder).to.eql(fixtures.tagging.validTagging.folder);
        done();
      });
    });
  });
  //
  /** PUT tagging text**/
  describe('/PUT update tagging text', () => {
    it('should change the tagging text to "updated text"', done => {
      let url = baseUrl + fixtures.tagging._id;
      chai.request(host)
      .put(url)
      .send({tagging: fixtures.tagging.validTagging})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.tagging).to.have.any.keys('workspace', 'submission', 'folder');
        expect(res.body.tagging.submission).to.eql(fixtures.tagging.validTagging.submission);
        done();
      });
    });
  });
});
