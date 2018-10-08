// REQUIRE MODULES
const {Builder, Actions, By, Key, until} = require('selenium-webdriver');
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const testUsers = require('./fixtures/users');

const host = helpers.host;
let topLink = css.topBar.workspacesNew;
  let url = `${host}/#/workspaces/new`;

describe('Workspaces New', async function() {
  this.timeout(helpers.timeoutTestMsStr);
  await runTests(testUsers);
});

async function runTests(users) {
  async function _runTests(user) {
    const { accountType, actingRole, testDescriptionTitle } = user;
    describe(`As ${testDescriptionTitle}`, async function() {
      this.timeout(helpers.timeoutTestMsStr);

      let driver = null;
      before(async function() {
        driver = new Builder()
          .forBrowser('chrome')
          .build();
          await dbSetup.prepTestDb();
          return await helpers.login(driver, host, user);
        });
      after(async function() {
        return await driver.quit();
      });


      describe('Clicking topbar link', async function() {
        if (accountType === 'S' || actingRole === 'student') {
          it(`link should not be visible`, async function() {
            expect(await helpers.isElementVisible(driver, topLink)).to.be.false;
          });
        } else {
          it(`should display new workspace creation form`, async function() {
            await helpers.findAndClickElement(driver, css.topBar.workspaces);
            await helpers.findAndClickElement(driver, css.topBar.workspacesNew);
            await helpers.waitForUrlMatch(driver, /workspaces\/new/);
            expect(await helpers.isElementVisible(driver, css.newWorkspaceEnc.form)).to.be.true;
          });
        }
      });

      describe('Navigating directly', async function() {
        before(async function() {
          await driver.get(url);

        });

        if (accountType === 'S' || actingRole === 'student') {
          it('should redirect to homepage', async function() {
            await helpers.waitForUrlMatch(driver, /\//);

            expect(await helpers.isTextInDom(driver, 'Welcome Student')).to.be.true;
            expect(await helpers.isElementVisible(driver, css.newWorkspaceEnc.form)).to.be.false;
          });
        } else {
          it(`should display new workspace creation form`, async function() {
            let regex = new RegExp(url);
            await helpers.waitForUrlMatch(driver, regex);

            expect(await helpers.isElementVisible(driver, css.newWorkspaceEnc.form)).to.be.true;
          });
        }
      });

      if (accountType !== 'S' && actingRole !== 'student') {
        describe('Should display various inputs/ fields', function() {
          describe('Filter Criteria', async function() {
            const inputs = css.newWorkspaceEnc.filterCriteria.inputs;
            const fixedInputs = css.newWorkspaceEnc.filterCriteria.fixedInputs;
              for (let input of Object.keys(inputs)) {
                if (accountType === 'T' && input === 'teacher') {
                  it(`teacher field should be fixed as teacher's username`, async function() {
                    expect(await helpers.isElementVisible(driver, inputs[input])).to.be.false;
                    expect(await helpers.findAndGetText(driver, fixedInputs.teacher)).to.eql(user.username);
                  });
                } else {
                  it(`should display ${input} input`, async function() {
                    expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
                  });
                }
              }
            });

            describe('Workspace Settings', async function() {
              const inputs = css.newWorkspaceEnc.workspaceSettings.inputs;
              const fixedInputs = css.newWorkspaceEnc.workspaceSettings.fixedInputs;
              for (let input of Object.keys(inputs)) {
                if (accountType === 'T' && input === 'owner') {
                  it(`owner field should be fixed as teacher's username`, async function() {
                    expect(await helpers.isElementVisible(driver, inputs[input])).to.be.false;
                    expect(await helpers.findAndGetText(driver, fixedInputs.owner)).to.eql(user.username);
                  });
                } else {
                  it(`should display ${input} input`, async function() {
                    expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
                  });
                }
              }

              it('privacy setting should be private as default', async function() {
                let privateSel = inputs.modePrivate;
                let private = await driver.findElement(By.css(privateSel));
                expect(await private.getAttribute('checked')).to.eql('true');
              });

            });

            it('should display create button', async function() {
              expect(await helpers.isElementVisible(driver, css.newWorkspaceEnc.create));
            });
        });

        describe('Creating a new workspace', async function() {
          async function submitForm(shouldFail) {
            try {
              const submitButton = await driver.findElement(By.css(css.newWorkspaceEnc.create));
              await submitButton.click();
              if (shouldFail) {
                await helpers.waitForSelector(driver, css.general.errorMessage);
              }

            }catch(err) {
              console.log(`Error submitForm: ${err}`);
            }
          }
          describe('Submitting empty form', async function() {
            if (accountType === 'T') {
              it('should create workspace and redirect to workspace page', async function() {
                await submitForm(false);
                await helpers.waitForSelector(driver, '.workspace-name');
                let url = await helpers.getCurrentUrl(driver);
                expect(url).to.include('submissions');
              });
            } else {
              it('should display error message', async function() {
                // expect (await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
                await submitForm(true);
                expect(await helpers.isTextInDom(driver, 'Please fill in all required fields')).to.be.true;
              });
            }

          });
        });
      }

    });
  }

  for (let user of Object.keys(users)) {
    await _runTests(users[user]);
  }
}
// xdescribe('Visiting Workspace Creation', function() {
//   this.timeout(helpers.timeoutTestMsStr);

//   console.log('in describe 1');
//   // let driver = null;

//   xdescribe('should display folder set options', function() {
//     it('should display folders dropdown menu', async function() {
//       expect(await helpers.isElementVisible(driver, 'section.third.folders select')).to.be.true;
//     });
//     it('folders dropdown menu should have at least 3 options', async function() {
//       expect(await helpers.getWebElements(driver, 'section.third.folders select>option')).to.have.lengthOf.at.least(3);
//     });
//   });
