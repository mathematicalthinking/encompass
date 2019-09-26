#!/bin/bash
set -ev
if [ "${TEST_SUITE}" = "api" ]; then
  NODE_ENV=seed node server/server.js &
  sleep 6
else
  export DISPLAY=:99.0
  sleep 3
  grunt serve-seed &
  sleep 20
fi