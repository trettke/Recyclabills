/**
 * Created by trettke on 24/11/14.
 */

$(document).ready(function () {
    positionFooter();
});

$(window).onresize(function() {
    positionFooter();
});

function showmenu() {
    if ($("#menu").is(':visible')) {
        $("#menu").hide();
    } else {
        $("#menu").show();
    }
}

function positionFooter() {

    if ($(".container").height() + $(".footer").height() + 80 < $(window).height()) {
        $(".footer").css({"position": "absolute", "bottom": 0});
    } else {
        $(".footer").css({"position": "relative", "margin-top": 80});
    }
}



