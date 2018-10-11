// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const userFixtures = require('./userFixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/problems/";

chai.use(chaiHttp);

/** GET **/
describe('Problem CRUD operations by account type', function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Problem CRUD operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleProblemCount, accessibleProblem, inaccessibleProblem } = user.problems;
      // eslint-disable-next-line no-unused-vars
      const isStudent = accountType === 'S' || actingRole === 'student';

      before(async function(){
        try {
          await helpers.setup(agent, username, password);
        }catch(err) {
          console.log(err);
        }
      });

      after(() => {
        agent.close();
      });

      describe('/GET problems', () => {
        it('should get all problems', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('problems', 'meta');
            expect(res.body.problems).to.be.a('array');
            expect(res.body.problems.length).to.eql(accessibleProblemCount);
            done();
          });
        });
      });

      /** POST **/
      xdescribe('/POST problem', () => {
        it('should post a new problem', done => {
          agent
          .post(baseUrl)
          .send({problem: fixtures.problem.validProblem})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.problem).to.have.any.keys('title', 'puzzleId', 'categories');
            expect(res.body.problem.title).to.eql('test math problem');
            done();
          });
        });
      });

      /** PUT name**/
      xdescribe('/PUT update problem name', () => {
        it('should change the title to test science problem', done => {
          let url = baseUrl + fixtures.problem._id;
          agent
          .put(url)
          .send({
                problem: {
                  title: 'test science problem',
                  createdBy: fixtures.problem.validProblem.createdBy,
                }
           })
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.problem).to.have.any.keys('puzzleId', 'title', 'categories');
            expect(res.body.problem.title).to.eql('test science problem');
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






