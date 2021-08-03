//TODO THIS WORKS COMPLETELY DIFFERENLTY NOW

// REQUIRE MODULES
const { Builder, By } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const testUsers = require('./fixtures/users');

const host = helpers.host;
let url = `${host}/workspaces/new`;

xdescribe('Workspaces New', async function() {
  this.timeout(helpers.timeoutTestMsStr);
  function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, _id, username } = user;
      describe(`As ${testDescriptionTitle}`, function() {
        this.timeout(helpers.timeoutTestMsStr);

        let driver = null;
        before(async function() {
          driver = new Builder()
            .forBrowser('chrome')
            .build();
            await dbSetup.prepTestDb();
            return helpers.login(driver, host, user);
          });
        after(function() {
          return driver.quit();
        });


        describe('Clicking topbar link', function() {
          if (accountType === 'S' || actingRole === 'student') {
            it('should redirect to homepage', async function() {
              await helpers.navigateAndWait(driver, `${host}/workspaces`, {});
              await helpers.navigateAndWait(driver, `${host}/workspaces/new`, {});

              await helpers.waitForUrlMatch(driver, /\//);

              expect(await helpers.isTextInDom(driver, 'Welcome Student')).to.be.true;
              expect(await helpers.isElementVisible(driver, "#filter-list-side")).to.be.false;
            });
          } else {
            it(`should display new workspace creation form`, async function() {
              await helpers.navigateAndWait(driver, `${host}/workspaces`, {selector: '#workspace-list-container'});
              await helpers.navigateAndWait(driver, `${host}/workspaces/new`, {selector: '#workspace-new-container'});
              await helpers.waitForUrlMatch(driver, /workspaces\/new/);
              expect(await helpers.isElementVisible(driver, "#filter-list-side")).to.be.true;
            });
          }
        });

        describe('Navigating directly', function() {
          before(async function() {
            await driver.get(url);

          });

          if (accountType === 'S' || actingRole === 'student') {
            it('should redirect to homepage', async function() {
              await helpers.waitForUrlMatch(driver, /\//);

              expect(await helpers.isTextInDom(driver, 'Welcome Student')).to.be.true;
              expect(await helpers.isElementVisible(driver, "#filter-list-side")).to.be.false;
            });
          } else {
            it(`should display new workspace creation form`, async function() {
              let regex = new RegExp(url);
              await helpers.waitForUrlMatch(driver, regex);

              expect(await helpers.isElementVisible(driver, "#filter-list-side")).to.be.true;
            });
          }
        });

        if (accountType !== 'S' && actingRole !== 'student') {
          describe('Should display various inputs/ fields', function() {
            describe('Filter Criteria', function() {
              const inputs = css.newWorkspaceEnc.filterCriteria.inputs;
              const fixedInputs = css.newWorkspaceEnc.filterCriteria.fixedInputs;
                for (let input of Object.keys(inputs)) {
                  if (accountType === 'T' && input === 'teacher') {
                    // eslint-disable-next-line no-loop-func
                    it(`teacher field should be fixed as teacher's username`, async function() {
                      expect(await helpers.isElementVisible(driver, inputs[input])).to.be.false;
                      expect(await helpers.findAndGetText(driver, fixedInputs.teacher)).to.eql(user.username);
                    });
                  } else {
                    // eslint-disable-next-line no-loop-func
                    it(`should display ${input} input`, async function() {
                      expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
                    });
                  }
                }
              });

              xdescribe('Workspace Settings', function() {
                const inputs = css.newWorkspaceEnc.workspaceSettings.inputs;
                const fixedInputs = css.newWorkspaceEnc.workspaceSettings.fixedInputs;
                for (let input of Object.keys(inputs)) {
                  if (accountType === 'T' && input === 'owner') {
                    // eslint-disable-next-line no-loop-func
                    it(`owner field should be fixed as teacher's username`, async function() {
                      expect(await helpers.isElementVisible(driver, inputs[input])).to.be.false;
                      expect(await helpers.findAndGetText(driver, fixedInputs.owner)).to.eql(user.username);
                    });
                  } else {
                      // eslint-disable-next-line no-loop-func
                      it(`should display ${input} input`, async function() {
                      expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
                    });
                  }
                }

                it('privacy setting should be private as default', async function() {
                  let privateSel = inputs.modePrivate;
                  let privateMode = await driver.findElement(By.css(privateSel));
                  expect(await privateMode.getAttribute('checked')).to.eql('true');
                });

              });

              it('should display create button', async function() {
                expect(await helpers.isElementVisible(driver, css.newWorkspaceEnc.create));
              });

              xdescribe('teacher pool', function() {
                let selectors = css.newWorkspaceEnc.filterCriteria;
                let teacherSel = selectors.inputs.teacher;
                let test;
                let fixed = selectors.fixedInputs.teacher;
                let clearSelector = css.newWorkspaceEnc.clear;

                before(async function() {
                  // teacherInput = await helpers.getWebElements(driver, selector);
                  if (accountType !== 'T') {
                    test = await helpers.selectOption(driver, teacherSel, _id, true);
                  }

                });
                if (accountType === 'A' || accountType === 'P') {
                  it('should contain current user', function() {
                    expect(test).to.eql(true);
                  });

                  it('clicking x button should clear input', async function() {
                    await helpers.findAndClickElement(driver, clearSelector);
                    let selectText = await helpers.findAndGetText(driver, teacherSel);
                    await driver.sleep(100);
                    expect(selectText).to.contain('Please select');
                  });
                }
                if (accountType === 'T') {
                  it('should be fixed as current user', async function() {
                    expect(await helpers.isElementVisible(driver, teacherSel)).to.be.false;
                  let text = await helpers.findAndGetText(driver, fixed);
                  expect(text).to.eql(username);
                  });

                }
              });
              xdescribe('owner pool', function() {
                let selectors = css.newWorkspaceEnc.workspaceSettings;
                let ownerSel = selectors.inputs.owner;
                let test;
                let fixed = selectors.fixedInputs.owner;
                let clearSelector = css.newWorkspaceEnc.clear;

                before(async function() {
                  // teacherInput = await helpers.getWebElements(driver, selector);
                  if (accountType !== 'T') {
                    test = await helpers.selectOption(driver, ownerSel, _id, true);
                  }

                });
                if (accountType === 'A' || accountType === 'P') {
                  it('should contain current user', function() {
                    expect(test).to.eql(true);
                  });

                  it('clicking x button should clear input', async function() {
                    await helpers.findAndClickElement(driver, clearSelector);
                    let selectText = await helpers.findAndGetText(driver, ownerSel);
                    await driver.sleep(100);
                    expect(selectText).to.contain('Please select');
                  });
                }
                if (accountType === 'T') {
                  it('should be fixed as current user', async function() {
                    expect(await helpers.isElementVisible(driver, ownerSel)).to.be.false;
                  let text = await helpers.findAndGetText(driver, fixed);
                  expect(text).to.eql(username);
                  });

                }
              });
          });

          describe('Creating a new workspace', function() {
            async function submitForm(shouldFail) {
              try {
                const submitButton = await driver.findElement(By.css(css.newWorkspaceEnc.create));
                await submitButton.click();
                if (shouldFail) {
                  await helpers.waitForSelector(driver, css.general.newErrorMessage);
                }

              }catch(err) {
                console.log(`Error submitForm: ${err}`);
              }
            }
            describe('Submitting empty form', function() {
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

    return Promise.all(Object.keys(users).map(user=>{
      _runTests(users[user]);
    }));
  }
  await runTests(testUsers);
});


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

