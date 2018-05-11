#!/bin/false
#this shouldn't really be run on it's own, but copied to the jenkins job's Build Script
set -e

export PATH=/usr/local/bin:/usr/local/nodejs:/usr/local/nodejs/bin:/usr/local/phantomjs::$PATH;

npm install -g grunt-cli
npm install
grunt test dist --no-color
