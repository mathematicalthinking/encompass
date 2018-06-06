const {Builder, By, Key, until} = require('selenium-webdriver')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const _ = require('underscore');


const isVisibleInDOM = async function (webDriver, selector) {
  let isVisible = false;
  try {
    const webElements = await webDriver.findElements(By.css(selector));
    if (!_.isEmpty(webElements)) {
      isVisible = true;
    }
  }catch(err) {
    console.log(err);
  }
  return Promise.resolve(isVisible);
}

const getWebElements = async function(webDriver, selector) {
  let webElements = [];
  try {
    webElements = await webDriver.findElements(By.css(selector));
  }catch(err) {
    console.log(err);
  }
  return webElements;
}

const navigateAndWait = async function(webDriver, url, selector, timeout) {
  await webDriver.get(url);
  return await webDriver.wait(until.elementLocated(By.css(selector)), timeout);
}

const matchElementText = async function(webDriver, selector, expected) {
  let text;
  try {
    let element = await webDriver.findElement(By.css(selector));
    if(element) {
      text = await element.getText();
    }
  }catch(err) {
    console.log(err);
  }
  return Promise.resolve(expect(text).to.match(expected));
}

const doesElementContainText = async function(webDriver, selector, expected) {
  let text;
  try {
    let element = await webDriver.findElement(By.css(selector));
    if(element) {
      text = await element.getText();
    }
  }catch(err) {
    console.log(err);
  }
  return Promise.resolve(expect(text).to.contain(expected));
}

module.exports.isVisibleInDOM = isVisibleInDOM;
module.exports.getWebElements = getWebElements;
module.exports.navigateAndWait = navigateAndWait;
module.exports.matchElementText = matchElementText;
module.exports.doesElementContainText = doesElementContainText;