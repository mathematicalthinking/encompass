// REQUIRE MODULES
const { Builder, By } = require('selenium-webdriver');
const { it, describe, before, after } = require('mocha');
const { expect } = require('chai');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const testUsers = require('./fixtures/users');

const host = helpers.host;
let url = `${host}/workspaces/new`;

describe('Workspaces New', async function () {
  this.timeout(helpers.timeoutTestMsStr);
  function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, _id, username } =
        user;
      describe(`As ${testDescriptionTitle}`, function () {
        this.timeout(helpers.timeoutTestMsStr);

        let driver = null;
        before(async function () {
          driver = new Builder().forBrowser('chrome').build();
          await dbSetup.prepTestDb();
          return helpers.login(driver, host, user);
        });
        after(function () {
          return driver.quit();
        });

        describe('Navigating to /workspaces/new', function () {
          if (accountType === 'S' || actingRole === 'student') {
            it('should redirect to homepage', async function () {
              await helpers.navigateAndWait(driver, url, {
                selector: 'div',
              });

              await helpers.waitForUrlMatch(driver, /\//);
              expect(
                await helpers.isElementVisible(driver, '#filter-list-side')
              ).to.be.false;
            });
          } else {
            it(`should display submission selection form`, async function () {
              await helpers.navigateAndWait(driver, url, {
                selector: '#workspace-new-container',
              });
              await helpers.waitForUrlMatch(driver, /workspaces\/new/);
              expect(
                await helpers.isElementVisible(driver, '#filter-list-side')
              ).to.be.true;
            });
          }
        });

        if (accountType !== 'S' && actingRole !== 'student') {
          describe('Should display various inputs/ fields', function () {
            describe('Filter Criteria', function () {
              const inputs = css.newWorkspaceEnc.filterCriteria.inputs;
              const fixedInput =
                css.newWorkspaceEnc.filterCriteria.fixedInputs.teacher;
              for (let input of Object.keys(inputs)) {
                if (accountType === 'T' && input === 'teacher') {
                  // eslint-disable-next-line no-loop-func
                  it(`teacher field should be fixed as teacher's username`, async function () {
                    expect(
                      await helpers.isElementVisible(driver, inputs[input])
                    );
                    expect(
                      await helpers.getWebElementValue(driver, fixedInput)
                    ).to.eql(_id);
                  });
                } else {
                  // eslint-disable-next-line no-loop-func
                  it(`should display ${input} input`, async function () {
                    expect(
                      await helpers.isElementVisible(driver, inputs[input])
                    ).to.be.true;
                  });
                }
              }
            });
            describe('choosing submissions', function () {
              it('should show 0 submissions for pre-set date range', async function () {
                await helpers.findAndClickElement(driver, '.search-answers');
                await driver.sleep(100);
                expect(
                  await helpers.isTextInDom(driver, 'No submissions found')
                ).to.be.true;
              });
              if (accountType === 'A' || accountType === 'P') {
                it('should display an error message for admin and PdAdmin', async function () {
                  expect(
                    await helpers.isTextInDom(
                      driver,
                      'Please select either a teacher, assignment, problem, class, or at least one student.'
                    )
                  ).to.be.true;
                  // doing this here to avoid adding another if block
                  await helpers.findInputAndType(
                    driver,
                    '#select-add-teacher-selectized',
                    'ssmith',
                    true
                  );
                });
              }
              it('should update submission list when changing date range', async function () {
                await helpers.findInputAndType(
                  driver,
                  '#startDate',
                  '01011990'
                );
                await helpers.findAndClickElement(driver, '.search-answers');
                expect(
                  await helpers.isTextInDom(driver, 'No submissions found')
                ).to.be.false;
              });
              it('should display create button after selecting', async function () {
                await helpers.findAndClickElement(driver, '.toggle-all input');
                expect(
                  await helpers.isElementVisible(
                    driver,
                    css.newWorkspaceEnc.create
                  )
                ).to.be.true;
              });
              describe('Workspace Settings', function () {
                it('should advance to settings screen when clicking button', async function () {
                  await helpers.findAndClickElement(driver, '.create-ws');
                  expect(
                    await helpers.isTextInDom(driver, 'Create New Workspace')
                  ).to.be.true;
                });
                const inputs = css.newWorkspaceEnc.workspaceSettings.inputs;
                const fixedInputs =
                  css.newWorkspaceEnc.workspaceSettings.fixedInputs;
                for (let input of Object.keys(inputs)) {
                  if (accountType === 'T' && input === 'owner') {
                    // eslint-disable-next-line no-loop-func
                    it(`owner field should be fixed as teacher's username`, async function () {
                      expect(
                        await helpers.isElementVisible(driver, inputs[input])
                      );
                      expect(
                        await helpers.getWebElementValue(
                          driver,
                          fixedInputs.owner
                        )
                      ).to.eql(_id);
                    });
                  } else {
                    // eslint-disable-next-line no-loop-func
                    it(`should display ${input} input`, async function () {
                      expect(
                        await helpers.isElementVisible(driver, inputs[input])
                      ).to.be.true;
                    });
                  }
                }

                it('privacy setting should be private as default', async function () {
                  let privateSel = inputs.modePrivate;
                  let privateMode = await driver.findElement(
                    By.css(privateSel)
                  );
                  expect(await privateMode.getAttribute('checked')).to.eql(
                    'true'
                  );
                });
              });
            });
          });

          describe('Creating a new workspace', function () {
            it('should display error message for empty form', async function () {
              // expect (await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
              const submitButton = await driver.findElement(
                By.css(css.newWorkspaceEnc.create)
              );
              await submitButton.click();
              expect(await helpers.isTextInDom(driver, 'Missing required info'))
                .to.be.true;
            });
            it('should create workspace and redirect to workspace page', async function () {
              await helpers.findInputAndType(
                driver,
                '#ws-new-name',
                `${username}'s New Workspace`
              );
              const submitButton = await driver.findElement(
                By.css(css.newWorkspaceEnc.create)
              );
              await submitButton.click();
              await helpers.waitForSelector(driver, '.workspace-name');
              let url = await helpers.getCurrentUrl(driver);
              expect(url).to.include('submissions');
            });
            it('should have correct workspace name', async function () {
              expect(
                await helpers.findAndGetText(driver, '.workspace-name')
              ).to.eql(`${username}'s New Workspace`);
            });
            it('should have two submissions', async function () {
              expect(
                await helpers.findAndGetText(driver, '.submission_count')
              ).to.eql('2');
            });
          });
        }
      });
    }

    return Promise.all(
      Object.keys(users).map((user) => {
        _runTests(users[user]);
      })
    );
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
