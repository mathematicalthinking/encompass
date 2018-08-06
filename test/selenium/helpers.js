// REQUIRE MODULES
const { Builder, By, Key, until } = require('selenium-webdriver')

// REQUIRE FILES
const config = require('../../server/config');
const css = require('./selectors');

// testing timeout values
const timeoutMs = 5000;  // timeout per await
const timeoutTestMsStr = '20s';  // timeout per test

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

const newUser = {
  name: 'John Doe',
  email: 'johndoe111@gmail.com',
  organization: 'Mathematical Thinking',
  location: 'Philadelphia, PA',
  username: 'johndoe111',
  password: 'noone11',
  requestReason: 'professional development'
};

const signupErrors = {
  incomplete : 'You must complete all of the fields in order to signup.',
  terms: 'You must accept our Terms and Conditions'
};

const signinErrors = {
  incomplete: 'Missing Credentials',
  username: 'Incorrect username',
  password: 'Incorrect password.'
};

const newProblem = {
  details: {
    name: 'Test Problem',
    question: 'What is it?',
    category: '',
    additionalInfo: 'Be careful!',
  },
  privacySetting: 'E',
  imageUrl: ''
};

const newSection = {
  details: {
    name: 'Test Section',
    teachers: 'rick'
  }
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

const navigateAndWait = async function (webDriver, url, selector, timeout=timeoutMs) {
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

const waitForAndClickElement = async function (webDriver, selector, timeout = timeoutMs) {
  try {
    let element = await webDriver.wait(until.elementLocated(By.css(selector)), timeout);
    await element.click();
  } catch (err) {
    console.log(err);
  }
};

const waitForSelector = async function (webDriver, selector, timeout = timeoutMs) {
  try {
    return await webDriver.wait(until.elementLocated(By.css(selector)), timeout);
  } catch (err) {
    console.log(err);
  }
};

const waitForRemoval = async function (webDriver, selector, timeout=timeoutMs) {
  try {
    return await webDriver.wait(async function() {
      return await isElementVisible(webDriver, selector) === false;
    }, timeout=timeoutMs);
  } catch (err) {
    console.log(err);
  }
}

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
  return await waitForSelector(webDriver, css.topBar.logout);
};

const signup = async function(webDriver, host, missingFields=[], user=newUser,  acceptedTerms=true) {
  const inputs = css.signup.inputs;
  for (let input of Object.keys(inputs)) {
    if (input !== 'terms' && !missingFields.includes(input)) {
      try {
        await findInputAndType(webDriver, inputs[input], newUser[input]);
      }catch(err){
        console.log(err);
      }
    }
  }
  try {
    if (acceptedTerms) {
      await findAndClickElement(webDriver, inputs.terms);
    }
    await findAndClickElement(webDriver, css.signup.submit);
  }catch(err) {
    console.log(err);
  }
};

// use for checking if several elements are visible in dom
// elements should be an array of css selectors
const verifyElements = async function(webDriver, elements) {
  let isVisible;
  if (!Array.isArray(elements)) {
    return;
  }

    for (let el of elements) {
      try {
        isVisible = await isElementVisible(webDriver, el);
      }catch(err) {
        console.log(err);
      }
      expect(isVisible).to.be.true;
  }
};

const clearElement = async function(webDriver, element) {
  let ele;
  try {
   let elements = await getWebElements(webDriver, element);
   el = elements[0];
   await el.clear();
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
module.exports.newUser = newUser;
module.exports.signup = signup;
module.exports.signupErrors = signupErrors;
module.exports.signinErrors = signinErrors;
module.exports.clearElement = clearElement;
module.exports.newProblem = newProblem;
module.exports.waitForRemoval = waitForRemoval;
module.exports.newSection = newSection;
module.exports.timeoutTestMsStr = timeoutTestMsStr;
