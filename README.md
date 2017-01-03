# coordinates-toolbox
A single page web-app providing several (geographic) coordinate calculations

The app (currently) supports:

- fuzzy coordinate parsing
- waypoint projection
- distance/bearing calculation
- coordinate format transformations
- display of results on maps

Demo: https://coords.flopp.net/

![Screenshot of Waypoint Projection](https://raw.githubusercontent.com/flopp/flopp.github.io/master/coordinates-toolbox/coords-projection.jpg)

## Installation

```sh
git clone https://github.com/flopp/coordinates-toolbox.git
cd coordinates-toolbox
./setup.sh
```

All files of the web app can then be found in the `.build` folder.
Point your browser directly to `.build/index.html` or copy the content of the `.build` folder to a server of your choice.

## Third Party Stuff
The web app uses

- [GeographicLib](http://geographiclib.sourceforge.net/) (local copy)
- [Leaflet](http://leafletjs.com/) (via cdnjs)
- [Pure CSS](http://purecss.io/) (via cdnjs)
- [jQuery](https://jquery.com/) (via cdnjs)
