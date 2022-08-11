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


