#!/bin/sh
#validator: sanity check the encompass database for relationship errors
#authored by Damola M. Sep. 9. 2014

REQUIREMENTS="mongo"
SCRIPT="scripts/scan_db.js"

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

if [ "$#" -lt 2 ] ; then
  echo "Please specify a host and database"
  exit 1;
fi

mongo $1/$2 < $SCRIPT
