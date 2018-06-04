const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=steve; EncAuth=ff6d8301-dd2f-4a83-9e3e-1ff4a459a292';
let url = "/api/sections/";
// const app = require('../../app/server');

chai.use(chaiHttp);

/** GET **/
describe('/GET sections', () => {
  it('should get all sections', done => {
    chai.request('http://localhost:8080')
    .get(url)
    .set('Cookie', userCredentials) // what to do about this?
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
    .post(url)
    .set('Cookie', userCredentials)
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
    url += fixtures.section.validSection._id;
    console.log("URL: ", url);
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send({section: {name: 'phils class'}})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.section).to.have.any.keys('sectionId', 'name', 'problems', 'students', 'teachers');
      expect(res.body.section.name).to.eql('phils class');
      done();
    });
  });
});

// /** Add teachers **/
// describe('add teacher to section', () => {
//   it('should add one teacher to the section', done => {
//     chai.request('http://localhost:8080')
//     .put(`/api/sections/addTeacher/ ${fixtures.section.validSection.sectionId} `)
//     .set('Cookie', userCredentials)
//     .send({teacherId: ''})
//     .end((err, res) => {
//       expect(res).to.have.status(200);
//     });
//   });
// });

// /** Remove teachers **/
// describe('remove teacher from section', () => {
//   it('should change the section name to phils class', done => {
//     chai.request('http://localhost:8080')
//     .put(`/api/sections/${fixtures.section.validSection.sectionId}`)
//     .set('Cookie', userCredentials)
// });
//
// /** Add students **/
// describe('add students', () => {
//   it('should change the section name to phils class', done => {
//     chai.request('http://localhost:8080')
//     .put(`/api/sections/${fixtures.section.validSection.sectionId}`)
//     .set('Cookie', userCredentials)
// });
//
// /** Remove students **/
// describe('remove students', () => {
//   it('should change the section name to phils class', done => {
//     chai.request('http://localhost:8080')
//     .put(`/api/sections/${fixtures.section.validSection.sectionId}`)
//     .set('Cookie', userCredentials)
// });
//
// /** Add problems **/
// describe('add problems', () => {
//   it('should change the section name to phils class', done => {
//     chai.request('http://localhost:8080')
//     .put(`/api/sections/${fixtures.section.validSection.sectionId}`)
//     .set('Cookie', userCredentials)
// });
//
// /** remove problems **/
// describe('remove problems', () => {
//   it('should change the section name to phils class', done => {
//     chai.request('http://localhost:8080')
//     .put(`/api/sections/${fixtures.section.validSection.sectionId}`)
//     .set('Cookie', userCredentials)
// });
