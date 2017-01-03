#!/bin/bash

set -e

function clone() {
    local URL="$1"
    local DIR="$2"
    
    if [ ! -d "$DIR/.git" ] ; then
        echo "Cloning $URL"
        git clone "$URL" "$DIR"
    else
        echo "Updating from $URL"
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


JS=".local/geographiclib/js/geographicslib.js src/js/utils.js src/js/latlng.js src/js/map.js src/js/app.js src/js/main.js src/js/side-menu.js"
if [ -f analytics.js ] ; then
    JS="$JS analytics.js"
fi

CSS="src/css/main.css src/css/side-menu.css"

B=".build"
echo "creating $B"
mkdir -p $B
rm -f $B/*

echo "copying html files"
cp src/html/index.html $B
if [ -f "google*.html" ] ; then
    cp "google*.html" $B
fi

echo "copying js files"
cat $JS > $B/scripts.js

echo "copying css files"
cat $CSS > $B/styles.css

echo
echo "You may now point your browser to 'file://$(pwd)/$B/index.html', or copy the contents of '$B' to a sever of your choice."
