const {Builder, By, Key, until} = require('selenium-webdriver')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
describe('test', function() {
  this.timeout('10s');
  let driver = null;
  before(() => {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
  });
  
  after(() => {
    driver.quit();
  });
  it('should work', async function() {
    try {
    await driver.get('http://localhost:8080/devonly/fakelogin/casper');
    await driver.findElement(By.css('a[href="#/workspaces"]')).sendKeys('webdriver', Key.RETURN);
    await driver.sleep(3000);
    await driver.findElement(By.css('a[href="#/workspaces/53df8c4c3491b46d73000211/work"]')).sendKeys('webdriver', Key.RETURN);
    await driver.sleep(3000);
    }catch(err) {
      console.log(err);
    }
    
  });
});

  