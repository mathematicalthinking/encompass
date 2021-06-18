/*
 * These tests are all pending now because the test db needs to be updated
 */

// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const _ = require('underscore');

// REQUIRE FILES
const fixtures = require('./fixtures');
const helpers = require('./helpers');
const testUsers = require('./userFixtures').users;
const models = require('../../server/datasource/schemas');


const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/sections/";

mongoose.Promise = global.Promise;

chai.use(chaiHttp);

function getAPIResourceById(agent, resource, id) {
  let url = `/api/${resource}/${id}`;
  return agent.get(url);
}
describe('Section CRUD operations by account type', function() {
  function runTests(user) {
    describe(`Section CRUD operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleSectionCount, accessibleSection, inaccessibleSection, validSection, modifiableSection } = user.sections;
      // eslint-disable-next-line no-unused-vars
      const isStudent = accountType === 'S' || actingRole === 'student';

      before(async function(){
        try {
          await helpers.setup(agent, username, password);
          mongoose.connect('mongodb://localhost:27017/encompass_seed', { useMongoClient: true });
        }catch(err) {
          console.log(err);
        }
      });

      after(() => {
        mongoose.connection.close();
        agent.close();
      });

       /** GET **/
  describe('/GET sections', () => {
    it('should get all sections', done => {
      agent
      .get(baseUrl)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('sections');
        expect(res.body.sections).to.be.a('array');
        expect(res.body.sections).to.have.lengthOf(accessibleSectionCount);
        done();
      });
    });
  });
  if (accountType !== 'A' && accountType !== 'P') {
    describe('/GET inaccessible section by id', () => {
      it('should return 403 error', done => {
        const url = baseUrl + inaccessibleSection._id;
        agent
        .get(url)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          expect(res).to.have.status(403);
          done();
        });
      });
    });
  }
  describe('/GET accessible section by ID', () => {
    it('should return 1 section with matching id', done => {
      agent
      .get(baseUrl + accessibleSection._id)
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('section');
        expect(res.body.section).to.be.a('object');
        expect(res.body.section._id).to.eql(accessibleSection._id);
        done();
      });
    });
  });

  /** POST **/
  describe('/POST section', () => {
    let msg = 'should post a new section';
    if (isStudent) {
      msg = 'should return 403 error';
    }
    it(msg, done => {
      agent
      .post(baseUrl)
      .send({section: validSection})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (isStudent) {
          expect(res).to.have.status(403);
          done();
        } else {
          expect(res).to.have.status(200);
          expect(res.body.section).to.have.any.keys('name', 'assignments', 'students', 'teachers');
          expect(res.body.section.name).to.eql(validSection.name);
          done();
        }
      });
    });
  });

  /** PUT name**/
  describe('/PUT update section name with permission', () => {
    let newName = 'new class';
    let msg = `should change the section name to ${newName}`;

    if (isStudent) {
      msg = 'should return 403 error';
    }
    it(msg, done => {
      let url = baseUrl + modifiableSection._id;
      agent
      .put(url)
      .send({
            section: {
              name: newName,
            }
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        if (isStudent) {
          expect(res).to.have.status(403);
          done();
        } else {
          expect(res).to.have.status(200);
          expect(res.body.section).to.have.any.keys('name', 'assignments', 'students', 'teachers');
          expect(res.body.section.name).to.eql(newName);
          done();
        }
      });
    });
  });
if (!isStudent) {
  describe('add teacher to section', () => {
    it('should add one teacher to the section', done => {
      let url = baseUrl + modifiableSection._id;
      agent
      .put(url)
      .send({section: {teachers: modifiableSection.newTeachers}})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.section).to.have.any.keys('name', 'problems', 'students', 'teachers');
        expect(res.body.section.teachers).to.have.members(modifiableSection.newTeachers);
        expect(res.body.section.teachers).to.contain(modifiableSection.teacherToAdd);
        done();
      });
    });

    // this test is flaky
    // find better way to do this
    xit('should add section object to new teacher\'s sections array', function() {
      return getAPIResourceById(agent, 'users', modifiableSection.teacherToAdd)
      .then((results) => {
        let sections = results.body.user.sections;
        expect(_.find(sections, obj => obj.sectionId.toString() === modifiableSection._id && obj.role === 'teacher')).to.exist;
        expect(_.find(sections, obj => obj.sectionId === modifiableSection._id && obj.role === 'student')).to.not.exist;
      return;
      })
      .catch((err) => {
        throw(err);
      });
    });



  });
  describe('add student to section', () => {
    it('should add one student to the section', done => {
      let url = baseUrl + modifiableSection._id;
      agent
      .put(url)
      .send({section: {students: modifiableSection.newStudents}})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.section).to.have.any.keys('name', 'problems', 'students', 'students');
        expect(res.body.section.students).to.have.members(modifiableSection.newStudents);
        expect(res.body.section.students).to.contain(modifiableSection.studentToAdd);
        done();
      });
    });

    xit('should add section object to new student\'s sections array', function(done) {
      models.User.findById(modifiableSection.studentToAdd, (err, res) => {
        if (err) {
          done(err);
        }
        expect(_.find(res.sections, obj => obj.sectionId.toString() === modifiableSection._id && obj.role === 'student')).to.exist;
        expect(_.find(res.sections, obj => obj.sectionId === modifiableSection._id && obj.role === 'teacher')).to.not.exist;
        done();
      });

    });


  });


  /** Remove teachers **/
  xdescribe('remove teacher from section', () => {
    let url = baseUrl + 'removeTeacher/' + fixtures.section._id;
    it('should return an empty array', done => {
      agent
      .put(url)
      .send({teacherId: fixtures.teacher._id})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.section).to.have.any.keys('name', 'problems', 'students', 'teachers');
        expect(res.body.section.teachers).to.not.contain(fixtures.teacher._id);
        done();
      });
    });
  });
}
  /** Add teachers **/




  /** Remove teachers **/
  xdescribe('remove student from section', () => {
    let url = baseUrl + 'removeStudent/' + fixtures.section._id;
    it('should return an empty array', done => {
      agent
      .put(url)
      .send({studentName: fixtures.student.name})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.section).to.have.any.keys('name', 'problems', 'students', 'teachers');
        expect(res.body.section.students).to.not.contain(fixtures.student.name);
        done();
      });
    });
  });

  //THIS NEEDS TO BE CHANGED TO ASSIGNMENT
  xdescribe('add problem to section', () => {
    it('should add one problem to the section', done => {
      let url = baseUrl + 'addProblem/' + fixtures.section._id;
      agent
      .put(url)
      .send({problem: fixtures.problem._id})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.section).to.have.any.keys('name', 'problems', 'students', 'teachers');
        expect(res.body.section.problems).to.contain(fixtures.problem._id);
        done();
      });
    });
  });

  //THIS NEEDS TO BE CHANGED TO ASSIGNMENT
  xdescribe('remove problem from section', () => {
    let url = baseUrl + 'removeProblem/' + fixtures.section._id;
    it('should return an empty array', done => {
      agent
      .put(url)
      .send({problem: fixtures.problem._id})
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        expect(res).to.have.status(200);
        expect(res.body.section).to.have.any.keys('sectionId', 'name', 'problems', 'students', 'teachers');
        expect(res.body.section.problems).to.not.contain(fixtures.problem._id);
        done();
      });
    });
  });

    });
  }

  for (let user of Object.keys(testUsers)) {
    let testUser = testUsers[user];
    // eslint-disable-next-line no-await-in-loop
    runTests(testUser);
  }
});
