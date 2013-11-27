var db; 
var dataWS = '';
var idDispositivo = '';
var Online = '';

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    init();
}

/*$(document).ready(function() {
 init();
 });*/


function init() {
	existentUser();
    checkConnection();
    idDispositivo = device.uuid;
    
    $('#language').on('change', function(event) {
        if ($('#language').val() != -1) {
            $("#labelName").text(language[$(this).val()].name);
            $("#name").attr('placeholder', language[$(this).val()].name);
            $("#labelEmail").text(language[$(this).val()].email);
            $("#email").attr('placeholder', language[$(this).val()].email);
            $("#labelPhone").text(language[$(this).val()].phoneNumber);
            $("#phoneNumber").attr('placeholder', language[$(this).val()].phoneNumber);
            $("#labelCode").text(language[$(this).val()].codeActivation);
            $("#codeActivation").attr('placeholder', language[$(this).val()].codeActivation);
            $("#button .ui-btn-text").text(language[$(this).val()].button);
            $("#form_register").show();
        } else {
            $("#form_register").hide();
        }
    });

    $("#button").on('tap', function(event) {
        event.preventDefault();
        if ($("#name").val() == "" || $("#email").val() == "" || $("#phoneNumber").val() == "") {
            alert("" + language[$('#language').val()].messageRequered);
        }else{
            if (!emailValidation($("#email").val())) {
                alert(language[$('#language').val()].messageEmail);
            }else{
                if($("#email").val() != $("#email2").val()){
                 alert(language[$('#language').val()].sameEmail)                   
                }else{
                    if(Online){
                        if($("#codeActivation").val() != ""){
                            APIRequestCode();
                        }else{
                            APIResquestEmail();
                        }
                        
                    }else{
                        alert(language[$('#language').val()].noInternet);
                    }
                }
                
            }
        }
    });
}

function existentUser() {

    db.transaction(createDB, errorCB, successCB);
    return;
}

function successInsert() {
    alert(language[$('#language').val()].onSuccess);
    window.location.href = "home.html";
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    if(states[networkState] === 'No network connection'){
        Online = false;
    }else{
        Online = true;
    }
}

function queryClient(){

    console.log("consulta cliente");
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM userData';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        console.log("hay un cliente registrado");                      
                        window.location.href = "home.html";
                    }
                    else{
                     console.log("NO hay un cliente registrado");                         
                    }
                },errorHandler);
            },errorHandler,nullHandler);
}

function insertClient(version) {
	db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    console.log("language "+dataWS.language+" id "+dataWS._id);
    db.transaction(function(transaction) {
        transaction.executeSql('INSERT INTO userData (version, language, id, email) VALUES (?,?,?,?)',
               [version, dataWS.language, dataWS._id, dataWS.email], successInsert, errorHandler);
    });
    
}

function emailValidation(value) {
    if (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/.test(value)) {
        return true;
    } else {
        return false;
    }
}

function APIRequestCode() {
    var url = "http://dry-dawn-9293.herokuapp.com/user/active_code/" + $("#codeActivation").val();
    $.ajaxSetup({
        type: "GET",
        dataType: "json",
        url: url
    });

    $.ajax({
        success: function(data) {
            
            if (data.uuid_1 == idDispositivo || data.uuid_2 == idDispositivo){
                // El dispositivo se le borro la informacion
                dataWS = data;
                insertClient(1);
                //Lo guardo como version paga y no aumenta el contador
            } else {
                if (data.count_device < 2) {
                    if (data.count_device == 0) {
                        APIRequestUpdateCount(data._id, 1);
                    } else {
                        APIRequestUpdateCount(data._id, 2);
                    }
                } else {
                    alert(language[$('#language').val()].twoDevices);
                    APIRequestInsert();
                }
            }
        },
        error: function(xhr, status, error) {
            alert(language[$('#language').val()].badCodeActivation);
        }
    });
}

function APIRequestUpdateCount(idUser, count) {

    var url = "http://dry-dawn-9293.herokuapp.com/user/" + idUser + "/" + count;
    console.log("contador a actualizar es " + count);

    $.ajaxSetup({
        contentType: "application/json; charset=utf-8",
        type: "PUT",
        dataType: "json",
        url: url
    });

    $.ajax({
        data: JSON.stringify({"count_device": count, "uuid": idDispositivo}),
        success: function(data) {
            alert(language[$('#language').val()].successUpdatePro);
            dataWS = data;
            insertClient(1);
        },
        error: function(xhr, status, error) {
            alert(language[$('#language').val()].errorUpdatePro); 
        }
    });
}


function APIResquestEmail() {

    var url = "http://dry-dawn-9293.herokuapp.com/user/email/" + $("#email").val();
    $.ajaxSetup({
        type: "GET",
        dataType: "json",
        url: url
    });

    $.ajax({
        success: function(data) {
            console.log(data);
            alert(language[$('#language').val()].userRegistrated);
            dataWS = data;
            insertClient(0);// Usuario free
        },
        error: function(xhr, status, error) {
            console.log("usuario nuevo");
            APIRequestInsert();
        }
    });
}

function APIRequestInsert() {
    
    var url = "http://dry-dawn-9293.herokuapp.com/user";
    $.ajaxSetup({
        contentType: "application/json; charset=utf-8",
        type: "POSt",
        dataType: "json",
        url: url
    });

    $.ajax({
        data: JSON.stringify({"plataform": device.platform, name: $("#name").val(), email: $("#email").val(), phone_number: $("#phoneNumber").val(), "version": 0, "active_code": "none", "language": $('#language').val()}),
        success: function(data) {
            dataWS = data;
            insertClient(0); // Usuario free
        },
        error: function(xhr, status, error) {
            alert(language[$('#language').val()].onError);
        }
    });
}
