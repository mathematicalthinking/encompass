
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

 **N.B. These instructions are outdated and will not work with the new Single Sign On system that integrates EnCOMPASS with [VMT](https://github.com/mathematicalthinking/vmt). We hope to have updated instructions posted in the near future.**

1. Fork this repo ([instructions](https://github.com/mathematicalthinking/encompass/blob/master/docs/GitForkRepo.md))
2. Install node version 8+
3. Install MongoDB version 3.4.10
  * Run `mongod` in terminal to start the mongo daemon
4. `npm install -g`:
  * `grunt`
  * `grunt-cli`
  * `mocha-casperjs chai casper-chai`
5. `npm install` for the rest of the dependencies
6. Download existing encompass database
  * `mongorestore -d encompass filepath`
7. Setting up .env file
  * follow instructions from the .env.example file to create a new .env file
  * edit values as given to you from cohort.
8. From root directory run `grunt`
  * Visit app at <http://localhost:8080>

## Issues

We are using Github for issues
  <http://github.com/mathematicalthinking/encompass/issues>

The wiki is also a good place to look for notes on the project
  <http://github.com/mathematicalthinking/encompass/wiki>


