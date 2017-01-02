LatLng = function() {
    this.lat = NaN;
    this.lng = NaN;
};

LatLng.prototype = {
    setLatLng : function (lat, lng) {
        this.lat = lat;
        this.lng = lng;
    },

    isValid : function () {
        return !isNaN(this.lat) && !isNaN(this.lng);
    },

    fromString : function(s) {
        if (this.fromStringHDMS(s)) {
            return true;
        }
        if (this.fromStringHDM(s)) {
            return true;
        }
        if (this.fromStringHD(s)) {
            return true;
        }
        if (this.fromStringD(s)) {
            return true;
        }
        return false;
    },

    fromStringHDMS : function(s) {
        var matches, pattern,
            lat_sign, lat_d, lat_m, lat_s,
            lng_sign, lng_d, lng_m, lng_s;

        // H DDD MM SS.SSS
        pattern = /^[^A-Z0-9.\-]*([NS])[^A-Z0-9.\-]*(\d+)[^A-Z0-9.\-]+(\d+)[^A-Z0-9.\-]+([\d\.]+)[^A-Z0-9.\-]+([EW])[^A-Z0-9.\-]*(\d+)[^A-Z0-9.\-]+(\d+)[^A-Z0-9.\-]+([\d\.]+)[^A-Z0-9.\-]*$/i;
        //
        matches = s.match(pattern);
        if (matches) {
            lat_sign = (matches[1] === 'S') ? -1 : 1;
            lng_sign = (matches[5] === 'W') ? -1 : 1;

            lat_d = pFloat(matches[2], 0, 90);
            lat_m = pFloat(matches[3], 0, 60);
            lat_s = pFloat(matches[4], 0, 60);

            lng_d = pFloat(matches[6], 0, 180);
            lng_m = pFloat(matches[7], 0, 60);
            lng_s = pFloat(matches[8], 0, 60);

            this.lat = lat_sign * (lat_d + (lat_m / 60.0) + (lat_s / 3600.0));
            this.lng = lng_sign * (lng_d + (lng_m / 60.0) + (lng_s / 3600.0));

            return this.isValid();
        }
        this.lat = this.lng = NaN;
        return false;
    },

    fromStringHDM : function (coordsString) {
        var matches, pattern,
            lat_sign, lat_d, lat_m,
            lng_sign, lng_d, lng_m;

        // H DDD MM.MMM
        pattern = /^[^A-Z0-9.\-]*([NS])[^A-Z0-9.\-]*(\d+)[^A-Z0-9.\-]+([\d\.]+)[^A-Z0-9.\-]+([EW])[^A-Z0-9.\-]*(\d+)[^A-Z0-9.\-]+([\d\.]+)[^A-Z0-9.\-]*$/i;
        //
        matches = coordsString.match(pattern);
        if (matches) {
            lat_sign = (matches[1] === 'S') ? -1 : 1;
            lng_sign = (matches[4] === 'W') ? -1 : 1;

            lat_d = pFloat(matches[2], 0, 90);
            lat_m = pFloat(matches[3], 0, 60);

            lng_d = pFloat(matches[5], 0, 180);
            lng_m = pFloat(matches[6], 0, 60);

            this.lat = lat_sign * (lat_d + (lat_m / 60.0));
            this.lng = lng_sign * (lng_d + (lng_m / 60.0));

            return this.isValid();
        }
        this.lat = this.lng = NaN;
        return false;
    },

    fromStringHD : function (coordsString) {
        var matches, pattern,
            lat_sign,
            lng_sign;

        // H DDD.DDDDD
        pattern = /^[^A-Z0-9.\-]*([NS])[^A-Z0-9.\-]*([\d\.]+)[^A-Z0-9.\-]+([EW])[^A-Z0-9.\-]*([\d\.]+)[^A-Z0-9.\-]*$/i;
        //
        matches = coordsString.match(pattern);
        if (matches) {
            lat_sign = (matches[1] === 'S') ? -1 : 1;
            lng_sign = (matches[3] === 'W') ? -1 : 1;

            this.lat = lat_sign * pFloat(matches[2], 0, 90);
            this.lng = lng_sign * pFloat(matches[4], 0, 180);

            return this.isValid();
        }

        this.lat = this.lng = NaN;
        return false;
    },


    fromStringD : function (coordsString) {
        var matches, pattern,
            lat_sign,
            lng_sign;

        // DDD.DDDDD
        pattern = /^[^A-Z0-9.\-]*(-?)([\d\.]+)[^A-Z0-9.\-]+(-?)([\d\.]+)[^A-Z0-9.\-]*$/i;
        //
        matches = coordsString.match(pattern);
        if (matches) {
            lat_sign = (matches[1] === '-') ? -1 : 1;
            lng_sign = (matches[3] === '-') ? -1 : 1;

            this.lat = lat_sign * pFloat(matches[2],-90, 90);
            this.lng = lng_sign * pFloat(matches[4], -180, 180);

            return this.isValid();
        }

        this.lat = this.lng = NaN;
        return false;
    },

    toString : function(format) {
        if (format == "HDMS") {
            return this.toStringHDMS();
        } else if (format == "HDM") {
            return this.toStringHDM();
        } else if (format == "HD") {
            return this.toStringHD();
        } else if (format == "D") {
            return this.toStringD();
        }
        return "invalid format";
    },

    toStringHDMS : function() {
        if (!this.isValid()) {
            return "invalid";
        }

        var lat = this.lat,
            lat_h = "N",
            lat_deg,
            lat_min,
            lat_sec,
            lat_rest,
            lng = this.lng,
            lng_h = "E",
            lng_deg,
            lng_min,
            lng_sec,
            lng_rest,
            s;

        if (lat < 0) {
            lat_h = "S";
            lat = -lat;
        }
        lat_deg = Math.floor(lat);
        lat_rest = lat - lat_deg;
        lat_min = Math.floor(lat_rest * 60);
        lat_rest = lat_rest * 60 - lat_min;
        lat_sec = lat_rest * 60.0;

        if (lng < 0) {
            lng_h = "W";
            lng = -lng;
        }
        lng_deg = Math.floor(lng);
        lng_rest = lng - lng_deg;
        lng_min = Math.floor(lng_rest * 60);
        lng_rest = lng_rest * 60 - lng_min;
        lng_sec = lng_rest * 60.0;

        s = lat_h +
            " " +
            zeropad(lat_deg, 2) +
            " " +
            zeropad(lat_min, 2) +
            " " +
            zeropad(lat_sec.toFixed(2), 5) +
            " " +
            lng_h +
            " " +
            zeropad(lng_deg, 3) +
            " " +
            zeropad(lng_min, 2) +
            " " +
            zeropad(lng_sec.toFixed(2), 5);

        return s;
    },

    toStringHDM : function () {
        if (!this.isValid()) {
            return "invalid";
        }

        var lat = this.lat,
            lat_h = "N",
            lat_deg,
            lat_min,
            lat_mmin,
            lat_rest,
            lng = this.lng,
            lng_h = "E",
            lng_deg,
            lng_min,
            lng_mmin,
            lng_rest,
            s;

        if (lat < 0) {
            lat_h = "S";
            lat = -lat;
        }
        lat_deg = Math.floor(lat);
        lat_rest = lat - lat_deg;
        lat_min = Math.floor(lat_rest * 60);
        lat_rest = lat_rest * 60 - lat_min;
        lat_mmin = Math.floor(Math.round(lat_rest * 1000));
        while (lat_mmin >= 1000) {
            lat_mmin -= 1000;
            lat_min += 1;
        }

        if (lng < 0) {
            lng_h = "W";
            lng = -lng;
        }
        lng_deg = Math.floor(lng);
        lng_rest = lng - lng_deg;
        lng_min = Math.floor(lng_rest * 60);
        lng_rest = lng_rest * 60 - lng_min;
        lng_mmin = Math.floor(Math.round(lng_rest * 1000));
        while (lng_mmin >= 1000) {
            lng_mmin -= 1000;
            lng_min += 1;
        }

        s = lat_h +
            " " +
            zeropad(lat_deg, 2) +
            " " +
            zeropad(lat_min, 2) +
            "." +
            zeropad(lat_mmin, 3) +
            " " +
            lng_h +
            " " +
            zeropad(lng_deg, 3) +
            " " +
            zeropad(lng_min, 2) +
            "." +
            zeropad(lng_mmin, 3);
        return s;
    },

    toStringHD : function() {
        if (!this.isValid()) {
            return "invalid";
        }
        var lat = this.lat,
            lat_h = "N",
            lng = this.lng,
            lng_h = "E";

        if (lat < 0) {
            lat_h = "S";
            lat = -lat;
        }
        if (lng < 0) {
            lng_h = "W";
            lng = -lng;
        }

        return lat_h + " " + lat.toFixed(6) + " " + lng_h + " " + lng.toFixed(6);
    },

    toStringD : function() {
        if (!this.isValid()) {
            return "invalid";
        }
        return this.lat.toFixed(6) + " " + this.lng.toFixed(6);
    }
}
