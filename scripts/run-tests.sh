#!/bin/bash
set -ev
if [ "${TEST_SUITE}" = "e2e" || "${TEST_SUITE}" = "travis" ]; then
  export DISPLAY=:99.0
  sleep 3
  grunt serve-seed &
  sleep 6
else
  NODE_ENV=seed node server/server.js &
fi
grunt mochaTest:"${TEST_SUITE}"
# if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
#   grunt mochaTest:travis
# else
#   grunt mochaTest:"${TEST_SUITE}"
# fi