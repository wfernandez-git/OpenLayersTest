//const { ajax } = require("jquery");

var oktaToken = undefined;
var projection_epsg_no = '4326';
var geoserver_url = 'http://localhost:8600/geoserver/';
var arcGISServerWFSBaseUrl = 'https://qhougis201-v.qdev.net/arcgis/services/CORE_DEV17/GEO_SRCH/MapServer/WFSServer?service=WFS&';
var arcGISServerWMSBaseUrl = 'https://qhougis201-v.qdev.net/arcgis/services/CORE_DEV17/GEO_SRCH/MapServer/WMSServer?service=WMS&';


function GetOktaToken() {
    $("#bntOktaToken").prop('disabled', true);
    $.ajax({
        url: localURLbase +"?handler=OktaToken",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            $("#oktaTokenCurrentValue").text(data);
            $("#bntOktaToken").prop('disabled', false);
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error " + textStatus);
            $("#oktaTokenCurrentValue").text("");
            $("#bntOktaToken").prop('disabled', false);
        }
    })
}


function CreateGeoserverSecurity() {
    $("#bntCreateSecurity").prop('disabled', true);
    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerSecurity",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverResults").text(JSON.stringify(jsonObj, null, '\t'));
            $("#bntCreateSecurity").prop('disabled', false);
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#bntCreateSecurity").prop('disabled', false);
            alert("Error " + textStatus);
            $("#goeserverResults").text("");
        }
    })
}


var ajaxCount = 1;
function reenableButton() {
    ajaxCount--;
    if (ajaxCount <= 0) {
        $("#bntCreateFeatureTypes").prop('disabled', false);
    }
}

function CreateGeoserverLayers() {
    $("#bntCreateFeatureTypes").prop('disabled', true);
    

    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerLayers&featureName=All_Tracts&nativeName=geometries&filter=&omitTentantFilter=false",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverFCResults").append("<div>All_Tracts Feature Class created.</div>");
            reenableButton();
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            reenableButton();
            $("#goeserverFCResults").append("<div>ERROR: Failed to create All_Tracts Feature Class.</div>");
            alert("Error " + textStatus);
            //$("#goeserverResults").text("");
        }
    })


    var filterEven = encodeURIComponent ("entity_code in ('1100','1102','1104')");
    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerLayers&featureName=Even_Tracts&nativeName=geometries&filter=" + filterEven +"&omitTentantFilter=false",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverFCResults").append("<div>Even_Tracts Feature Class created.</div>");
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#goeserverFCResults").append("<div>ERROR: Failed to create Even_Tracts Feature Class.</div>");
            alert("Error " + textStatus);
            //$("#goeserverResults").text("");
        }
    });

    var filterOdd = encodeURIComponent("entity_code in ('1101','1103','1105')");
    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerLayers&featureName=Odd_Tracts&nativeName=geometries&filter=" + filterOdd +"&omitTentantFilter=false",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverFCResults").append("<div>Odd_Tracts Feature Class created.</div>");
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#goeserverFCResults").append("<div>ERROR: Failed to create Odd_Tracts Feature Class.</div>");
            alert("Error " + textStatus);
            //$("#goeserverResults").text("");
        }
    });

    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerLayers&featureName=WYAgreements&nativeName=WYAgreements&filter=&omitTentantFilter=true",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverFCResults").append("<div>WYAgreements Feature Class created.</div>");
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#goeserverFCResults").append("<div>ERROR: Failed to create WYAgreements Feature Class.</div>");
            alert("Error " + textStatus);
            //$("#goeserverResults").text("");
        }
    });
}


function CreateLayerGroup() {
    $("#bntCreateLayerGroup").prop('disabled', true);
    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerLayerGroup",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverGLResults").text(JSON.stringify(jsonObj, null, '\t'));
            $("#bntCreateLayerGroup").prop('disabled', false);
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#bntCreateLayerGroup").prop('disabled', false);
            alert("Error " + textStatus);
            $("#goeserverGLResults").text("");
        }
    })
}
