// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/folders/";

chai.use(chaiHttp);

describe('Folder CRUD operations', function() {
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

  describe('/GET Folders', () => {
    it('should get all folders', done => {
      agent
      .get(baseUrl)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('folders');
        expect(res.body.folders).to.be.a('array');
        done();
      });
    });
  });

  describe('/GET folder by ID', () => {
    it('should get the reflections folder', done => {
      agent
      .get(baseUrl + fixtures.folder._id)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('folder');
        expect(res.body.folder).to.be.a('object');
        expect(res.body.folder.name).to.eql('Reflections');
        done();
      });
    });
  });

  /** POST **/
  describe('/POST folder', () => {
    it('should post a new folder', done => {
      agent
      .post(baseUrl)
      .send({folder: fixtures.folder.validFolder})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.folder).to.have.any.keys('name', 'workspace');
        expect(res.body.folder.name).to.eql(fixtures.folder.validFolder.name);
        done();
      });
    });
  });

  /** PUT name**/
  describe('/PUT update folder name', () => {
    it('should change the folder name to phils class', done => {
      let url = baseUrl + fixtures.folder._id;
      agent
      .put(url)
      .send({
            folder: {
              name: 'phils class',
              createdBy: fixtures.folder.validFolder.createdBy,
            }
          })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.folder).to.have.any.keys('name', );
        expect(res.body.folder.name).to.eql('phils class');
        done();
      });
    });
  });
});
