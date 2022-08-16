// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


$(document).ready(function () {
    $("#map_buttons_container input[type=radio]").click(function () {
        if ($(this).is(":checked")) {
            SetVisibleLayer(parseInt($(this).attr("id").replace("option","")));
        }
    });

    //Set the first layer as visible
    $("#option1").click();

    $("#bntOktaToken").click(function () {
        GetOktaToken();
    });

    $("#bntCreateSecurity").click(function () {
        CreateGeoserverSecurity();
        
    });


    $("#oktaTokenCurrentValue").text($.cookie("access_token"));
});


function showSpinner(show)
{
    if (show) {
        $("#loadingSpinner").show();
    }
    else {
        $("#loadingSpinner").hide();
    }
}