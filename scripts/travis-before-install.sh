#!/bin/bash
branch=$1
githubAccount=$2

if [ $# -eq 0 ]
  then
  branch="master"
  githubAccount="mathematicalthinking"
fi

if [ $# -eq 1 ]
  then
  githubAccount="mathematicalthinking"
fi

echo "Branch: $branch"
echo "Account: $githubAccount"
  # clone mt-sso
  cd ..
  git clone --branch=$branch https://github.com/$githubAccount/mt-sso.git mt-sso
  cd mt-sso && npm i
  npm run test-travis &
  sleep 5

  # clone vmt
  cd ..
  git clone --branch=$branch https://github.com/$githubAccount/vmt.git vmt
  cd vmt/server
  npm i --only=production
  npm run test-travis &
  sleep 6
  cd ../../encompass
  /sbin/start-stop-daemon --start --quiet --pidfile /tmp/custom_xvfb_99.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -ac -screen 0 1600x1024x16
