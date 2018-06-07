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

const isElementVisible = async function(webDriver, selector) {
  let isVisible = false;
  try {
    const webElements = await webDriver.findElements(By.css(selector));
      if(webElements.length === 1) {
        isVisible = await webElements[0].isDisplayed();
      }
  }catch(err) {
    console.log(err);
  }
  return isVisible;
};

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

const findAndGetText = async function(webDriver, selector) {
  let text;
  try {
    let webElements = await webDriver.findElements(By.css(selector));
    if(webElements.length === 1) {
      text = await webElements[0].getText();
    }
  }catch(err) {
    console.log(err);
  }
  return text;
};

const isTextInDom = async function(webDriver, text) {
  let isInDom;
  try {
    let pageSource = await webDriver.getPageSource();
    if (typeof pageSource === 'string') {
      isInDom = pageSource.includes(text);
    }
  }catch(err) {
    console.log(err);
  }
  return isInDom;
}

module.exports.isVisibleInDOM = isVisibleInDOM;
module.exports.getWebElements = getWebElements;
module.exports.navigateAndWait = navigateAndWait;
module.exports.isElementVisible = isElementVisible;
module.exports.findAndGetText = findAndGetText;
module.exports.isTextInDom = isTextInDom;