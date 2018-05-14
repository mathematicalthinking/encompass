
# ENCOMPASS
The ENCOMPASS application is a web application designed to aid the professional development of teachers
in the education of their students through designing, using and studying rubrics for student problem
solving. For more about the project see [Github Repo](http://github.com/mathematicalthinking/encompass)

## License

* For non-commercial uses, this application is licensed under the [AGPL](https://www.gnu.org/licenses/agpl-3.0.en.html) license.
* Any use of EnCOMPASS for commercial purposes is subject to and requires a special license to be negotiated with Mathematical Thinking.
* See [EnCOMPASS license details](http://files.mathematicalthinking.org/encompass/license)


## Installation
This application uses a combination of:

* [MongoDB](http://www.mongodb.org/),
* [Restify](http://restify.com/),
* [Ember.js](http://emberjs.com/),
* [Node.js](http://nodejs.org/)

Instructions for getting started with this setup, are located [Github Repo](http://github.com/mathematicalthinking/encompass)

## Local Development Environment Setup

1. Install NVM
2. Install node version 8.6.0
  * `nvm install 8.6.0`
  * `nvm use 8.6.0`
3. Install MongoDB version 3.4.10
  * Run `mongod` in terminal to start the mongo daemon
4. From root directory run `scripts/prep.sh`
  * Checks requirements (node, npm, mongo) and installs dependencies
5. From loginService directory run node server.js
  * Login service will be running on port 3000
6. From root directory run `grunt`
  * Visit app at <http://localhost:8080>

## Issues

We are using Github for issues
  <http://github.com/mathematicalthinking/encompass/issues>

The wiki is also a good place to look for notes on the project
  <http://github.com/mathematicalthinking/encompass/wiki>
