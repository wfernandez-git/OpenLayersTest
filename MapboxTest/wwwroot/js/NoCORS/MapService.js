var oktaToken = undefined;

function GetOktaToken() {
    $.ajax({
        url: localURLbase +"?handler=OktaToken",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            $("#oktaTokenCurrentValue").text(data);
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error " + textStatus);
            $("#oktaTokenCurrentValue").text("");
        }
    })
}


function CreateGeoserverSecurity() {
    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerSecurity",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverResults").text(JSON.stringify(jsonObj,null,'\t'));
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error " + textStatus);
            $("#goeserverResults").text("");
        }
    })
}

function CreateGeoserverLayers() {
    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerLayers&featureName=All_Tracts&filter=",
        method: "GET",
        success: function (data, textStatus, jqXHR) {
            var jsonObj = JSON.parse(data);
            $("#goeserverFCResults").append("<div>All_Tracts Feature Class created.</div>");
            return data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#goeserverFCResults").append("<div>ERROR: Failed to create All_Tracts Feature Class.</div>");
            alert("Error " + textStatus);
            //$("#goeserverResults").text("");
        }
    })


    var filterEven = encodeURIComponent ("entity_code in ('1100','1102','1104')");
    $.ajax({
        url: localURLbase + "?handler=CreateGeoServerLayers&featureName=Even_Tracts&filter=" + filterEven,
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
        url: localURLbase + "?handler=CreateGeoServerLayers&featureName=Odd_Tracts&filter=" + filterOdd,
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
}
