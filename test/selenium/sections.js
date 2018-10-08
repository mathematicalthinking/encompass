// REQUIRE MODULES
const {Builder, until} = require('selenium-webdriver');
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const host = helpers.host;
const testUsers = require('./fixtures/users');


describe('Sections', async function () {
  await runTests(testUsers);
});
  async function runTests(users) {
    async function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, sections, organization, username } = user;
      const isStudent = accountType === 'S' || actingRole === 'student';

      const sectionDetails = sections.testExample;
      const sectionLink = `a[href='#/sections/${sectionDetails._id}`;


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

        describe('Visiting sections page', async function () {
          before(async function () {
            await helpers.findAndClickElement(driver, css.topBar.sections);
            await helpers.waitForSelector(driver, 'ul.your-sections');
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
          });
          it('should display the section details', async function () {
            expect(await helpers.isTextInDom(driver, sectionDetails.name)).to.be.true;
            // expect(await helpers.isTextInDom(driver, sectionDetails.teachers)).to.be.true;
          });
        });

        describe('Create section', function () {
          const url = `${host}/#/sections/new`;
          const verifyForm = async function () {
            const inputs = css.newSection.inputs;

            //testing for inputs
            for (let input of Object.keys(inputs)) {
              if (accountType === 'T' && input === 'teacher') {
                it(`teacher field should be fixed as current user`, async function() {
                  expect(await helpers.findAndGetText(driver, css.newSection.fixedInputs.teacher)).to.eql(username);
                });
              } else if (input === 'organization') {
                if (accountType === 'A') {
                  it('should prompt user to select a teacher', async function() {
                    expect(await helpers.isTextInDom(driver, 'Please select a teacher first.')).to.be.true;
                  });
                } else {
                  it(`organization field should be fixed as user's org`, async function() {
                    expect(await helpers.findAndGetText(css.newSection.fixedInputs.organization)).to.eql(organization);
                  });
                }

              } else {
                it(`${input} field should be visible`, async function() {
                  const thisUrl = await helpers.getCurrentUrl(driver);
                  console.log('url', thisUrl);
                  expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
                });
              }

            }
          };
          describe('Clicking link from section-info', async function() {
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
                  console.log(err);
                }
              });

            }
          });

          describe('Navigating directly', async function() {
            before(async function() {
              try {
                await driver.get(url);
              }catch(err) {
                console.log(err);
              }
            });
            if (isStudent) {
              it(`should redirect to sections/home`, async function() {
                await helpers.waitForSelector(driver, css.sectionHome);
                expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/#/sections/home`);
              });
            } else {
              it(`should display new section form`, async function() {
                try {
                  await driver.wait(until.urlIs(url));
                  expect(await helpers.isElementVisible(driver, css.newSection.form)).to.be.true;
                }catch(err) {
                  console.log(err);
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
                    await helpers.findInputAndType(driver, inputs[detail], details[detail]);
                  }catch(err) {
                    console.log(err);
                  }
                }
                await helpers.findAndClickElement(driver, css.newSection.create);
              };

              describe('submitting empty form', async function() {
                it('should display error message(s)', async function() {
                  await helpers.findAndClickElement(driver, css.newSection.create);
                  await helpers.waitForSelector(driver, css.general.errorMessage);
                  expect(await helpers.getCurrentUrl(driver)).to.match(/sections\/new/);
                  expect(await helpers.isTextInDom(driver, nameError)).to.be.true;
                });
              });

              describe('submitting valid form', async function() {
                it('should redirect to section-info page after creating', async function () {
                  await submitSection(details);
                  // await helpers.waitForSelector(driver, 'div.section-info-detail.name p', 10000);
                  await helpers.waitForUrlMatch(driver, /sections\/[a-z0-9]{24}/, 10000);
                  console.log('after url match');
                  // expect(await helpers.isTextInDom(driver, details.name)).to.be.true;

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
    for (let user of Object.keys(users)) {
      await _runTests(users[user]);
    }
  }



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
