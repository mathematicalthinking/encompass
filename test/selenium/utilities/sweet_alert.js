const { waitForElementToHaveText, waitForRemoval, waitForAndClickElement } = require('../helpers');

const selectors = require('../selectors').sweetAlert;

module.exports = class SweetAlertDriver {
  constructor(webDriver) {
    this.driver = webDriver;
  }

  verifyToast(toastText, options= {}) {
    let doWaitForRemoval = options.doWaitForRemoval || true;
    let timeout = options.timeout;

    let toastSelector = selectors.toasts.title;

    return waitForElementToHaveText(this.driver, toastSelector, toastText, timeout)
      .then((results) => {
        // results is boolean
        if (!results) {
          throw(new Error(`Toast with text ${toastText} did not appear`));
        }
        if (doWaitForRemoval) {
          return waitForRemoval(this.driver, toastSelector, timeout);
        }
      })
      .catch((err) => {
        throw(err);
      });
  }

  _handleYesNoModal(confirmOrCancel, toastText, options = {}) {
    let validActions = ['confirm', 'cancel'];

    if (!validActions.includes(confirmOrCancel)) {
      throw new Error(`${confirmOrCancel} is not a valid action`);
    }

    let timeout = options.timeout;

    let btnSelector = confirmOrCancel === 'confirm' ? selectors.confirmBtn : selectors.cancelBtn;

    let modalSelector = selectors.modal;
    return waitForAndClickElement(this.driver, btnSelector, timeout)
      .then(() => {
        if (toastText) {
          return this.verifyToast(toastText);
        }
        // if not waiting for toast, just wait for removal of modal
        return waitForRemoval(this.driver, modalSelector, timeout);
      })
      .catch((err) => {
        throw(err);
      });
  }

  confirmYesNoModal(toastText) {
    return this._handleYesNoModal('confirm', toastText);
  }

  cancelYesNoModal(toastText) {
    return this._handleYesNoModal('cancel', toastText);
  }
};