/**
 * Created by trettke on 22/11/14.
 */
$(document).ready(function() {
    showNext("order");
    $("#submitform").click(function() {
        $.ajax({
            url: "http://localhost:3000/charge",
            type: "GET",
            success: function(resp){
                console.log(resp);
                console.log("Hello");
            }
        });
    });
});

var classicQuant = 0;
var bifoldQuant = 0;
var totalQuant = 0;

function setTotal () {
    totalQuant = classicQuant + bifoldQuant;
    updateTotal();
    console.log(totalQuant);
}

function refreshDisplayedQuantities() {
    $('#quantity-classic').html(classicQuant);
    $('#quantity-bifold').html(bifoldQuant);

    $('input[name="classic"]').val(classicQuant);
    $('input[name="bifold"]').val(bifoldQuant);
    $('input[name="quantity"]').val(totalQuant);

    if (classicQuant <= 0) {
        $('#classic-div').addClass('opaque');
    } else {
        $('#classic-div').removeClass('opaque');
    }

    if (bifoldQuant <= 0) {
        $('#bifold-div').addClass('opaque');
    } else {
        $('#bifold-div').removeClass('opaque');
    }
}

function addClassic() {
    classicQuant += 1;
    setTotal();
    refreshDisplayedQuantities();
}

function removeClassic () {
    if (classicQuant > 0) {
        classicQuant -= 1;
    }
    setTotal();
    refreshDisplayedQuantities();
}

function addBifold () {
    bifoldQuant += 1;
    setTotal();
    refreshDisplayedQuantities();
}

function removeBifold () {
    if (bifoldQuant > 0) {
        bifoldQuant -= 1;
    }
    setTotal();
    refreshDisplayedQuantities();
}

function startClassic () {
    if (classicQuant <= 0) {
        addClassic();
    }
}

function startBifold () {
    if (bifoldQuant <= 0) {
        addBifold();
    }
}

function showNext(element) {
    $(".formStage").css("display", "none");
    $('#' + element).css("display", "block");

    $('.formStageBreadcrumb').css("color", "#cccccc");
    $('#Breadcrumb' + element).css("color", "#888888");
    positionFooter();
}

function orderValue() {
    //var quantity = $("#quantity").val();
    var value = 10;

    return Math.max(totalQuant * value, 0);
}

function updateTotal() {
    $("#total").html("$" + orderValue());
}

/* Field Verification */

function verifyFields() {
    var passed = true;

    var fields = {
        classic : $('input[name="classic"]').val(),
        bifold : $('input[name="bifold"]').val(),
        quantity : $('input[name="quantity"]').val(),
        email : $('input[name="email"]').val(),
        firstName : $('input[name="first"]').val(),
        lastName : $('input[name="last"]').val(),
        address1 : $('input[name="address1"]').val(),
        address2 : $('input[name="address2"]').val(),
        address3 : $('input[name="address3"]').val(),
        city : $('input[name="city"]').val(),
        state : $('#stateselect option:selected').text(),
        postcode : $('input[name="postcode"]').val(),
        cardname : $('input[name="cardname"]').val(),
        cardnumber : $('input[name="cardnumber"]').val().replace(/ /g,''),
        expiryMonth : $('select[name="expiryMonth"] option:selected').text(),
        expiryYear : $('select[name="expiryYear"] option:selected').text(),
        cvc : $('input[name="cvc"]').val()
    };

    $("input").css({"border-color": "#cccccc", "color": "#888888"});
    $("input[type='submit']").css({"color": "#ffffff", "border-color": "#888888"});
    $("label").css("color", "#888888");


    if (fields.email.indexOf("@") == -1) {
        console.log('email failed: ' + fields.email);
        $("#email").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='email']").css("color", "#D94E48");
        showNext("shipping");
        passed = false;
    } if (fields.firstName== "") {
        console.log('First Name failed: ' + fields.firstName);
        passed = false;
        $("#first").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='first']").css("color", "#D94E48");
        showNext("shipping");
    } if (fields.lastName== "") {
        console.log('Last Name failed: ' + fields.lastName);
        passed = false;
        $("#last").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='last']").css("color", "#D94E48");
        showNext("shipping");
    } if (fields.address1 == "") {
        console.log('Address1 failed: ' + fields.address1);
        passed = false;
        $("#address1").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='address1']").css("color", "#D94E48");
        showNext("shipping");
    } if (fields.city == "") {
        console.log('City failed: ' + fields.city);
        passed = false;
        $("#city").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='city']").css("color", "#D94E48");
        showNext("shipping");
    } if (fields.postcode.length != 4) {
        console.log('Postcode failed: ' + fields.postcode);
        passed = false;
        $("#postcode").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='postcode']").css("color", "#D94E48");
        showNext("shipping");
    } if (fields.cardname == "") {
        console.log('Card Name failed: ' + fields.cardname);
        passed = false;
        $("#cardname").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='cardname']").css("color", "#D94E48");
    } if (fields.cardnumber == "" || fields.cardnumber.length != 16) {
        console.log('Card Number failed: ' + fields.cardnumber);
        passed = false;
        $("#cardnumber").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='cardnumber']").css("color", "#D94E48");
    } if (Number(fields.expiryYear)+2000 == (new Date).getFullYear() && Number(fields.expiryMonth) < (new Date).getMonth() + 1) {
        $("label[for='expiryMonth']").css("color", "#D94E48");

    } if (fields.cvc.length != 3) {
        console.log('CVC Failed: ' + fields.cvc);
        passed = false;
        $("#cvc").css({"border-color": "#D94E48", "color": "#D94E48"});
        $("label[for='cvc']").css("color", "#D94E48");
    } if (fields.quantity < 1) {
        console.log('quantity failed: ' + fields.quantity);
        showNext("order");
        passed = false;
        $(".select-product").css({"border-color": "#D94E48"});
    }

    return passed;
}
