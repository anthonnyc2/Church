var db; 
var dataWS = '';
var idDispositivo = '';
var Online = '';
var dataWS = '';
window['activation']= false;
var hash = '';
var randomKey = '';
window['test']= false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    $('#reg').hide()
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    init();
}

function init() {
	existentUser();
    checkConnection();
    idDispositivo = device.uuid;
    
    $('#language').on('change', function(event) {
        if ($('#language').val() != -1) {
            $("#labelCode").text(language[$(this).val()].codeActivation);
            $("#codeActivation").attr('placeholder', language[$(this).val()].codeActivation);
            $("#button .ui-btn-text").text(language[$(this).val()].button);
            $("#form_register").css('visibility', 'visible')
        } else {
            $("#form_register").css('visibility', 'hidden')
        }
    });

    $("#button").on('tap', function(event) {
        event.preventDefault();
       
        if(Online){
            randomKey = makeRandomKey();
            hash = CryptoJS.SHA1(publicKey+privateKey+randomKey);
            $.mobile.loading( 'show', {
    				text: "Downloading data",
    				textVisible: "false",
    				theme: "b",
    				html: ""
    			});
            
            if($("#codeActivation").val() != ""){
                APIRequestCode($("#codeActivation").val());
            }else{
                
                APILessonsByLenguage(hash, randomKey);
            }
        }else{
            alert(language[$('#language').val()].noInternet);
        }
    });
}

function existentUser() {
    db.transaction(createDB, errorCB, successCB);
    return;
}

function successInsert() {
    $.mobile.loading( 'hide' );
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
                        $('#reg').show()
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

function APILessonsByLenguage(hash, randomKey) {
    console.log("descargando contenido free");
    var url = "http://sunday.galeriasmall.com/api/lessons/language/"+$('#language').val();
    $.ajaxSetup({
        type: "GET",
        dataType: "json",
        url: url,
        headers: { 'AccessKey': hash,
                   'RandomKey': randomKey}
    });

    $.ajax({
        success: function(data) {
            
            if(!data.error){
                //Hago al insersion de las lecciones    
                dataWS = data.lessons;
                db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
                db.transaction(InsertLessons, errorCB, successCB);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status);
            if(jqXHR.status == 401){
                alert('Bad Resquest, contact the administrator');
                //Access Denied. Invalid AccessKey & RandomKey
            }
            if(jqXHR.status == 404){
                alert('Language without data, please try with other one');
            }
            if(jqXHR.status == 400){
                alert('Unknow Error, please contact the administrator');
            }
        }
    });
    
}

function APIRequestCode(code) {
    console.log("revisando el codigo de activacion ");
    if(code == 'none'){
        //alert('Insert valide code please');
        window['activation']= true;
        APILessonsByLenguage(hash, randomKey);
        
    }else{
        var xmlMessage ='<?xml version="1.0" encoding="utf-8"?><CustomerActivationRequest><Request>'+
        '<AccessKey>eFVhXX316tqks2bhYmufbbnyd5fHayj9schogol</AccessKey>'+
        '<ActivationCode>'+code+'</ActivationCode>'+
        '<DeviceMacAddress>xxxxxxxxxxxxxxxxxx</DeviceMacAddress>'+
        '<DeviceNo>'+device.uuid+'</DeviceNo>'+
        '<DeviceBlueToothAddress>NULL</DeviceBlueToothAddress>'+
        '</Request>'+
        '</CustomerActivationRequest>';
        
        $.ajax({
            type: "POST",
            contentType: "text/xml",
            dataType: "xml",
            url: "https://rccgetour.org/rccgetour/API/activation_request.php",
            data: xmlMessage,
            success: function(response) {
                var messageResponse = ($(response).find('Message').text());
                var statusResponse = ($(response).find('Status').text());
                if(messageResponse == 'ACTIVATION CODE SUCCESSFULL')
                {
                    window['activation']= true;
                    APILessonsByLenguage(hash, randomKey);
                }
                if(messageResponse == 'INVALID ACTIVATION CODE'){
                    alert('Invalid Code');
                }
                if(messageResponse == 'ACTIVATION CODE USED BY ANOTHER DEVICE'){
                    alert('Activation Code used by other device');
                }
                console.log("Message "+messageResponse+" status "+statusResponse);
            },
            error: function(xhr, status, error) {
                alert('Unknow Error, please contact the administrator');
                console.log("status "+status);
            }
        });
    }
}

function ApiRequestLessonsPRO(selectedL,randomKey,hash){
    console.log("descargando contenido PRO");
	var url = "http://sunday.galeriasmall.com/api/pro-content/language/"+selectedL;
    $.ajaxSetup({
        type: "GET",
        dataType: "json",
        headers: { 'AccessKey': hash,
                   'RandomKey': randomKey}
    });

    $.ajax({
    	url: url,
        success: function(data) {
           
            if(!data.error){
                //Hago al insersion del contenido pro    
                dataWS = data.lessons;
                db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
                db.transaction(InsertContentPro, errorCB, successCB);
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status);
            if(jqXHR.status == 401){
                alert('Bad Resquest, contact the administrator');
                //Access Denied. Invalid AccessKey & RandomKey
            }
            if(jqXHR.status == 404){
                alert('Language without data, please try with other one');
            }
            if(jqXHR.status == 400){
                alert('Unknow Error, please contact the administrator');
            }
        }
    });
}

function insertClient(version) {
	db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
        transaction.executeSql('INSERT INTO userData (version, language) VALUES (?,?)',
               [version, $('#language').val()], successInsert, errorHandler);
    });
    
}