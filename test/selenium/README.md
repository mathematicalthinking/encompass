## Executing


The tests can be run with mocha:

  mocha test/selenium/*.js

or with grunt:

  grunt integration-tests

For a cleaner view of the tests results, first run 
  grunt serve-test

And in a separate terminal window run 
  grunt integration-tests

## Overview

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
