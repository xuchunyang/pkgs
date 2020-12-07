#!/bin/sh

set -e

./archive-contents-to-json.sh
DEBUG=pkgs:* node dl-readme.txt.js
