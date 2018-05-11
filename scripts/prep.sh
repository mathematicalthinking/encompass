#!/bin/bash
set -e

REQUIREMENTS="node npm mongo"

for r in $REQUIREMENTS; do
  if ! type $r > /dev/null; then
    echo "you don't have $r installed or available"
    error=$r
  fi
done

if [ ! -z $error ] ; then
  echo "please see the docs http://mathforum.org/pow08/index.php/Encompass/Developers"
  echo "or file a bug http://mathforum.org/jira/browse/ENC"
  exit 1;
fi

NODE_VERSION=`node -v`
NODE_VERSION_REQUESTED=`node -e "var pjson = require('./package.json'); console.log(pjson.engines['node'])"`
if [ "$NODE_VERSION" != "$NODE_VERSION_REQUESTED" ]; then
  echo "WARNING: NODE_VERSION: $NODE_VERSION vs NODE_VERSION_REQUESTED: $NODE_VERSION_REQUESTED"
fi

npm install -g grunt-cli
npm install -g mocha-casperjs chai casper-chai
npm install

echo "\n\n\nnode modules have been installed"

mongorestore --drop -d encompass test/data/mongo-set-a

# node app/datasource/cache_cli.js --pd "Weitz" test/data/pow/mweitz.json
# node app/datasource/cache_cli.js --pd "McFall" test/data/pow/kmcfall58.json
# node app/datasource/cache_cli.js --pd "Palmer" test/data/pow/palmerlynn.json
# node app/datasource/cache_cli.js --pd "default" test/data/pow/defaultPd.json



echo "\n\n\nmongo has been prepped"

echo "go ahead and start up the server either 'grunt' or 'node app/server.js'"
