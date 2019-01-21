// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/responses/";

chai.use(chaiHttp);

describe('Response CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Response CRUD operations as ${user.details.testDescriptionTitle}`, function(){
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleResponsesCount, inaccessibleResponse, accessibleResponse } = user.responses;
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

       /** GET **/
    describe('/GET responses', () => {
      it('should get all responses', done => {
        agent
        .get(baseUrl)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('response');
        expect(res.body.response).to.be.a('array');
        expect(res.body.response.length).to.eql(accessibleResponsesCount);
        done();
        });
      });
    });

    if (accountType !== 'A') {
      /** GET **/
      describe('/GET unaccessible response by id', () => {
        it('should return 403 error', done => {
          const url = baseUrl + inaccessibleResponse._id;
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

      // xdescribe('/PUT update unaccessible response', () => {
      //   it('should return 403 error', done => {
      //     const url = baseUrl + unaccessibleResponse._id;
      //     agent
      //     .put(url)
      //     .send({
      //       user: {
      //         'name': 'test name',
      //         'username': unaccessibleResponse.username,
      //         'accountType': unaccessibleResponse.accountType,
      //       }
      //     })
      //     .end((err, res) => {
      //       expect(res).to.have.status(403);
      //       done();
      //     });
      //   });
      // });


    }
  if (actingRole !== 'student') {
    describe('/GET response by ID', () => {
      it('should get response', done => {
        agent
        .get(baseUrl + accessibleResponse._id)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('response');
          expect(res.body.response).to.be.a('object');
          // expect(res.body.response.pdSet).to.eql("Feather and Fur - Mary");
          done();
        });
      });
    });
  }

  });
  }

  /** POST **/
  // xdescribe('/POST response', () => {
  //   it('should post a new response', done => {
  //     agent
  //     .post(baseUrl)
  //     .send(fixtures.response.validResponse)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.response).to.be.a('array')
  //       expect(res.body.response[0]).to.have.any.keys('longAnswer', 'shortAnswer', 'answer');
  //       expect(res.body.response[0].longAnswer).to.eql(fixtures.response.validResponse.longAnswer);
  //       done();
  //     });
  //   });
  // });
//   //
//   /** PUT response text**/
//   describe('/PUT update response text', () => {
//     it('should change the response text to "updated text"', done => {
//       let url = baseUrl + fixtures.response._id;
//       agent
//       .put(url)
//       .set('Cookie', userCredentials)
//       .send({response: {text: 'updated text', response: fixtures.response.validResponse.response}})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.response).to.have.any.keys('text', 'response', 'taggingins', 'workspace');
//         expect(res.body.response.text).to.eql('updated text');
//         done();
//       });
//     });
//   });
for (let user of Object.keys(testUsers)) {
  let testUser = testUsers[user];
  // eslint-disable-next-line no-await-in-loop
  await runTests(testUser);
}
});