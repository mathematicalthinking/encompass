## Setup

1. On the 21PSTEM Shared Google Drive get file: Developer/VmtEncompass/mt-sso_env-test
2. Move file to local mt-sso directory
3. Rename current .env to .env-dev and mt-sso_env-test to .env
4. Start sso server: in vmt/server/ `npm run dev-sso` 
5. Start EnCoMPASS test server: in encompass/ `grunt serve-seed`
5. Start EnCoMPASS tests: in encompass/ `npm run test`

Note: switch mt-sso .env files when running development server (.env -> .env-test, .env-dev -> .env)

## Executing

- In vmt/server `npm run dev-sso`
- In encompass `npm run test`

## Overview

`npm run test` runs e2e tests in app/test/selenium first, then api tests in app/test/mocha

The goal of these full stack integration tests is to make sure things are working together.  Related: cover things that are impossible (or too hard) to do with unit tests.

The risk is writing every test as an integration test and not knowing what layer things broke at.

Perhaps one rule of thumb or starting point is to cover the cross product of the operations and the models.

CRUD x Models

              Create  Read  Update  Delete
Users            X    X       X
Workspaces            X
Folders               X
Submissions           X
Selections            X
Taggings              X
Responses        X    X
Sections

## TODO
- remove diver.sleep from tests and change to blocking awaiting selectors (will cut total test time in half)
- testing for dashboard
- testing for metrics route

# Flaky Tests
- returning to login randomly results in 404 but clicking the logout button puts it back on track
