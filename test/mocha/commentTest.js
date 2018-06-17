const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const dbSetup = require('../data/restore');
const fixtures = require('./fixtures.js');
const userCredentials = 'loginSessionUser=superuser; EncAuth=test-admin-key';
const baseUrl = "/api/comments/";

const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`;

chai.use(chaiHttp);

describe('Comment CRUD operations', function() {
  this.timeout('7s');
  before(async function() {
    await dbSetup.prepTestDb();
  });

  describe('/GET comments', () => {
    it('should get all comments', done => {
      chai.request(host)
      .get(baseUrl)
      .set('Cookie', userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.comments).to.be.a('array');
        expect(res.body.comments[0]).to.have.any.keys('label', 'ancestors', 'children', 'text');
        done();
      });
    });

    it('should fail without user credentials', done => {
      chai.request(host)
      .get(baseUrl)
      .set('Cookie', null)
      .end((err, res) => {
        expect(res).to.have.status(401 || 500);
        done();
      });
    });
  });

  describe('/GET comment by id', () => {
    it('should get one comment with matching id', done => {
      const url = baseUrl + fixtures.comment._id;
      chai.request(host)
      .get(url)
      .set('Cookie', userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.comment).to.have.any.keys('label', 'text', 'submission', 'workspace');
        expect(res.body.comment._id).to.eql(fixtures.comment._id);
        done();
      });
    });
    // it('should fail if id is invalid', done => {
    //   const url = baseUrl + '/badId';
    //   chai.request(host)
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
      chai.request(host)
      .post(baseUrl)
      .set('Cookie', userCredentials)
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
      chai.request(host)
      .put(url)
      .set('Cookie', userCredentials)
      .send({comment: {
        workspace: fixtures.comment.validComment.workspace,
        submission: fixtures.comment.validComment.submission,
        selection: fixtures.comment.validComment.workspace,
        text: 'new test text'
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
      chai.request(host)
      .put(url)
      .set('Cookie', userCredentials)
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
