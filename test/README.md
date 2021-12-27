## Setup

1. On the 21PSTEM Shared Google Drive get file: Developer/VmtEncompass/mt-sso_env-test
2. Move file to local mt-sso directory
3. Start sso server: in /mt-sso `npm run test`
4. In /encompass `npm run seed`
5. `npm run test`
6. In new terminal in /encompass `npm run selenium --test=<filename>.js`
7. If no test specified, all tests will run (~20 mins)

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

## 21 out of 23

## assignments_new - all pass 12/23/2021

## assignments_student - all pass 12/23/2021

## assignments_teacher - all pass 12/23/2021

## base - all pass 12/23/2021

## comments - all pass 12/23/2021

## confirm_email - all pass 12/23/2021

## folders - all pass 12/23/2021

## forgot_password - all pass 12/23/2021

## linked_workspaces - all pass 12/23/2021

## mentoring_approving - 2 fail 9/29/2021

2. Mentoring / Approving Interactions
   Submitting response for approval
   should display new reply with pending approval status:

   AssertionError: expected 'Approved' to deeply equal 'Pending Approval'

   - expected - actual

   -Approved
   +Pending Approval

   at Context.<anonymous> (test/selenium/mentoring_approving.js:169:48)
   at runMicrotasks (<anonymous>)
   at processTicksAndRejections (internal/process/task_queues.js:97:5)

3. Mentoring / Approving Interactions
   Visting Responses List
   should indicate that thread has pending reply:

   AssertionError: expected 'rgb(53, 168, 83)' to deeply equal 'rgb(255, 210, 4)'

   - expected - actual

   -rgb(53, 168, 83)
   +rgb(255, 210, 4)

   at Context.<anonymous> (test/selenium/mentoring_approving.js:242:60)
   at runMicrotasks (<anonymous>)
   at processTicksAndRejections (internal/process/task_queues.js:97:5)

## mentoring - 1 fail

1. Mentoring Interactions
   Visting Responses List
   should indicate that thread has unread reply:
   TimeoutError: Wait timed out after 10066ms
   at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:895:17
   at runMicrotasks (<anonymous>)
   at processTicksAndRejections (internal/process/task_queues.js:97:5)

## parent_workspace - all pass 12/23/2021

## problems_info - all pass 12/27/2021

## problems_new - all pass 12/23/2021

## problems - all pass 12/23/2021

## reset_password - all pass 12/23/2021

## responses - 1 fail 12/23/2021

## sections - all pass 12/23/2021

## signup - all pass 12/23/2021

## users - all pass 12/23/2021

## workspace_settings - all pass 12/23/2021

## workspaces_new - needs updating

## workspaces - all pass 12/23/2021
