const {Builder, By, Key, until} = require('selenium-webdriver')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const host = 'http://localhost:8080';
const user = 'casper';

describe('Visiting Workspaces', function() {
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

  it('should land us at /workspaces', async function() {
    let url;
    try {
      await driver.get(`${host}/devonly/fakelogin/${user}`);
      await driver.findElement(By.css('a[href="#/workspaces"]')).sendKeys('webdriver', Key.RETURN);
      await driver.findElement(By.id('workspace_listing'));
      url = await driver.getCurrentUrl();
    }catch(err) {
      console.log(err);
    }
    expect(url).to.equal(`${host}/#/workspaces`);
    
  });

  it('should display a bunch of workspaces', async function() {
    let workspaces;
    let names;
    try {
      workspaces = await driver.findElements(By.css('span.workspace_info'));
      names = await Promise.all(workspaces.map((el) => {
        return el.getText();
      }));
      await driver.sleep(3000);
    }catch(err) {
      console.log(err);
    }
    expect(names.length).to.be.above(2);
   
  });
  
  describe('visiting Frog Farming / Grade 4', function() {
    it('should render workspace', async function() {
      let url;
      let workspaceId = '53df8c4c3491b46d73000211';
      try {
      await driver.findElement(By.css(`a[href="#/workspaces/${workspaceId}/work"]`)).sendKeys('webdriver', Key.RETURN);
      await driver.wait(until.elementLocated(By.id('rightArrow')), 3000);
      url = await driver.getCurrentUrl();
      }catch(err) {
        console.log(err);
      }
      expect(url).to.equal(`${host}/#/workspaces/${workspaceId}/submissions/53df8c4c3491b46d73000201`);
    });
    
    it('should display submission navigation arrows, and revision links', async function() {
      let isRightArrow;
      let isLeftArrow;
      let breadcrumbs;
      try {
        isRightArrow = await driver.findElement(By.id('rightArrow')).isDisplayed();
        isLeftArrow = await driver.findElement(By.id('leftArrow')).isDisplayed();
        breadcrumbs = await driver.findElement(By.css('ul.breadcrumbs')).getText();
      } catch(err) {
        console.log(err);
      }
      expect(isRightArrow).to.be.true;
      expect(isLeftArrow).to.be.true;
      expect(breadcrumbs).to.contain('1');
    });
  });
});

  