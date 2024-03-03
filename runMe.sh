#!/bin/bash

echo "$0: Start: $(date)"

echo "Viewing the PostgreSQL Client Version"

psql -Version

echo "Viewing the PostgreSQL Server Version"

export PGPASSWORD='cE36kGD5S62mbMPgGEeWWMxAvEFjvs'

PGPASSWORD=YDvVbWfxGywuiWQnA2LgTLZOXF8JFmPw psql -h dpg-cnia7e021fec73cqlkhg-a.oregon-postgres.render.com -U bookmarks_api_db_user bookmarks_api_db

echo "$0: End: $(date)"