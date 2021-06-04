## POSSIBLY DEAD FILES
- app/components/home-page-problems.js
- app/components/student-matching.hbs & .js
- modal-confirm.hbs & .js
- modal-delete.hbs & .js
- all modals not with sweetalert
- workspace-new-enc.hbs / .js & workspace-new-pows.hbs / .js
- app/templates/workspace/index.hbs
- empty.hbs
- _problem-new.scss

## DEAD CODE
- isSmallHeader in dashboard-workspaces-list.js

## NEEDS REFACTOR
- server/middleware/access/answers.js
- app/routes/workspace_route.js -> use native Ember calls
- routes that only render a single component
- responses_new_submission_route.js seems clunky
- form-info.scss
- scss to be mobile-first

## UNSURE OF FUNCTION
- app/templates/workspace/submission.hbs v. app/templates/components/workspace-submission.hbs
- app/routes/workspaces_index_route.js v. app/routes/workspaces_route.js