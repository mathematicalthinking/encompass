## Setup

1. On the 21PSTEM Shared Google Drive get file: Developer/VmtEncompass/mt-sso_env-test
2. Move file to local mt-sso directory
3. Verify filename is .env_test
4. Start sso server: in mt-sso/ `npm run test`
5. In terminal in /encompass `npm run seed`
6. In terminal in /encompass `npm run test-back`
7. In new terminal in /encompass `npm run start-test`
8. In new terminal in /encompass `npm run selenium`

Note: switch mt-sso .env files when running development server (.env -> .env-test, .env-dev -> .env)

## Overview

`npm run test` runs e2e tests in app/test/selenium first, then api tests in app/test/mocha

The goal of these full stack integration tests is to make sure things are working together. Related: cover things that are impossible (or too hard) to do with unit tests.

The risk is writing every test as an integration test and not knowing what layer things broke at.

Perhaps one rule of thumb or starting point is to cover the cross product of the operations and the models.

CRUD x Models

              Create  Read  Update  Delete

Users X X X
Workspaces X
Folders X
Submissions X
Selections X
Taggings X
Responses X X
Sections
Problems X X X X

## 16 out of 22

## assignments_student - all pass 7/24/2021

## assignments_teacher - all pass 7/24/2021

## base - all pass 7/24/2021

## comments - all pass 7/24/2021

## confirm_email - all pass 7/26/2021

## folders - all pass 7/24/2021

## forgot_password - all pass 7/26/2021

## linked_workspaces - 4 fail 7/28/2021

## mentoring_approving - all pass 9/27/2021

## mentoring - 3 fail

1. Mentoring Interactions
   Visting Responses List
   should indicate that thread has unread reply:
   TimeoutError: Wait timed out after 10076ms
   at /Users/timothyleonard/Documents/21PSTEM/migration/encompass/node_modules/selenium-webdriver/lib/webdriver.js:897:17
   at processTicksAndRejections (internal/process/task_queues.js:97:5)

2. Mentoring Interactions
   Viewing response in paneled view
   Submitting revision from response page
   should successfully create revision:
   TimeoutError: Wait timed out after 10067ms
   at /Users/timothyleonard/Documents/21PSTEM/migration/encompass/node_modules/selenium-webdriver/lib/webdriver.js:897:17
   at processTicksAndRejections (internal/process/task_queues.js:97:5)

3. Mentoring Interactions
   Viewing response in paneled view
   Submitting revision from response page
   linked workspace should have been updated:
   ElementNotInteractableError: element not interactable
   (Session info: chrome=92.0.4515.107)
   at Object.throwDecodedError (node_modules/selenium-webdriver/lib/error.js:517:15)
   at parseHttpResponse (node_modules/selenium-webdriver/lib/http.js:642:13)
   at Executor.execute (node_modules/selenium-webdriver/lib/http.js:568:28)
   at processTicksAndRejections (internal/process/task_queues.js:97:5)
   at async thenableWebDriverProxy.execute (node_modules/selenium-webdriver/lib/webdriver.js:731:17)
   at async Context.<anonymous> (test/selenium/mentoring.js:288:9)

## parent_workspace - all pass 7/29/2021

- flaky: link showing up in time to continue to workspace

## problems_info - 3 fail

## problems_new - all pass 7/27/2021

## problems - all pass 7/27/2021

## reset_password - all pass 7/24/2021

## responses - all pass 7/24/2021

## sections - all pass 7/24/2021

- flaky: new student should persist after page refresh

## signup - all pass 7/24/2021

## users - all pass 7/24/2021

## workspace_settings - all pass 7/24/2021

## workspaces_new - all pass 7/24/2021

## workspaces - all pass 7/24/2021
