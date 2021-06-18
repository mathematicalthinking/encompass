// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/responses/";
const mongoose = require('mongoose');
const models = require('../../server/datasource/schemas');
mongoose.Promise = global.Promise;

chai.use(chaiHttp);

describe('Response CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Response CRUD operations as ${user.details.testDescriptionTitle}`, function(){
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleResponsesCount, inaccessibleResponse, accessibleResponse } = user.responses;

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


    // TODO add unaccessible response for pdadmin
    if (accountType !== 'A' && accountType !=='P') {
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

    describe('/PUT update response isTrashed', () => {
      let results = {};
      let responseToTrash = {
        "_id" : "5d5d635b4f217a59dfbbdefe",
        "text" : "<p>Hello ashleyc,</p><p><br></p><p>You wrote:</p><p><br></p><blockquote class='pf-response-text'>undefined</blockquote><p><br></p><p>...and I thought...</p><p><br></p><p class='pf-response-text'>I'm not sure about this</p><p><br></p>",
        "original" : "<p>Hello ashleyc,</p><br><p>You wrote:</p><br><blockquote class=\"pf-response-text\">undefined</blockquote><br><p>...and I thought...</p><br><p class=\"pf-response-text\">I'm not sure about this</p><br>",
        "source" : "submission",
        "responseType" : "mentor",
        "note" : null,
        "status" : "approved",
        "createdBy" : "5b914a102ecaf7c30dd47492",
        "lastModifiedBy" : null,
        "recipient" : "5b9149c22ecaf7c30dd47490",
        "submission" : "5d5d60ef4f217a59dfbbdeed",
        "workspace" : "5d5d60ef4f217a59dfbbdeeb",
        "priorRevision" : null,
        "reviewedResponse" : null,
        "approvedBy" : null,
        "unapprovedBy" : null,
        "wasReadByApprover" : false,
        "wasReadByRecipient" : false,
        "comments" : [
            "5d5d63384f217a59dfbbdefc"
        ],
        "selections" : [
            "5d5d631c4f217a59dfbbdefb"
        ],
        "lastModifiedDate" : null,
        "isTrashed" : true,
        "createDate" : "2019-08-21T15:29:31.265Z"
    };

      before(function(done) {
        let url = baseUrl + responseToTrash._id;
        agent
        .put(url)
        .send({response: responseToTrash})
        .end((err, res) => {
          if (err) {
            console.error(err);
          }
          results = res;
          done();
        });
      });

      it('Should update response', done => {
        expect(results).to.have.status(200);
        expect(results.body.response.isTrashed).to.eql(true);
        done();
      });

      it('Should have removed response from submission', async () => {
        try {
          await mongoose.connect('mongodb://localhost:27017/encompass_seed', {useMongoClient: true});

          let submission = await models.Submission.findById(results.body.response.submission);

          let subResponses = submission.responses.map(r => r.toString());
          expect(subResponses).to.not.have.members([results.body.response._id]);
          mongoose.connection.close();
          return;

        }catch(err) {
          mongoose.connection.close();

          throw(err);
        }
      });
    });  }

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