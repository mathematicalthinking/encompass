#!/bin/bash
set -ev
if [ "${TEST_SUITE}" = "e2e" || "${TEST_SUITE}" = "travis" ]; then
  export DISPLAY=:99.0
  sleep 3
  grunt serve-seed &
  sleep 6
fi
NODE_ENV=seed node server/server.js &