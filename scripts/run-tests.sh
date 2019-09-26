#!/bin/bash
set -ev
grunt mochaTest:"${TEST_SUITE}"
