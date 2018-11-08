#!/bin/bash
set -e
date

# node server/db_migration/powsToProd.js 0 10 details
# date

node server/db_migration/powsToProd.js 0 100000
date
node server/db_migration/powsToProd.js 100000 100000
date
node server/db_migration/powsToProd.js 200000 100000
date
node server/db_migration/powsToProd.js 300000 100000
date
node server/db_migration/powsToProd.js 400000 100000
date
node server/db_migration/powsToProd.js 500000 100000
date
node server/db_migration/powsToProd.js 600000 100000
date
node server/db_migration/powsToProd.js 700000 100000
date
node server/db_migration/powsToProd.js 800000 100000
date
node server/db_migration/powsToProd.js 900000 100000
date
node server/db_migration/powsToProd.js 1000000 100000
date
