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


  702 passing (11m)
  132 pending
  16 failing

  1) Assignments as Student
       As Teacher acting as Student
         Submitting response to assignment
           should display errors if empty form is submitted:
     TimeoutError: Wait timed out after 8126ms
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:894:17
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  2) Folders
       Visiting a ESI 2014 Wednesday Reflection
         "before all" hook for "should display the folder name":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  3) Linking multiple workspaces to one assignment
       Linking new workspace to assignment
         "before all" hook in "Linking new workspace to assignment":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  4) Linking multiple workspaces to one assignment
       Visiting assignment page
         "before all" hook for "should display 3 linkedWorkspaces":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  5) Linking multiple workspaces to one assignment
       Revising from responses page
         For original linked workspace
           "before all" hook in "For original linked workspace":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  6) Linking multiple workspaces to one assignment
       Revising from responses page
         For newly linked workspace
           "before all" hook in "For newly linked workspace":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  7) Mentoring Interactions
       Visting Responses List
         "before all" hook for "should display solver tab and display count":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  8) Mentoring Interactions
       Viewing response in paneled view
         "before all" hook for "should display submission view":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  9) Responses
       Visiting a submission with selections
         "before all" hook for "should have a respond link":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  10) Responses
       Visiting a submission response url
         "before all" hook for "should advertise being a new response":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  11) Workspace info / settings interactions
       Navigating to workspace info page
         "before all" hook for "should show workspace settings container":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  12) Workspace info / settings interactions
       Changing workspace name
         "before all" hook for "should display success toast message":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  13) Workspace info / settings interactions
       Toggling allow automatic updates
         Toggling from yes to no
           "before all" hook for "should display success toast message":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  14) Workspace info / settings interactions
       Toggling allow automatic updates
         Toggling from no to yes
           "before all" hook for "should display success toast message":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  15) Workspace info / settings interactions
       Setting Linked Assignment
         "before all" hook for "should display success toast message":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)

  16) Workspace info / settings interactions
       Adding / removing collaborators
         "before all" hook for "should successfully add the user as collab":
     Error: Server was killed with SIGTERM
      at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/remote/index.js:248:24
      at runMicrotasks (<anonymous>)
      at processTicksAndRejections (internal/process/task_queues.js:97:5)