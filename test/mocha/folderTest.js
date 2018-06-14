const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=superuser; EncAuth=test-admin-key';
const baseUrl = "/api/folders/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

describe('Folder CRUD operations', function() {
    this.timeout('17s');
    before(async function(){
      await dbSetup.prepTestDb();
    });
    describe('/GET Folders', () => {
      it('should get all folders', done => {
        chai.request(host)
        .get(baseUrl)
        .set('Cookie', userCredentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('folders');
          expect(res.body.folders).to.be.a('array');
          done();
        });
      });
    });
    describe('/GET folder by ID', () => {
      it('should get the reflections folder', done => {
        chai.request(host)
        .get(baseUrl + fixtures.folder._id)
        .set('Cookie', userCredentials)
        .end((err, res) => {
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
        console.log(fixtures.folder.validFolder);
        chai.request(host)
        .post(baseUrl)
        .set('Cookie', userCredentials)
        .send({folder: fixtures.folder.validFolder})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.folder).to.have.any.keys('name', 'workspace');
          expect(res.body.folder.name).to.eql(fixtures.folder.validFolder.name);
          done();
        });
      });
    });
    //
    /** PUT name**/
    describe('/PUT update folder name', () => {
      it('should change the folder name to phils class', done => {
        let url = baseUrl + fixtures.folder._id;
        chai.request(host)
        .put(url)
        .set('Cookie', userCredentials)
        .send({folder: {name: 'phils class'}})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.folder).to.have.any.keys('name', );
          expect(res.body.folder.name).to.eql('phils class');
          done();
        });
      });
    });
});
