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

module.exports.isVisibleInDOM = isVisibleInDOM;
module.exports.getWebElements = getWebElements;