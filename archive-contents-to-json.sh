#!/bin/sh

set -e
# set -x

echo "检查有没有安装 Emacs ..."
test -z "$EMACS" && EMACS=$(which emacs)
echo "检查 Emacs 版本是否大于 25.1 ..."
"$EMACS" --version | sed 1q
"$EMACS" -Q --batch --eval '(kill-emacs (if (version<= "25.1" emacs-version) 0 1))'
echo "检查有没有安装 package-build ..."
"$EMACS" -Q --batch -L package-build -l package-build

echo "下载 archive-contents ..."
DEBUG=pkgs node archive-contents-to-json.js
echo "下载 archive-contents ... Done"

echo "生成 archive-contents.json ..."
"$EMACS" -Q --batch -L package-build -l archive-contents-to-json.el
echo "生成 archive-contents.json Done"
