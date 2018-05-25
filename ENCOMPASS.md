
# ENCOMPASS
ENCOMPASS is a web application designed to facilitate the process of learning from and providing feedback on student work, for both individual teachers and for collaborative and professional development purposes. For more about the project see [Github Repo](http://github.com/mathematicalthinking/encompass)

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

1. Fork this repo ([instructions](https://github.com/mathematicalthinking/encompass/blob/master/docs/GitForkRepo.md))
1. Install node version 8+
2. Install MongoDB version 3.4.10
  * Run `mongod` in terminal to start the mongo daemon
3. `npm install -g`:
  * `grunt`
  * `grunt-cli`
  * `mocha-casperjs chai casper-chai`
4. `npm install` for the rest of the dependencies
5. Clone [loginService Repo](https://github.com/mathematicalthinking/loginService)
  * `npm install`
  * `npm run`
  * Login service will be running on port 3000
6. Download existing encompass database
  * `mongorestore -d encompass filepath`
7. From root directory run `grunt`
  * Visit app at <http://localhost:8080>

## Pull Requests

See [pull requests instructions](https://github.com/mathematicalthinking/encompass/blob/master/docs/GitForkRepo.md)


## Issues

We are using Github for issues
  <http://github.com/mathematicalthinking/encompass/issues>

The wiki is also a good place to look for notes on the project
  <http://github.com/mathematicalthinking/encompass/wiki>
