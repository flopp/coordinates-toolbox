App = function() {
    // models
    this.model_wgs84 = GeographicLib.Geodesic.WGS84;
    this.model_sphere = new GeographicLib.Geodesic.Geodesic(6378137, 0);

    // maps
    this.projMap = new Map("projMap");
    this.distMap = new Map("distMap");
    this.formMap = new Map("formMap");

    // results
    this.projResult = new LatLng();
    this.distResultDist = NaN;
    this.distResultBearing = NaN;
    this.formResult = new LatLng();

    // init
    this.initEventHandlers();
    this.initValidators();

};


App.prototype = {
    initEventHandlers : function() {
        var self = this;
        $("#projCoords").on('input', function() { self.validateProjCoords(); self.computeProjection(); });
        $("#projDistance").on('input', function() { self.validateProjDistance(); self.computeProjection(); });
        $("#projDistanceUnit").on('input', function() { self.computeProjection(); });
        $("#projBearing").on('input', function() { self.validateProjBearing(); self.computeProjection(); });
        $("#projModel").on('input', function() { self.computeProjection(); });
        $("#projResultFormat").on('input', function() { self.displayProjResult(); });

        $("#distCoords1").on('input', function() { self.validateDistCoords1(); self.computeDistance(); });
        $("#distCoords2").on('input', function() { self.validateDistCoords2(); self.computeDistance(); });
        $("#distModel").on('input', function() { self.computeDistance(); });
        $("#distDistanceUnit").on('input', function() { self.displayDistResult(); });

        $("#formCoords").on('input', function() { self.validateFormCoords(); self.computeFormats(); });
    },

    initValidators : function() {
        this.validateProjCoords();
        this.validateProjDistance();
        this.validateProjBearing();
        this.displayProjResult();

        this.validateDistCoords1();
        this.validateDistCoords2();
        this.displayDistResult();

        this.validateFormCoords();
        this.displayFormResult();
    },

    computeProjection : function() {
        var coords = new LatLng();
        coords.fromString($("#projCoords").val());

        var distance = pFloat($("#projDistance").val(), 0, NaN);
        distance *= $("#projDistanceUnit").val();

        var bearing = pFloat($("#projBearing").val(), -360, 360);

        var m = this.model_wgs84;
        if ($("#projModel").val() == "sphere") {
            m = this.model_sphere;
        }
        var r = m.Direct(coords.lat, coords.lng, bearing, distance);
        this.projResult.setLatLng(r.lat2, r.lon2);

        this.projMap.setMarkers(coords, this.projResult);
        this.displayProjResult();
    },

    displayProjResult : function() {
        $("#projResult").val(this.projResult.toString($("#projResultFormat").val()));
    },

    validateProjCoords : function() {
        var value = $("#projCoords").val();
        var coords = new LatLng();
        if (value == "" || coords.fromString(value)) {
            this.hideError("projCoordsInput", "projCoordsHelp");
        } else {
            this.showError("projCoordsInput", "projCoordsHelp",
                "Invalid coordinates: '" + value + "'.");
        }
    },

    validateProjDistance : function() {
        var value = $("#projDistance").val();
        if (value == "" || !isNaN(pFloat(value, 0, NaN))) {
            this.hideError("projDistanceInput", "projDistanceHelp");
        } else {
            this.showError("projDistanceInput", "projDistanceHelp",
                "Invalid distance: '" + value + "'. Valid: value >= 0");
        }
    },

    validateProjBearing : function() {
        var value = $("#projBearing").val();
        if (value == "" || !isNaN(pFloat(value, -360, 360))) {
            this.hideError("projBearingInput", "projBearingHelp");
        } else {
            this.showError("projBearingInput", "projBearingHelp",
                "Invalid bearing: '" + value + "'. Valid: -360 <= value <= 360");
        }
    },

    computeDistance : function() {
        var coords1 = new LatLng();
        coords1.fromString($("#distCoords1").val());
        var coords2 = new LatLng();
        coords2.fromString($("#distCoords2").val());

        var m = this.model_wgs84;
        if ($("#distModel").val() == "sphere") {
            m = this.model_sphere;
        }
        var r = m.Inverse(coords1.lat, coords1.lng, coords2.lat, coords2.lng);

        this.distResultDist = r.s12;
        this.distResultBearing = r.azi1;

        this.distMap.setMarkers(coords1, coords2);
        this.displayDistResult();
    },

    displayDistResult : function() {
        if (!isNaN(this.distResultDist)) {
            var v = this.distResultDist;
            v /= parseFloat($("#distDistanceUnit").val());
            $("#distDistance").val(v.toFixed(3));
        } else {
            $("#distDistance").val("invalid");
        }

        if (!isNaN(this.distResultBearing)) {
            $("#distBearing").val(this.distResultBearing.toFixed(2));
        } else {
            $("#distBearing").val("invalid");
        }
    },

    validateDistCoords1 : function() {
        var value = $("#distCoords1").val();
        var coords = new LatLng();
        if (value == "" || coords.fromString(value)) {
            this.hideError("distCoords1Input", "distCoords1Help");
        } else {
            this.showError("distCoords1Input", "distCoords1Help",
                "Invalid coordinates: '" + value + "'.");
        }
    },

    validateDistCoords2 : function() {
        var value = $("#distCoords2").val();
        var coords = new LatLng();
        if (value == "" || coords.fromString(value)) {
            this.hideError("distCoords2Input", "distCoords2Help");
        } else {
            this.showError("distCoords2Input", "distCoords2Help",
                "Invalid coordinates: '" + value + "'.");
        }
    },

    computeFormats : function() {
        this.formResult.fromString($("#formCoords").val());
        this.formMap.setMarker(this.formResult);
        this.displayFormResult();
    },

    displayFormResult : function() {
        $("#formResultHDMS").val(this.formResult.toString("HDMS"));
        $("#formResultHDM").val(this.formResult.toString("HDM"));
        $("#formResultHD").val(this.formResult.toString("HD"));
        $("#formResultD").val(this.formResult.toString("D"));
    },

    validateFormCoords : function() {
        var value = $("#formCoords").val();
        var coords = new LatLng();
        if (value == "" || coords.fromString(value)) {
            this.hideError("formCoordsInput", "formCoordsHelp");
        } else {
            this.showError("formCoordsInput", "formCoordsHelp",
                "Invalid coordinates: '" + value + "'.");
        }
    },


    showError : function(inpDiv, msgDiv, msg) {
        //$("#" + inpDiv).addClass("has-error");
        $("#" + msgDiv).show();
        $("#" + msgDiv + " div").text(msg);
    },
    hideError : function(inpDiv, msgDiv) {
        //$("#" + inpDiv).removeClass("has-error");
        $("#" + msgDiv).hide();
    }
}
