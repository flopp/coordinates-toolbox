#!/bin/bash

set -e

function clone() {
    local URL="$1"
    local DIR="$2"

    if [ ! -d "$DIR/.git" ] ; then
        git clone "$URL" "$DIR"
    else
        (cd "$DIR" ; git pull)
    fi
}

function download() {
    local URL="$1"
    local FILE="$2"

    if [ ! -f "$FILE" ] ; then
        mkdir -p $(dirname "$FILE")
        wget -O "$FILE" "$URL"
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


JS=".local/geographiclib/js/geographicslib.js src/js/utils.js src/js/latlng.js src/js/app.js src/js/main.js src/js/side-menu.js"
CSS="src/css/main.css src/css/side-menu.css"

B=".build/dev"
mkdir -p $B
cp src/html/index.html $B
cat $JS > $B/scripts.js
cat $CSS > $B/styles.css
