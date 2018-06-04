const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
const server = require('../../app/server');

chai.use(chaiHttp);

/** GET **/
describe("/GET sections", () => {
  it('should get all sections', (done) => {
    chai.request(server)
      .get('/api/selections')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(10);
        done();
      });
  });
});
