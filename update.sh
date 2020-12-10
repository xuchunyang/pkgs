#!/bin/sh

set -e

# FIXME 自动更新 epkgs.sqlite3, (git pull && sqlite3 <sql)
./archive-contents-to-json.sh
DEBUG=pkgs:* node dl-readme.txt.js
date +%s > data/update_timestamp
