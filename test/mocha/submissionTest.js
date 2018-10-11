// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/submissions/";

chai.use(chaiHttp);

describe('Submission CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Submission CRUD operations as ${user.details.testDescriptionTitle}`, function(){
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleSubmissionCount, unaccessibleSubmission, accessibleSubmission } = user.submissions;
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
    describe('/GET submissions', () => {
      it('should get all submissions', done => {
        agent
        .get(baseUrl)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          if (isStudent) {
            expect(res).to.have.status(403);
            done();
          } else {
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('submissions');
          expect(res.body.submissions).to.be.a('array');
          expect(res.body.submissions.length).to.eql(accessibleSubmissionCount);
          done();
          }

        });
      });
    });

    if (accountType !== 'A') {
      /** GET **/
      describe('/GET unaccessible submission by id', () => {
        it('should return 403 error', done => {
          const url = baseUrl + unaccessibleSubmission._id;
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

      // xdescribe('/PUT update unaccessible submission', () => {
      //   it('should return 403 error', done => {
      //     const url = baseUrl + unaccessibleSubmission._id;
      //     agent
      //     .put(url)
      //     .send({
      //       user: {
      //         'name': 'test name',
      //         'username': unaccessibleSubmission.username,
      //         'accountType': unaccessibleSubmission.accountType,
      //       }
      //     })
      //     .end((err, res) => {
      //       expect(res).to.have.status(403);
      //       done();
      //     });
      //   });
      // });


    }
  if (!isStudent) {
    describe('/GET submission by ID', () => {
      it('should get submission', done => {
        agent
        .get(baseUrl + accessibleSubmission._id)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('submission');
          expect(res.body.submission).to.be.a('object');
          // expect(res.body.submission.pdSet).to.eql("Feather and Fur - Mary");
          done();
        });
      });
    });
  }

  });
  }

  /** POST **/
  // xdescribe('/POST submission', () => {
  //   it('should post a new submission', done => {
  //     agent
  //     .post(baseUrl)
  //     .send(fixtures.submission.validSubmission)
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body.submission).to.be.a('array')
  //       expect(res.body.submission[0]).to.have.any.keys('longAnswer', 'shortAnswer', 'answer');
  //       expect(res.body.submission[0].longAnswer).to.eql(fixtures.submission.validSubmission.longAnswer);
  //       done();
  //     });
  //   });
  // });
//   //
//   /** PUT submission text**/
//   describe('/PUT update submission text', () => {
//     it('should change the submission text to "updated text"', done => {
//       let url = baseUrl + fixtures.submission._id;
//       agent
//       .put(url)
//       .set('Cookie', userCredentials)
//       .send({submission: {text: 'updated text', submission: fixtures.submission.validSubmission.submission}})
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body.submission).to.have.any.keys('text', 'submission', 'taggingins', 'workspace');
//         expect(res.body.submission.text).to.eql('updated text');
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
