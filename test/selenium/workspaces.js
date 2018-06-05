const selenium = require('selenium-webdriver');
const chai = require('chai');

const expect = chai.expect;
const assert = chai.assert;
describe('test', function() {
  this.timeout('10s');
  let driver = null;
  before(() => {
    driver = new selenium.Builder()
      .withCapabilities(selenium.Capabilities.chrome())
      .build();
    driver.getWindowHandle();
  });
  
  after(() => {
    driver.quit();
  });
  it('should work', (done) => {
    
    driver.get('http://localhost:8080/devonly/fakelogin/casper')
    .wait(elementLocated(By.class('menu.workspaces')),5000)
    .then((res) => {
      console.log(res);
      done();
    })
    .catch(done);
  });
});

  