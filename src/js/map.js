Map = function(id) {
    this.id = id;

    this.marker1 = null;
    this.marker2 = null;

    this.icon1 = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]});
    this.icon2 = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]});

    this.osm_tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: [
        '© ',
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        ' ♥ ',
        '<a href="https://donate.openstreetmap.org" target="_blank">Donate!</a>'].join(''),
        maxZoom: 18
    });
    this.map = L.map(id, {layers: [this.osm_tiles]});
    this.map.setView([48.0, 7.9], 13);
};


Map.prototype = {
    setMarkers : function(latlng1, latlng2) {
        var bounds = [];
        if (latlng1.isValid()) {
            var ll = new L.LatLng(latlng1.lat, latlng1.lng);
            bounds.push(ll);
            if (this.marker1 != null) {
                this.marker1.setLatLng(ll);
            } else {
                this.marker1 = new L.marker(ll, {draggable: false, icon: this.icon1}).addTo(this.map);
            }
        } else if (this.marker1 != null) {
            this.map.removeLayer(this.marker1);
            this.marker1 = null;
        }

        if (latlng2.isValid()) {
            var ll = new L.LatLng(latlng2.lat, latlng2.lng);
            bounds.push(ll);
            if (this.marker2 != null) {
                this.marker2.setLatLng(ll);
            } else {
                this.marker2 = new L.marker(ll, {draggable: false, icon: this.icon2}).addTo(this.map);
            }
        } else if (this.marker2 != null) {
            this.map.removeLayer(this.marker2);
            this.marker2 = null;
        }

        if (bounds.length != 0) {
            this.map.fitBounds(bounds, {padding: [20, 50]});
        }
    },

    setMarker : function(latlng1) {
        this.setMarkers(latlng1, new LatLng());
    }
};
