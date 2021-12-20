# encompass

EnCoMPASS is a project of the 21st Century Partnership for STEM Education, Mathematical Thinking, and Drexel University.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://ember-cli.com/)
- [Google Chrome](https://google.com/chrome/)
- MongoDB
- Mt-sso
- vmt

## Installation

- see developer guide in company docs

## Running / Development

- start MongoDB `mongod --config /usr/local/etc/mongod.conf`
- start mt-sso `npm run start` (in mt-sso directory)
- start vmt (optional) `npm run dev` (in vmt/server)
- `npm run dev` (in encompass)
- Visit your app at [http://localhost:8081](http://localhost:8081).

## Branching Strategy

- develop is the default branch for this repo. all PR's go through develop first for integration
- all feature branches should originate from develop and merge back into develop
- enc-test.mathematicalthinking.org is the deployment for develop
- encompass.mathematicalthinking.org is the deployment for main

### Running Tests

- in /mt-sso: `npm run test`
- `npm run test`
- `npm run selenium --test=[filename]`
- see README.md in /test

### Ports (see app_server/config.js)

- dev server: 8080
- dev client: 8081
- test server: 8082
- test client: 8083

### .env

- There is one .env for the entire project
- Switch block in app_server/server.js picks out required variables

### Linting

- `npm run lint:hbs`
- `npm run lint:js`
- `npm run lint:js -- --fix`

### Deploying

See private docs.

## Further Reading / Useful Links

- [21PSTEM](https://21pstem.org/)
- [Mathematical Thinking](https://mathematicalthinking.org/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
