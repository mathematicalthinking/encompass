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


# Last Run


  1) Comments
       Visiting a Selection in ESI 2014 Wednesday Reflection
         should clear out the comment field:
     AssertionError: Target cannot be null or undefined.
      at Context.<anonymous> (test/selenium/comments.js:59:80)

  2) Comments
       Visiting a Selection in ESI 2014 Wednesday Reflection
         should show the comment:
     AssertionError: the given combination of arguments (undefined and string) is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a string
      at Context.<anonymous> (test/selenium/comments.js:75:23)

  3) Comments
       "after all" hook in "Comments":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  4) Linking multiple workspaces to one assignment
       Linking new workspace to assignment
         Setting Linked Assignment
           should still display linked assignment name after page refresh:
     AssertionError: expected '' to include 'Summer\'s Org Problem / Sep 6th 2018'
      at Context.<anonymous> (test/selenium/linked_workspaces.js:89:98)
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)