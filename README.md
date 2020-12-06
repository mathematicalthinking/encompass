
# ENCOMPASS
ENCOMPASS is a web application designed to facilitate the process of learning from and providing feedback on student work, for both individual teachers and for collaborative and professional development purposes.

## License

* For non-commercial uses, this application is licensed under the [AGPL](https://www.gnu.org/licenses/agpl-3.0.en.html) license.
* Any use of EnCOMPASS for commercial purposes is subject to and requires a special license to be negotiated with Mathematical Thinking.
* See [EnCOMPASS license details](http://files.mathematicalthinking.org/encompass/license)


## Installation
This application uses a combination of:

* [MongoDB](http://www.mongodb.org/),
* [Express](http://expressjs.com/),
* [Ember.js](http://emberjs.com/),
* [Node.js](http://nodejs.org/)

Instructions for getting started with this setup, are located [Github Repo](http://github.com/mathematicalthinking/encompass)

## Local Development Environment Setup

 In its current state, EnCOMPASS is tightly linked with [VMT](https://github.com/mathematicalthinking/vmt). When a user signs up with EnCOMPASS, they also receive a VMT account which has the same username (and vice versa). If a user is logged in to one app, they will also be logged in to the other app. As a result, you must also be running [mt-sso](https://github.com/mathematicalthinking/mt-sso) and [VMT](https://github.com/mathematicalthinking/vmt) for user registration and login to work properly. If you do not need signup functionality while developing, then you do not need to be running VMT. If you are having a 500 or 401 error trying to log into EnCoMPASS, you may have to start up MTSSO, VMT, and ENC by running the script ```npm run dev-all``` to be able to log in properly.

 If you wish to run EnCOMPASS separately, then you just need to remove the existing auth routes (`server/datasource/api/auth`) and middleware (`server/datasource/middleware`) and put in your own system. In addition, you may want to remove the components used for importing VMT work and strip out the workspace features/logic that are specific to viewing VMT replays within EnCOMPASS.

1. Fork this repo ([instructions](https://github.com/mathematicalthinking/encompass/blob/master/docs/GitForkRepo.md))
2. Install node version 8+
3. Install MongoDB version 3.4.10
  * Run `mongod` in terminal to start the mongo daemon
4. `npm install -g`:
  * `grunt`
  * `grunt-cli`
  * `chai`
5. `npm install` for the rest of the dependencies
6. Setting up .env file
  * follow instructions from the .env.example file to create a new .env file
  * edit values as given to you from cohort.
7. From root directory run `grunt`
  * Visit app at <http://localhost:8080>

## Issues

We are using Github for issues
  <http://github.com/mathematicalthinking/encompass/issues>

The wiki is also a good place to look for notes on the project
  <http://github.com/mathematicalthinking/encompass/wiki>

## Contributions and Git Rebase Workflow

1. `git checkout master`
1. `git pull --rebase upstream master`
1. `git push origin master`
1. `git checkout -b feature-branch`
1. `git add/git commit` (on feature branch)
   - To close an issue, add 'closed #[github issue number]' to commit message
1. `git pull --rebase upstream master` (on feature branch)
1. `git push origin feature-branch`
1. Submit pull request (your feature branch to upstream master)

### More Work to do (Pull Request not accepted)

- Go to Step 5 in Git Rebase flow.

### Pull Request Accepted?

1. `git checkout master`
1. `git pull --rebase upstream master`
1. `git push origin master`

### Totally done

1. `git checkout master`
1. `git branch -d feature-branch`

### Troubleshooting

- `git remote -v` to see remote origins
- `git remote add upstream https://github.com/mathematicalthinking/encompass.git`
- if existing upstream `git remote rm upstream`

## Styleguide

We use [Prettier](https://prettier.io/) Add the VS code extension and configure it to format on save.

## Design

Please visit our [design documentation](https://github.com/mathematicalthinking/encompass/tree/master/docs/design) for styling information.


