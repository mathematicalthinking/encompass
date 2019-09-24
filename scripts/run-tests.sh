#!/bin/bash
set -ev
grunt mochaTest:api
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  grunt mochaTest:travis
else
  grunt mochaTest:e2e
fi