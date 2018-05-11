#!/bin/false
#this shouldn't really be run on it's own, but copied to the jenkins job's PostBuildScript
set -e

export PATH=/usr/local/bin:/usr/local/nodejs:/usr/local/nodejs/bin:/usr/local/phantomjs::$PATH;

PORT=`expr 10000 + $BUILD_NUMBER`
DB=encompass_$BUILD_NUMBER
DIR=/usr/local/ci/encompass/$BUILD_NUMBER

echo -e "Demo of $BUILD_NUMBER\thttp://dev.mathforum.org:$PORT" > anchor_chain

cd $DIR

cat > config.json << EOF
{
  "port": $PORT,
  "cas": {
    "service": "http://dev.mathforum.org:$PORT/back"
  },
  "database": {
    "name": "$DB"
  }
}
EOF

mongorestore -d $DB $DIR/test/data/users.bson
node app/datasource/cache.js --pd default --src test/data/mmccloskey40.json

BUILD_ID=DAEMONIZED daemonize -c $DIR -e error.out -o server.out -p node.pid /usr/local/nodejs/bin/node $DIR/app/server.js

echo "<a href=http://dev.mathforum.org:$PORT>Encompass Build $BUILD_DISPLAY_NAME $BUILD_ID $SVN_REVISION</a><br/>" >> /var/www/html/index.html

echo "<html><head><META http-equiv='refresh' content='0;URL=http://dev.mathforum.org:$PORT'></head><body>
<a href=http://dev.mathforum.org:$PORT>Redirecting to Latest Encompass Build $BUILD_DISPLAY_NAME $BUILD_ID $SVN_REVISION</a><br/></body></html>" >> /var/www/html/latest.html
