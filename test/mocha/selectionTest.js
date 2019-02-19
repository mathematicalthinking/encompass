// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');
const userFixtures = require('./userFixtures');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/selections/";

chai.use(chaiHttp);

describe('Selection CRUD operations by account type', async function() {
  const testUsers = userFixtures.users;

  function runTests(user) {
    describe(`Selection CRUD operations as ${user.details.testDescriptionTitle}`, function() {
      this.timeout('10s');
      const agent = chai.request.agent(host);
      const { username, password, accountType, actingRole } = user.details;
      const { accessibleSelectionCount, inaccessibleSelection,  accessibleSelection } = user.selections;

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
      describe('/GET selections', () => {
        it('should get all selections', done => {
          agent
          .get(baseUrl)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }

          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('selections');
          expect(res.body.selections).to.be.a('array');
          expect(res.body.selections).to.have.lengthOf(accessibleSelectionCount);
          done();
        });
        });
      });
      if (accountType !== 'A' && accountType !=='S') {
        describe('/GET inaccessible selection by id', () => {
          it('should return 403 error', done => {
            const url = baseUrl + inaccessibleSelection._id;
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
      describe('/GET selection by ID', () => {
        let id;
        if (isStudent) {
          id = '53e37f14b48b12793f001097';
        } else {
          id = accessibleSelection._id;
        }
        it('should get selection', done => {
          agent
          .get(baseUrl + id)
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            if (isStudent) {
              expect(res).to.have.status(403);
              done();
            } else {
              expect(res).to.have.status(200);
              expect(res.body).to.have.all.keys('selection');
              expect(res.body.selection).to.be.a('object');
              // let respText = res.body.selection.text.trim();
              // expect(respText).include("looking");
              expect(res.body.selection._id).to.eql(id);
              done();
            }
          });
        });
      });
      // TODO: refactor for all account types;
      if (accountType === 'A') {
        /** POST **/
      xdescribe('/POST selection', () => {
        it('should post a new selection', done => {
          agent
          .post(baseUrl)
          .send({selection: fixtures.selection.validSelection})
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.selection).to.have.any.keys('text', 'submission');
            expect(res.body.selection.text).to.eql(fixtures.selection.validSelection.text);
            done();
          });
        });
      });
      /** PUT selection text**/
      xdescribe('/PUT update selection text', () => {
        it('should change the selection text to "updated text"', done => {
          let url = baseUrl + fixtures.selection._id;
          agent
          .put(url)
          .send(
            {
                selection: {
                  text: 'updated text',
                  coordinates: fixtures.selection.validSelection.coordinates,
                  submission: fixtures.selection.validSelection.submission,
                  createdBy: fixtures.selection.validSelection.createdBy,
                }
            })
          .end((err, res) => {
            if (err) {
              console.error(err);
            }
            expect(res).to.have.status(200);
            expect(res.body.selection).to.have.any.keys('text', 'submission', 'taggingins', 'workspace');
            expect(res.body.selection.text).to.eql('updated text');
            done();
          });
        });
      });
      }

    });
  }

  for (let user of Object.keys(testUsers)) {
    let testUser = testUsers[user];
    // eslint-disable-next-line no-await-in-loop
     await runTests(testUser);
  }
});
