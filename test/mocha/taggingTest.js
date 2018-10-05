// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/taggings/";

chai.use(chaiHttp);

describe('Tagging CRUD operations', function() {
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
  describe('/GET taggings', () => {
    it('should get all taggings', done => {
      agent
      .get(baseUrl)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('taggings');
        expect(res.body.taggings).to.be.a('array');
        done();
      });
    });
  });

  describe('/GET tagging by ID', () => {
    it('should get tagging', done => {
      agent
      .get(baseUrl + fixtures.tagging._id)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
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
      agent
      .post(baseUrl)
      .send({tagging: fixtures.tagging.validTagging})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.tagging).to.have.any.keys('folder', 'workspace', 'submission');
        expect(res.body.tagging.folder).to.eql(fixtures.tagging.validTagging.folder);
        done();
      });
    });
  });

  /** PUT tagging text**/
  describe('/PUT update tagging text', () => {
    it('should change the tagging text to "updated text"', done => {
      let url = baseUrl + fixtures.tagging._id;
      agent
      .put(url)
      .send({tagging: fixtures.tagging.validTagging})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.tagging).to.have.any.keys('workspace', 'submission', 'folder');
        expect(res.body.tagging.submission).to.eql(fixtures.tagging.validTagging.submission);
        done();
      });
    });
  });
});
