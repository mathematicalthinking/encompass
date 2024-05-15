# encompass

EnCoMPASS is a project of the 21st Century Partnership for STEM Education, Mathematical Thinking, and Drexel University.

## Prerequisites:

### Install Single Signon App

[MT-SSO](https://github.com/mathematicalthinking/mt-sso)

Note: these procedures have the general prerequisites for all three apps required to run Encompass, as well as the specific installations to install the mt-sso Single Signon App.

### Install Virtual Math Teams

[VMT](https://github.com/mathematicalthinking/vmt)

### Install Ember CLI

[Ember CLI](https://ember-cli.com/)
npm install ember-cli # note if -g desired, may need sudo

## Install Encompass

### set up ssh keys in github

[ssh access to github](https://github.com/settings/keys)

    cd <code directory>
    git clone git@github.com:mathematicalthinking/encompass.git

## Running / Development

Note: for troubleshooting MongoDB see mt-sso readme.md

- On M1 Mac start MongoDB `mongod --config /opt/homebrew/etc/mongod.conf`
- On Intel Mac start MongoDB `mongod --config /usr/local/etc/mongod.conf`
- start mt-sso `npm run start` (in mt-sso directory)
- start vmt (optional) `npm run dev` (in vmt/server)
- `npm run dev` (in encompass)
- Visit your app at [http://localhost:8081](http://localhost:8081).

## Branching Strategy

- develop is the default branch for this repo. all PR's go through develop first for integration
- all feature branches should originate from develop and merge back into develop
- enc-test.mathematicalthinking.org is the deployment for develop
- encompass.mathematicalthinking.org is the deployment for main

## Running Tests

- in /mt-sso: `npm run test`
- `npm run test`
- `npm run selenium --test=[filename]` (if ran without filename, will run e2e test for entire application ~20 min)
- see README.md in /test

### **Note:**

If you run into the following error while running tests:
"WebDriverException: unknown error: cannot find Chrome binary"

- Ensure correct ChromeDriver is installed. (https://chromedriver.chromium.org/downloads)
- Chrome application must be in Applications directory
- For more info on Selenium: (https://www.selenium.dev/documentation/webdriver/getting_started/)

## Ports (see app_server/config.js)

- dev server: 8080
- dev client: 8081
- test server: 8082
- test client: 8083

## .env

- There is one .env for the entire project
- Switch block in app_server/server.js picks out required variables

## Client `/app`

EnCOMPASS uses Ember for the client and was recently migrated to Ember Octane from v2.14. Portions are not fully migrated.

### workflow

1. teacher creates a class/section ("class" is a reserve word in JS, so "section" refers to a teacher's class)
2. teacher add students to class/section and creates subgroups in class
3. teacher creates assignment with linked workspaces and parent workspace for students to complete
4. students submit answers to problem, answers are populated in linked workspaces and parent workspace
5. teacher and students review submissions in

### components

Ember is switching to Glimmer for its component engine. Components that have their templates (.hbs files) in `app/components` have been migrated. Their classes (.js files) will look like native JS classes. Components with templates in `app/templates/components` have not been migrated and still use Classic Ember component classes. I tried to combine similar components when possible.

- `admin-problem-filter` and `admin-workspace-filter` could be comined
- `problem-filter` and `workspace-filter` could be combined

### mixins

usage of mixins (found in `app/mixins`) are deprecated - they still work for classic components but should be refactored away

1. user session info is accessed in one of two ways:

- using the route model: `const currentUser = this.modelFor('application')` and passing it as an attribute to child components
- a service called `currentUser` found in `app/service/currentUser`. called in the app with `@service currentUser`, the user is accessed with `this.currentUser.user`

2. `error_handling_mixin` is now a Glimmer component to be extended by other components (see `add-create-student.js`)

3. some mixins simply are no longer used

### routes

Ember has opinionated routing. All routes are found in `app/router.js`. Each route found there corresponds to a file in `app/routes/` e.g. encompass.mathematicalthinking.org/#/workspaces corresponds to `app/routes/workspaces` and encompass.mathematicalthinking.org/#/workspaces/618c38d408dc48628cbd59e7/submissions/61d45c2308dc48628cc0fbed corresponds to `app/routes/workspace/submissions/submission.js` (see `resetNamespace` in `router.js`)

Each route has a corresponding template that gets rendered. It should be in the corresponding place in `app/templates` e.g. `app/templates/workspaces`. A route might have a controller to handle user interaction at the route level, found in the corresponding location in `app/controllers`. These behave slightly differently than components, but can basically be treated like a component.

- the workspaces route is the most complicated:

1. the user clicks a link to /workspaces/:id/work
2. if no submissions, reroute to /workspaces/:id/info and finish, otherwise reroute to /workspaces/:id/submissions/first
3. find the most recent submission in the workspace and route to /workspaces/:id/submissions/:id_of_first_submission

### `/vendor`

Libraries that are not managed by npm are added in the `/vendor` directory and configured into the bundle in `/ember-cli-build.js` including:

1. selectize input library (see `app/components/selectize-input.js`)
2. typeahead library (see `app/components/twitter-typeahead.js`)
3. selection libraries (`vendor/image-tagging.js` and `vendor/selection-highlighting.js`) that are used in `app/components/workspace-submission.js`

### `/helpers`

Ember's template library only allows simple logical checks. For more complex logic, you can use helper functions found in `app/helpers` and appear in templates as `{{<helper-name> arg1 arg2 arg3 ...}}` ex: `{{format-date workspace.createDate 'YYYY-MM-DD'}}` uses format-date.js and returns workspace.createDate in 'YYYY-MM-DD' format.

### Ember Data

- ember data makes requests to `<host>/api/<route>`
- responses must be formatted to ember data's specifications

## Server `/app_server`

EnCOMPASS uses an express.js server. The Ember client wouldn't allow a directory called `/server`, so `/app_server` is the solution

### routes

- routes are found in `/app_server/datasource/api`
- all routes are imported to `/app_server/datasource/api/index.js` and exported as a single module of GET, POST, PUT, and DELETE methods
- module is imported to `/app_server/server.js`

## Linting

- `npm run lint:hbs`
- `npm run lint:js`
- `npm run lint:js -- --fix`

## Deploying

See private docs.

## Further Reading / Useful Links

- [21PSTEM](https://21pstem.org/)
- [Mathematical Thinking](https://mathematicalthinking.org/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
