// REQUIRE MODULES
const chai = require('chai');
const chaiHttp = require('chai-http');

// REQUIRE FILES
const fixtures = require('./fixtures.js');
const helpers = require('./helpers');

const expect = chai.expect;
const host = helpers.host;
const baseUrl = "/api/comments/";

chai.use(chaiHttp);

describe('Comment CRUD operations', function() {
  this.timeout('10s');
  const agent = chai.request.agent(host);
  before(async function(){
    try {
      await helpers.setup(agent);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    agent.close();
  });

  describe('/GET comments', () => {
    it('should get all comments', done => {
      agent
      .get(baseUrl)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.comments).to.be.a('array');
        expect(res.body.comments[0]).to.have.any.keys('label', 'ancestors', 'children', 'text');
        done();
      });
    });
  });

  describe('/GET comment by id', () => {
    it('should get one comment with matching id', done => {
      const url = baseUrl + fixtures.comment._id;
      agent
      .get(url)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.comment).to.have.any.keys('label', 'text', 'submission', 'workspace');
        expect(res.body.comment._id).to.eql(fixtures.comment._id);
        done();
      });
    });
    // it('should fail if id is invalid', done => {
    //   const url = baseUrl + '/badId';
    //   agent
    //   .get(url)
    //   .set('Cookie', userCredentials)
    //   .end((err, res) => {
    //     expect(res).to.have.status(500);
    //     done();
    //   });
    // });
  });

  /** POST **/
  describe('/POST comment', () => {
    it('should post a new comment', done => {
      agent
      .post(baseUrl)
      .send({comment: fixtures.comment.validComment})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.comment.text).to.eql(fixtures.comment.validComment.text);
        done();
      });
    });
  });

  describe('/PUT update comment text', () => {
    it('should change the text field to "this is a test"', done => {
      const url = baseUrl + fixtures.comment._id;
      // copy the comment and update it
      agent
      .put(url)
      .send({comment: {
        workspace: fixtures.comment.validComment.workspace,
        submission: fixtures.comment.validComment.submission,
        selection: fixtures.comment.validComment.workspace,
        text: 'new test text',
        createdBy: '5b1e7bf9a5d2157ef4c911a6',
      }})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.comment.text).to.eql('new test text');
        done();
      });
    });
    it('should fail to update because of missing required fields', done => {
      const url = baseUrl + fixtures.comment._id;
      // copy the comment and update it
      agent
      .put(url)
      .send({comment: {
        workspace: fixtures.comment.validComment.workspace,
        // Missing submission field will cause the failure as expected
        selection: fixtures.comment.validComment.workspace,
        text: 'new test text'
      }})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
    });
  });
})
