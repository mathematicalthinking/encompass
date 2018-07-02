// REQUIRE MODULES
const { Builder, By, Key, until } = require('selenium-webdriver')

// REQUIRE FILES
const config = require('../../server/config');
const css = require('./selectors');

const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`

const loginUrl = `${host}/#/auth/login`;

const admin = {
  username: 'rick',
  password: 'sanchez'
};

const regUser = {
  username: 'morty',
  password: 'smith'
};

const getCurrentUrl = async function(webdriver) {
  let url;
  try {
    url = await webdriver.getCurrentUrl();
  }catch(err) {
    console.log(err);
  }
  return url;
}

const isElementVisible = async function (webDriver, selector) {
  let isVisible = false;
  try {
    const webElements = await webDriver.findElements(By.css(selector));
    if (webElements.length === 1) {
      isVisible = await webElements[0].isDisplayed();
    }
  } catch (err) {
    console.log(err);
  }
  return isVisible;
};

const getWebElements = async function (webDriver, selector) {
  let webElements = [];
  try {
    webElements = await webDriver.findElements(By.css(selector));
  } catch (err) {
    console.log(err);
  }
  return webElements;
};

const navigateAndWait = async function (webDriver, url, selector, timeout=3000) {
  await webDriver.get(url);
  return await webDriver.wait(until.elementLocated(By.css(selector)), timeout);
};

const findAndGetText = async function (webDriver, selector) {
  let text;
  try {
    let webElements = await webDriver.findElements(By.css(selector));
    if (webElements.length === 1) {
      text = await webElements[0].getText();
    }
  } catch (err) {
    console.log(err);
  }
  return text;
};

const isTextInDom = async function (webDriver, text) {
  let isInDom;
  try {
    let pageSource = await webDriver.getPageSource();
    if (typeof pageSource === 'string') {
      isInDom = pageSource.includes(text);
    }
  } catch (err) {
    console.log(err);
  }
  return isInDom;
};

const findAndClickElement = async function (webDriver, selector) {
  let elements = await getWebElements(webDriver, selector);
  if (elements.length > 0) {
    return await elements[0].click();
  }
  return;
};

const waitForAndClickElement = async function (webDriver, selector, timeout = 3000) {
  try {
    let element = await webDriver.wait(until.elementLocated(By.css(selector)), timeout);
    await element.click();
  } catch (err) {
    console.log(err);
  }
};

const waitForSelector = async function (webDriver, selector, timeout = 3000) {
  try {
    return await webDriver.wait(until.elementLocated(By.css(selector)), timeout);
  } catch (err) {
    console.log(err);
  }
};

const findInputAndType = async function (webDriver, selector, text) {
  try {
    let input = await getWebElements(webDriver, selector);
    if (input.length > 0) {
      return await input[0].sendKeys(text);
    }
  } catch (err) {
    console.log(err);
  }
  return;
};

const login = async function(webDriver, host, user=admin) {
  await navigateAndWait(webDriver, host, css.topBar.login);
  await findAndClickElement(webDriver, css.topBar.login);

  await waitForSelector(webDriver, css.login.username);
  await findInputAndType(webDriver, css.login.username, user.username);
  await findInputAndType(webDriver, css.login.password, user.password);
  await findAndClickElement(webDriver, css.login.submit);
  return await waitForSelector(webDriver, '#al_welcome');
};

const verifyElements = async function(webDriver, elements) {
  try {

  }catch(err) {
    console.log(err);
  }
};

module.exports.getWebElements = getWebElements;
module.exports.navigateAndWait = navigateAndWait;
module.exports.isElementVisible = isElementVisible;
module.exports.findAndGetText = findAndGetText;
module.exports.isTextInDom = isTextInDom;
module.exports.findAndClickElement = findAndClickElement;
module.exports.waitForSelector = waitForSelector;
module.exports.findInputAndType = findInputAndType;
module.exports.waitForAndClickElement = waitForAndClickElement;
module.exports.getCurrentUrl = getCurrentUrl;
module.exports.login = login;
module.exports.admin = admin;
module.exports.regUser = regUser;
module.exports.host = host;
module.exports.loginUrl = loginUrl;