## Setup

1. On the 21PSTEM Shared Google Drive get file: Developer/VmtEncompass/mt-sso_env-test
2. Move file to local mt-sso directory
3. Start sso server: in /mt-sso `npm run test`
4. Start vmt test server: in /vmt/server `npm run test-start`
5. In /encompass `npm run seed`
6. `npm run test`
7. In new terminal in /encompass `npm run selenium --test=<filename>.js`
8. If no test specified, all tests will run (~20 mins)

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

## 24 out of 24

## assignments_new - all pass 12/23/2021

## assignments_student - all pass 12/23/2021

## assignments_teacher - all pass 12/23/2021

## base - all pass 12/23/2021

## comments - all pass 12/23/2021

## confirm_email - all pass 12/23/2021

## folders - all pass 12/23/2021

## forgot_password - all pass 12/23/2021

## linked_workspaces - all pass 12/23/2021

## mentoring_approving - all pass 12/27/2021

## mentoring - all pass 12/27/2021

## parent_workspace - all pass 12/23/2021

## problems_info - all pass 12/27/2021

## problems_new - all pass 12/23/2021

## problems - all pass 12/23/2021

## reset_password - all pass 12/23/2021

## responses - 1 fail 12/23/2021

## sections - all pass 12/23/2021

## signup - all pass 12/23/2021

## users - all pass 12/23/2021

## vmt_import - all pass 12/27/2021

## workspace_settings - all pass 12/23/2021

## workspaces_new - needs updating

## workspaces - all pass 12/23/2021
