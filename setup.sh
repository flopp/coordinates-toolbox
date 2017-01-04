#!/bin/bash

set -e
shopt -s dotglob

function clone() {
    local URL="$1"
    local DIR="$2"

    if [ ! -d "$DIR/.git" ] ; then
        echo "-- cloning $URL"
        git clone "$URL" "$DIR"
    else
        echo "-- updating from $URL"
        (cd "$DIR" ; git pull)
    fi
}

mkdir -p ".local"

# GeographicLib
clone "http://git.code.sf.net/p/geographiclib/code" ".local/geographiclib"
.local/geographiclib/js/js-compress.sh \
    .local/geographiclib/js/HEADER.js \
    .local/geographiclib/js/src/Math.js \
    .local/geographiclib/js/src/DMS.js \
    .local/geographiclib/js/src/Geodesic.js \
    .local/geographiclib/js/src/GeodesicLine.js \
    .local/geographiclib/js/src/PolygonArea.js \
    > .local/geographiclib/js/geographicslib.js

B=".build"
echo "-- creating $B"
mkdir -p $B
rm -f $B/*

echo "-- copying html files"
cp src/html/index.html $B

if [ -d private ] ; then
    echo "-- copying private files"
    cp private/* $B
fi

echo "-- copying js files"
JS=".local/geographiclib/js/geographicslib.js src/js/utils.js src/js/latlng.js src/js/map.js src/js/app.js src/js/main.js src/js/side-menu.js"
if [ -f analytics.js ] ; then
    JS="$JS analytics.js"
fi
cat $JS > $B/_scripts.js
SCRIPTSJS=$(sha1sum $B/_scripts.js | cut -c-40).js
mv $B/_scripts.js $B/$SCRIPTSJS

echo "-- copying css files"
CSS="src/css/main.css src/css/side-menu.css"
cat $CSS > $B/_styles.css
STYLESCSS=$(sha1sum $B/_styles.css | cut -c-40).css
mv $B/_styles.css $B/$STYLESCSS

echo "-- replacing template strings"
sed -i -e "s/SCRIPTSJS/$SCRIPTSJS/g" -e "s/STYLESCSS/$STYLESCSS/g" $B/index.html

echo
echo "You may now point your browser to 'file://$(pwd)/$B/index.html', or copy the contents of '$B' to a sever of your choice."
