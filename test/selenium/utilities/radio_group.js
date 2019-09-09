const { waitForAttributeToEql, getWebWelementByCss } = require('../helpers');


module.exports = class RadioButtonSelector {
  constructor(webDriver) {
    this.driver = webDriver;
  }

  selectRadioButton(groupName, buttonValue) {
    let selector = `input[type=radio][name="${groupName}"][value="${buttonValue}"]`;
    return getWebWelementByCss(this.driver, selector)
      .then((radioButton) => {
        return radioButton.click()
          .then(() => {
            return waitForAttributeToEql(this.driver, radioButton, 'value', 'true');
          });
      })
      .catch((err) => {
        throw(err);
      });
  }
};