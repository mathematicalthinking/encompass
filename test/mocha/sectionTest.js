const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
// const app = require('../../app/server');

chai.use(chaiHttp);

/** GET **/
describe('/GET sections', () => {
  it('should get all sections', done => {
    chai.request('http://localhost:8080')
    .get('/api/sections')
    .set('Cookie', 'loginSessionUser=steve; EncAuth=a4903119-fee7-4403-a6b7-fc14c3e5a706') // what to do about this?
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('sections');
      expect(res.body.sections).to.be.a('array');
      expect(res.body.sections.length).to.be.above(0);
      done();
    });
  });
});

/** POST **/
describe('/POST section', () => {
  it('should post a new section', done => {
    chai.request('http://localhost:8080')
    .post('/api/sections')
    .set('Cookie', 'loginSessionUser=steve; EncAuth=a4903119-fee7-4403-a6b7-fc14c3e5a706')
    .send(fixtures.section.validSection)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.section).to.have.any.keys('sectionId', 'name', 'problems', 'students', 'teachers');
      done();
    });
  });
});

/** PUT name**/
describe('/PUT update section name', () => {
  it('should change the section name to phils class', done => {
    chai.request('http://localhost:8080')
    .put(`/api/sections/5b15522cdfa1745d8ca72277`)
    .set('Cookie', 'loginSessionUser=steve; EncAuth=a4903119-fee7-4403-a6b7-fc14c3e5a706')
    .send({section: {name: 'phils class'}})
    .end((err, res) => {
      expect(res).to.have.status(200);
      console.log(res.body);
      expect(res.body.section).to.have.any.keys('sectionId', 'name', 'problems', 'students', 'teachers');
      expect(res.body.section.name).to.eql('phils class');
      done();
    });
  });
});

/** Add teachers **/
// describe('add teachers', () => {});
//
// /** Remove teachers **/
// describe('remove teachers', () => {});
//
// /** Add students **/
// describe('add students', () => {});
//
// /** Remove students **/
// describe('remove students', () => {});
//
// /** Add problems **/
// describe('add problems', () => {});
//
// /** remove problems **/
// describe('remove problems', () => {});
