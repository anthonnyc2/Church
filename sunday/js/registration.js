var db; 
var dataWS = '';
var idDispositivo = '';
var Online = '';
var dataWS = '';

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
            if($("#codeActivation").val() != ""){
                APIRequestCode();
            }else{
                var randomKey = makeRandomKey();
                var hash = CryptoJS.SHA1(publicKey+privateKey+'findAllLessonsByLanguageGET'+randomKey);
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
    alert(language[$('#language').val()].onSuccess);
    //window.location.href = "home.html";
    //$.mobile.changePage( "home.html", { transition: "flip", reloadPage: true });
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
                        //window.location.href = "home.html";
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

function APILessonsByLenguage(hash, randomKey) {

    var url = "http://sunday.galeriasmall.com/api/lessons/language/"+$('#language').val()+"?accessKey="+hash+"&randomKey="+randomKey;
    $.ajaxSetup({
        type: "GET",
        dataType: "json",
        url: url
    });

    $.ajax({
        success: function(data) {
            console.log(data.status);
            if(data.status == '200'){
                //Hago al insersion de las lecciones    
                //alert('Guardar');
                dataWS = data.data;
                db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
                $.mobile.loading( 'show', {
    				text: "Downloading data",
    				textVisible: "false",
    				theme: "b",
    				html: ""
    			});
                db.transaction(InsertLessons, errorCB, successCB);
            }
            if(data.message == 'no_data'){
                alert('No hay lecciones para este idioma, intenta con otro por favor');    
            }
            
            if(data.message == 'accessk_key_invalid' || data.message == 'no_paramenters'){
                alert('Peticion invalida');        
            }
            
            //alert(language[$('#language').val()].userRegistrated);
            //dataWS = data;
            //insertClient(0);// Usuario free
        },
        error: function(xhr, status, error) {
            console.log("error en el servidor");
            
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