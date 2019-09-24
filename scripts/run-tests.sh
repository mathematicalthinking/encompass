#!/bin/bash
set -ev
grunt mochaTest:"${TEST_SUITE}"
# if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
#   grunt mochaTest:travis
# else
#   grunt mochaTest:"${TEST_SUITE}"
# fi