// REQUIRE MODULES
const {Builder, until} = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const host = helpers.host;
const testUsers = require('./fixtures/users');


describe('Sections', async function () {
  function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, sections, organization, username } = user;
      const isStudent = accountType === 'S' || actingRole === 'student';

      const sectionDetails = sections.testExample;
      const sectionLink = `a[href='#/sections/${sectionDetails._id}`;


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

        describe('Visiting sections page', function () {
          before(async function () {
            await helpers.navigateAndWait(driver, `${helpers.host}/#/sections`, {selector: 'ul.your-sections'});
          });
          it('should display list of user\'s own sections', async function () {
            expect(await helpers.getWebElements(driver, 'ul.your-sections a')).to.have.lengthOf(sections.own.count);
          });
          if (!isStudent) {
            it('should display list of sections the user belongs to', async function () {
              expect(await helpers.getWebElements(driver, 'ul.collab-sections a')).to.have.lengthOf(sections.collab.count);
            });
            if (accountType === 'A') {
              it('should display list of all sections', async function () {
                expect(await helpers.getWebElements(driver, 'ul.all-sections a')).to.have.lengthOf(sections.all.count);
              });
            } else if (accountType === 'P') {
              it('should display list sections for user\'s org', async function () {
                expect(await helpers.getWebElements(driver, 'ul.org-sections a')).to.have.lengthOf(sections.org.count);
              });
            }
          }
        });

        describe(`Visiting ${sectionDetails.name}`, function () {
          before(async function () {
            await helpers.findAndClickElement(driver, sectionLink);
            await helpers.waitForSelector(driver, css.sectionInfo.container);
          });
          it('should display the section details', async function () {
            await helpers.waitForSelector(driver, css.sectionInfo.details.name);
            expect(await helpers.findAndGetText(driver, css.sectionInfo.details.name)).to.eql(sectionDetails.name);
          });
          if (!isStudent) {
            describe('adding a student to class', function() {
              before(async function() {
                await helpers.waitForSelector(driver, css.sectionInfo.editButtons.students);
              });

              let hash = {
                ssmith: ['teachertaylor','5b914a802ecaf7c30dd47493', 'teachertaylor'],
                rick: ['pdadmin','5b7321ee59a672806ec903d5', 'pdadmin'],
                pdadmin: ['drex','5b1e7bf9a5d2157ef4c911a6', 'drex']
              };
              let usernameLinkSelector = `${hash[username][2]}`;
              it('clicking on edit students should bring up menus', async function() {
                expect(await helpers.isElementVisible(driver, css.sectionInfo.editButtons.students)).to.eql(true);

                await helpers.findAndClickElement(driver, css.sectionInfo.editButtons.students);

                let addUserInput = 'input#select-add-student-selectized';
                await helpers.waitForSelector(driver, addUserInput);

                await helpers.selectSingleSelectizeItem(driver, addUserInput , hash[username][0], hash[username][1], {willInputClearOnSelect: true, toastText: 'Student Added'});

                expect(await helpers.isTextInDom(driver, usernameLinkSelector)).to.eql(true);
              });

              it('new student should persist after page refresh', async function() {
                await driver.get(`${host}/#/assignments`);
                await driver.get(`${host}/#/sections/${sectionDetails._id}`);
                expect(await helpers.isTextInDom(driver, usernameLinkSelector)).to.eql(true);
              });
            });
          }

        });

        describe('Create section', function () {
          const url = `${host}/#/sections/new`;
          const verifyForm = function () {
            const inputs = css.newSection.inputs;

            //testing for inputs
            for (let input of Object.keys(inputs)) {
              if (accountType === 'T' && input === 'teacher') {
                // eslint-disable-next-line no-loop-func
                it(`teacher field should be fixed as current user`, async function() {
                  expect(await helpers.findAndGetText(driver, css.newSection.fixedInputs.teacher)).to.eql(username);
                });
              } else if (input === 'organization') {
                if (accountType === 'A') {
                  // eslint-disable-next-line no-loop-func
                  it('should prompt user to select a teacher', async function() {
                    expect(await helpers.isTextInDom(driver, 'Please select a teacher first.')).to.be.true;
                  });
                } else {
                  it(`organization field should be fixed as user's org`, async function() {
                    expect(await helpers.findAndGetText(css.newSection.fixedInputs.organization)).to.eql(organization);
                  });
                }

              } else {
                // eslint-disable-next-line no-loop-func
                it(`${input} field should be visible`, async function() {
                  expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
                });
              }

            }
          };
          describe('Clicking link from section-info', function() {
            let sel = css.sectionInfo.newSectionButton;
            if (isStudent) {
              it(`link should not be visible`, async function() {
                expect(await helpers.isElementVisible(driver, sel)).to.be.false;
              });
            } else {
              it(`should display new section form`, async function() {
                try {
                  await helpers.findAndClickElement(driver, sel);
                  await driver.wait(until.urlIs(`${host}/#/sections/new`), 5000);
                  await helpers.waitForSelector(driver, css.newSection.form);

                }catch(err) {
                  throw(err);
                }
              });

            }
          });

          describe('Navigating directly', function() {
            before(async function() {
              try {
                await driver.get(url);
              }catch(err) {
                throw(err);
              }
            });
            if (isStudent) {
              it(`should redirect to sections`, async function() {
                await helpers.waitForSelector(driver, css.sectionHome);
                expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/#/sections`);
              });
            } else {
              it(`should display new section form`, async function() {
                try {
                  await helpers.navigateAndWait(driver, `${helpers.host}/#/sections/new`, {selector: css.newSection.form} );
                }catch(err) {
                  throw(err);
                }
              });
            }
          });
          if (!isStudent) {
            describe('Verify form inputs', async function () {
              await verifyForm();

            });

            describe('Creating section', function() {
              const inputs = css.newSection.inputs;
              const details = sections.newSection;
              const nameError = 'Name can\'t be blank';

              const submitSection = async function(details) {
                for (let detail of Object.keys(details)) {
                  try {
                    // eslint-disable-next-line no-await-in-loop
                    await helpers.findInputAndType(driver, inputs[detail], details[detail]);
                  }catch(err) {
                    throw(err);
                  }
                }
                await helpers.findAndClickElement(driver, css.newSection.create);
              };

              describe('submitting empty form', function() {
                it('should display error message(s)', async function() {
                  await helpers.findAndClickElement(driver, css.newSection.create);
                  await helpers.waitForSelector(driver, css.general.errorMessage);
                  expect(await helpers.getCurrentUrl(driver)).to.match(/sections\/new/);
                  expect(await helpers.isTextInDom(driver, nameError)).to.be.true;
                });
              });

              describe('submitting valid form', function() {
                it('should redirect to section-info page after creating', async function () {
                  await submitSection(details);
                  await helpers.waitForUrlMatch(driver, /sections\/[a-z0-9]{24}/, 10000);

                  let teacher;
                  if (accountType === 'T') {
                    teacher = username;
                  } else {
                    teacher = details.teacher;
                  }
                  expect(await helpers.isTextInDom(driver, teacher)).to.be.true;
                });
              });


          });
          }
        });
      });
    }
    return Promise.all(Object.keys(users).map(user => _runTests(users[user])));

  }
  await runTests(testUsers);
});




    // DROPDOWN MENU TO SELECT ORGANIZATION
    // describe('should display organization options', function() {
    //   it('should display organization dropdown menu', async function() {
    //     expect(await helpers.isElementVisible(driver, 'section.org.options select')).to.be.true;
    //   });
    //   it('organization dropdown menu should have at least three option', async function() {
    //     expect(await helpers.getWebElements(driver, 'section.org.options select>option')).to.have.lengthOf.at.least(3);
    //   });
    //   it('pick one organization from dropdwon menu', async function(){
    //     expect(await helpers.findAndClickElement(driver, 'section.org.options select > option:first-child'));
    //   });
