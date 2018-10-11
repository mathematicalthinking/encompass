// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/answers/";

chai.use(chaiHttp);

describe('Answer CRUD operations by account type', function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Answer CRUD operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleAnswerCount, accessibleAnswer, inaccessibleAnswer } = user.answers;
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

      describe('/GET answers', () => {
        it('should get all answers', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body).to.have.all.keys('answers');
            expect(res.body.answers).to.be.a('array');
            expect(res.body.answers).to.have.lengthOf(accessibleAnswerCount);
            done();
          });
        });
      });

      /** POST **/
      describe('/POST answer', () => {
        it('should post a new answer', done => {
          agent
          .post(baseUrl)
          .send({answer: fixtures.answer.validAnswer})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.answer).to.have.any.keys('problem', 'answer');
            expect(res.body.answer.explanation).to.eql('I put 2 and 2 together');
            done();
          });
        });
      });

      /** PUT name**/
      describe('/PUT update answer explanation for already submitted', () => {
        it('should return an error,', done => {
          let url = baseUrl + fixtures.answer._id;
          agent
          .put(url)
          .send({answer: fixtures.answer.updated})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(403);
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

