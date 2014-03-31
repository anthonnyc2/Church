var originalFont = 12;
var db; 
var dataWS = '';
var IdUsuario = '';
var selectedL = '';
var page = 0;
var version = 0;
var classApp = '';
var idLesson = '';
var sqlLesson;
var resultConsult ='';
var titleLesson = '';
var lessonQuarter = '';
var lessonDate = '';
var blessedWeek = '';
var gateway = false;
var API = false;
var idDispositivo;
var valTypeSearch='BW';
var publicKey='FrfuSF7Hnuf7';
var privateKey='YbeusYXc60c1V1';
window['currentL'];
window['size'] = originalFont
window['version'] = '';
window['listLesson'] = false;
window['dataLesson'] = '';
window['today'] = false;
window['idioma'] = '';
window['namePanel']= 'optionPanel';

var monthN = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
var months = [{
"month": "January", "quarter" : "2nd Quarter"},{"month": "February", "quarter" : "2nd Quarter"},{"month": "March", "quarter" : "2nd Quarter"},
{"month": "April", "quarter" : "2nd Quarter"},{"month": "May", "quarter" : "3rd Quarter"},{"month": "June", "quarter" : "3rd Quarter"},
{"month": "July", "quarter" : "3er Quarter"},{"month": "August", "quarter" : "3rd Quarter"},{"month" : "September", "quarter" : "1st Quarter"},
{"month" : "October", "quarter" : "1st Quarter"},{"month": "November", "quarter" : "1st Quarter"},{"month" : "December", "quarter" : "1st Quarter"}];

var currentDate, totalNotes = 0;
var options = {collapsible: true, event: "tap", activate: accFocus,heightStyle: "content", icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    idDispositivo == device.uuid;
    init();
    
}

function onPause(){
    console.log("app en pause");
}
function onResume(){
    console.log("aplicacion pausada");
}


function init() {
    console.log('cerrando panel')
    if(page ==''){
         if($("#page").attr("data-index") == "home"){
            page=1;
        }
    }
    
    if(page == 1){
        console.log("eventos de pagina 1");
        window['namePanel']= 'optionPanel';
        
        if(window['dataLesson'] == ''){
            setTimeout(function() {
                 console.log("The lessson is already syncronizadas");
                 window['dataLesson'] = '1';
                 queryVersionApp(); 
                 eventsHome();
            }, 500);
        }
        
        /*if(window['dataLesson'] == ''){
            console.log("primera vez para variable sesion consulta de lecciones");
            queryLessons(); 
            if(window['version']==''){
                 queryVersionApp();           
            }
        }*/
    }
    else{
        if(page == 2){
          console.log("pagina 2 listado lesson");  
            window['namePanel']= 'optionPanelLL';
            if(!window['listLesson']){
                console.log("primera vez para variable sesion de lista de lecciones");
                queryVersionApp();
                
                $.mobile.loading( 'show', {
            		text: "",
            		textVisible: "false",
            		theme: "b",
            		html: ""
        	    });
            }
        }else{
            if(page == 3){
                console.log("pagina 3 detalle lesson");
                window['namePanel']= 'optionPanelLLD';
                
                $.mobile.loading( 'show', {
            		text: "",
            		textVisible: "false",
            		theme: "b",
            		html: ""
        	    });
                
             queryContentOutline(idLesson);   
              
            }else{
                if(page == 4){
                    console.log("pagina 4 today");
                    window['namePanel']= 'optionPanelT';
                    if(!window['today']){
                        queryVersionApp();
                        /*$.mobile.loading( 'show', {
                    		text: "",
                    		textVisible: "false",
                    		theme: "b",
                    		html: ""
        	            });*/
                    }
                }else{
                    if(page == 5){
                        console.log("pagina 5 notes");
                        window['namePanel']= 'optionPanelN';
                        queryNote();
                    }else{
                        if(page == 6){
                            console.log("pagina 6 search");
                            window['namePanel']= 'optionPanelS';
                            setTimeout(function() {
                            eventssearch();
                            }, 300);
                            
                        }
                    }
                }
            }
        }
    }
}
 
function onBackKeyDown(e) {
     
     if(page == 1){
         function checkButtonSelection(param){
            console.log("opciones atras"+ param );
             if(param == 2)
             {
                 navigator.app.exitApp();
             }   
         }       
          e.preventDefault();
          navigator.notification.confirm(
          "Are sure you want to exit the app?",
          checkButtonSelection,
          'EXIT',
          'Cancel,OK');
     }
    else
         {
            if(page == 2)
            {
                page = 1;
                $.mobile.changePage( "home.html" );
                init(); 
            }else{
                if(page == 3)
                {
                     page = 2;
                     $("#page").attr("data-index","lessons");
                     $.mobile.changePage( "lessons.html" );
                     init();
                }else if(page == 4 || page == 5 || page == 6){
                        page = 1;
                        $.mobile.changePage( "home.html" );
                        init();        
                    }
                }
            }
}

function makeRandomKey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
 

function eventsCalendar(){
    
    console.log("cargo los eventos del calendar");
    
        
        $('.homeCalendar').tap(function(event){
    		event.preventDefault();
    		console.log("evento del home desde calendar");
            page = 1;
            $.mobile.changePage( "home.html" );
            $("#page").attr("data-index","home");
            init();
    	});
        
        $('.contentCalendar').tap(function(event){
    		event.preventDefault();
            console.log("tap lessons desde calendar");
            page = 2;
            
            $.mobile.changePage( "lessons.html" );
            $("#page").attr("data-index","lessons");
            init();
            
    	});  
        
        $('.notesCalendar').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde calendar");
            page = 5;
            $.mobile.changePage( "notes.html", { reloadPage: true });
            $("#page").attr("data-index","notes");
            init();
    	});
        
        $('.backHomeCalendar').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde lessonsssss");
            page = 1;
            $("#page").attr("data-index","home");
            $.mobile.changePage( "home.html" );
            init();
    	});
        
        $('.noAuth').tap(function(event){
    		event.preventDefault();
            function checkButtonSelection(param){
                 if(param == 2)
                 {
                     cargarURl();
                 }    
             }       
              event.preventDefault();
              navigator.notification.confirm(
              "Not avaliable in FREE version, do you want to buy the app? ",
              checkButtonSelection,
              'Information',
              'Cancel,Buy');
    	});
        
        $('.searchCalendar').tap(function(event){
            event.preventDefault();
            console.log("evento search desde HOme");
            page = 6;
            $("#page").attr("data-index","search");
            $.mobile.changePage( "search.html" );
            init();
        });
        
        fontSize()
        setFontSize(window['size'])
        $('.optionsT').tap(openP)
        $('body').on( "swiperight", function(){event.preventDefault();$(".optionPanelT").panel("close")});
    
        
        $('.storeT').tap(function(event){
            event.preventDefault();
            cargarURl();
        });
    
        $('input#validateT').tap(function(event){
            event.preventDefault();
            if($('.payedCodeT').val()=='')
            {
                 alert('Please insert code')   
            }else
            {
                 //alert("codigo en Today "+$('.payedCodeT').val());    
                 APIRequestCode($('.payedCodeT').val())   
            }
        });
        
        
    
}

function eventssearch(){
    
    console.log("cargo los eventos del search");
    
    valTypeSearch = 'BW';
    $('#searchBlessed').show();
    
        $('.homeSearch').tap(function(event){
    		event.preventDefault();
    		console.log("evento del home desde search");
            page = 1;
            $.mobile.changePage( "home.html", {reverse: "true"} );
            $("#page").attr("data-index","home");
            init();
    	});
        
        $('.contentSearch').tap(function(event){
    		event.preventDefault();
            console.log("tap lessons desde search");
            page = 2;
            $.mobile.changePage( "lessons.html", { reverse: "true"});
            $("#page").attr("data-index","lessons");
            init();
    	});  
        
        $('.notesSearch').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde search");
            page = 5;
            $.mobile.changePage( "notes.html", { reloadPage: "true", reverse: "true" });
            $("#page").attr("data-index","notes");
            init();
    	});
        
        $('.backHomeSearch').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde search");
            page = 1;
            $("#page").attr("data-index","home");
            $.mobile.changePage( "home.html", {reverse: "true"} );
            init();
    	});
        
        $('.calendarSearch').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde search");
            page = 4;
            $.mobile.changePage( "today.html", { reverse: "true"});
            $("#page").attr("data-index","today");
            init();
    	});
        
        $('input[type="radio"]').change(function(event){
            $('.searchInput').val('')
            if ($(this).val() == "NT"){
                 $('.searchInput').attr('placeholder','Insert note title');  
                 valTypeSearch = 'NT';
                 console.log("1");
                 $('#searchNote').show();
                 $('#searchLessons').hide();
                 $('#searchBlessed').hide();
                 $('#listLessonsS').html('');
                 $('#listBlessedWeek').html('');
                 $('#listNotesSearch').html('');
                
            }
            
            if($(this).val() == "LS"){
                 $('.searchInput').attr('placeholder','Type your search');      
                console.log("2");
                valTypeSearch = 'LS';
                $('#SearchLessons').show();
                $('#searchBlessed').hide();
                $('#searchNote').hide();
                $('#listLessonsS').html('');
                $('#listBlessedWeek').html('');
                $('#listNotesSearch').html('');
            }
            
            if($(this).val() == "BW"){
                 $('.searchInput').attr('placeholder','Insert week number (only numbers)');
                console.log("3");
                valTypeSearch = 'BW';
                $('#searchBlessed').show();
                $('#searchLessons').hide();
                $('#searchNote').hide();
                $('#listLessonsS').html('');
                $('#listBlessedWeek').html('');
                $('#listNotesSearch').html('');
            }
        });
        
        $('.searchInput').keyup(function(e){
            
            e.preventDefault();
            db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
            
            if($(".searchInput").val().length == 0){
                console.log("no hay nada")
                document.getElementById("listLessonsS").innerHTML="";
                document.getElementById("listBlessedWeek").innerHTML="";
                document.getElementById("listNotesSearch").innerHTML="";
             }else
                if(valTypeSearch == 'BW' && $(".searchInput").val().length > 0) {
                    console.log("incremento y es BW");
                    $('#listBlessedWeek').html('');
                    if(!isNaN($(".searchInput").val())){
                            SearchBW();   
                    }else{
                        alert("Type only numbers please");
                    }
                }else
                    if( valTypeSearch == 'NT' && $(".searchInput").val().length > 3) 
                    {
                         console.log("incremento es mayor a 3 y es NT");
                         $('#listNotesSearch').html('');
                         SearchNotes();
                    }else
                        if (valTypeSearch == 'LS' && $(".searchInput").val().length > 3) 
                        {
                            console.log("incremento es mayor a 3 y es LS"); 
                            $('#listLessonsS').html('');
                            SearchLesson();   
                        }
        });
        
        fontSize()
        setFontSize(window['size'])
        $('.optionsS').tap(openP)
        $('body').on( "swiperight", function(){event.preventDefault();$(".optionPanelS").panel("close")});
    
        
        $('.storeS').tap(function(event){
            event.preventDefault();
            cargarURl();
        });
    
        $('input#validateS').tap(function(event){
            event.preventDefault();
            if($('.payedCodeS').val()=='')
            {
                 alert('Please insert code')   
            }else
            {
                 //alert("codigo en Today "+$('.payedCodeS').val());    
                 APIRequestCode($('.payedCodeS').val())   
            }
        });
     
}

function SearchBW(){
    
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      var sql = 'SELECT * FROM blessed_week where week_id='+$(".searchInput").val();
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        
                     var weekBlessed = result.rows.item(0);
                     var date =  new Date(getWeekIni());
                     var weekSearch = $(".searchInput").val();
                     weekSearch--;
                     date.setDate(date.getDate() + 7*weekSearch);    
                     var mes = date.getMonth();   
                     console.log(""+months[mes].month);   
                     //console.log("si hay resultados y la fecha de la semana "+$(".searchInput").val()+" es ");
                        
                    $('#listBlessedWeek').append('<li data-role="list-divider" data-theme="b"></li>'+
                                             '<li data-role="list-divider">Week-'+$(".searchInput").val()+
                                             '<span class="ui-li-count">'+months[mes].quarter+'</span>'+
	                                         '</li>');
                    
                    $('#listBlessedWeek').append('<li><img src="images/dateIcons/sunday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.sun+'</p>'+
                                             '<p class="ui-li-aside"><strong>Sunday</strong></p></li>'); 
                        
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/dateIcons/monday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.mon+'</p>'+
                                             '<p class="ui-li-aside"><strong>Monday</strong></p></li>'); 
			        
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/dateIcons/tuesday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.tue+'</p>'+
                                             '<p class="ui-li-aside"><strong>Tuesday</strong></p></li>'); 
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/dateIcons/wednesday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.wed+'</p>'+
                                             '<p class="ui-li-aside"><strong>Wednesday</strong></p></li>');
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/dateIcons/thursday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.thu+'</p>'+
                                             '<p class="ui-li-aside"><strong>Thursday</strong></p></li>'); 
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/dateIcons/friday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.fri+'</p>'+
                                             '<p class="ui-li-aside"><strong>Friday</strong></p></li>');
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/dateIcons/saturday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.sat+'</p>'+
                                             '<p class="ui-li-aside"><strong>Saturday</strong></p></li>'+
                                             '<li data-role="list-divider" data-theme="b"></li>');
                    
                    $('#listBlessedWeek').listview('refresh');
                        
                    }else{
                    	$('#listBlessedWeek').append('<h3>No find results</h3>');
                        console.log("NO blesed week for this search "+$(".searchInput").val());
                    }
                   
                },errorHandler);
            },errorHandler,nullHandler);
    
}

function SearchNotes(){
    
    console.log("busqueda de notas");
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      var sql = "SELECT * FROM note where title like '%"+$(".searchInput").val()+"%' OR content like '%"+$(".searchInput").val()+"%'";
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        console.log("hay resultados");
                        var note = '';
                        for(var i=0;i<result.rows.length;i++){
                            note =  result.rows.item(i);
                            $('#listNotesSearch').prepend('<div data-role="collapsible" id="note'+note.note_id+'" data-collapsed="false">'+
                           '<h3>'+note.title+' - '+note.date+'</h3><label for="noteTitle'+note.note_id+'" class="ui-input-text">Note title</label>'+
                           '<div antes class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-d">'+
                           '<input name="noteTitle" id="noteTitle'+note.note_id+'" maxlength="15" placeholder="Less than 15 characters please" type="text" readonly value="'+note.title+'" class="ui-input-text ui-body-d"/></div>'+
                           '<label for="text'+note.note_id+'" class="ui-input-text" >Note content</label>'+
                           '<textarea id="text'+note.note_id+'" maxlength="750" placeholder="Write your notes here" readonly class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset">'+note.content+'</textarea>').collapsibleset('refresh');
                        }
                        
                        $('#listNotesSearch').collapsibleset('refresh')
                    }else{
                        $('#listNotesSearch').append('<h3>No find results</h3>');
                        console.log("NO notes for this search "+$(".searchInput").val());
                    }
                   
                },errorHandler);
            },errorHandler,nullHandler);
}

function SearchLesson(){
    
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      var sql = "SELECT * FROM lessons where title like '%"+$(".searchInput").val()+"%' OR intro like '%"+$(".searchInput").val()+"%'";
        transaction.executeSql(sql, [],function(transaction, result) {
                $('#searchLessons').show();    
                if (result.rows.length > 0) {
                        console.log("hay resultados para "+$(".searchInput").val());
                        var date = new Date(getWeekIni());
                        var numberWeek;
                        for(var i=0; i<result.rows.length; i++){
                           date = new Date(getWeekIni());
                           numberWeek = result.rows.item(i).week;
                           numberWeek--;
                           date.setDate(date.getDate() + (7*numberWeek));
                           //fecha de la leccion mostrada (date)
                                
                          $('#listLessonsS').append('<li id="'+result.rows.item(i).week+'" ><a '+
							'>'+
                            '<img src="images/'+monthN[date.getMonth()]+''+date.getDate()+'.png" />'+
							'<h3>' + result.rows.item(i).title  + '</h3>' +
							'<p>' + result.rows.item(i).out1 + '</p>' +
							'<p>' + result.rows.item(i).out2 + '</p>' +
                            '<p>' + result.rows.item(i).intro + '</p>' +
							'</a></li>');
                      }
                         $('#listLessonsS').listview('refresh');
                    }else{
                    	$('#listLessonsS').append('<h3>No find results</h3>');
                        console.log("NO lessons for this search "+$(".searchInput").val());
                    }
                   
                },errorHandler);
            },errorHandler,nullHandler);
    
}

function cargarURl(){
    url = 'https://rccgetour.org/rccgetour/products/product.php';
    console.log("la url es "+url);
    var ref = window.open(encodeURI(url), '_system', 'location=no');
    ref.addEventListener('loadstart', function(event) { });
    ref.addEventListener('loadstop', function(event) {  });
    ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
    ref.addEventListener('exit', function(event) { 
        console.log("cerro el navegador");
        event.preventDefault();
        window.location="home.html";
    });
}

function eventsHome(){
     
    console.log("eventos de home cargados");

        $('.content').tap(function(event){
    		event.preventDefault();
            console.log("tap lessons");
            page = 2;
            $.mobile.changePage( "lessons.html", {reverse: "true"} );
            $("#page").attr("data-index","lessons");
            init();
	    });  
    
        $('.home').tap(function(event){
            return;
    	});
        
        $('.calendar').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde home");
            page = 4;
            $.mobile.changePage( "today.html", {reverse: "true"} );
            $("#page").attr("data-index","today");
            init();
    	});
        
        $('#goBW').tap(function(event){
    		event.preventDefault();
            page = 4;
            $.mobile.changePage( "today.html" );
            $("#page").attr("data-index","today");
            init();
    	});
        
        $('.notes').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde home");
            page = 5;
            $.mobile.changePage( "notes.html" );
            $("#page").attr("data-index","notes");
            init();
    	});
        
        $('.search').tap(function(event){
            event.preventDefault();
            console.log("evento search desde HOme");
            page = 6;
            $("#page").attr("data-index","search");
            $.mobile.changePage( "search.html");
            init();
        });
        
    
        fontSize()
        setFontSize(window['size'])
        $('.options').tap(openP)
        $('body').on( "swipeleft", openP );
        $('body').on( "swiperight", function(){event.preventDefault();$(".optionPanel").panel("close")});
    
        
        $('.store').tap(function(event){
            event.preventDefault();
            cargarURl();
        });
    
        $('input#validate').tap(function(event){
            event.preventDefault();
            if($('.payedCode').val()=='')
            {
                 alert('Please insert code')   
            }else
            {
                 APIRequestCode($('.payedCode').val())   
            }
            
        });
}

function openP(event){
    event.preventDefault();
    versionType();
    $("."+window['namePanel']).panel("open");
}
    
function queryLessons(){

    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    console.log("consultando las lecciones");
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM lessons';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length == 0) {
                           console.log("No hay lesson sincronizadas");
                           
                            $.mobile.loading( 'show', {
							text: "Downloading data",
							textVisible: "false",
							theme: "b",
							html: ""
							});
                           queryDataUser();
                    }else{
                    	
                        setTimeout(function() {
                         console.log("The lessson is already syncronizadas");
                         window['dataLesson'] = '1';
                        eventsHome();
                      }, 500);
                    }
                },errorHandler);
            },errorHandler,nullHandler);
}

function queryDataUser(){

	console.log("consultando lenguaje del usuario");
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM userData';
        transaction.executeSql(sql, [],function(transaction, result) {
                    console.log("resultados "+result.rows.length);
                    if (result.rows.length == 1) {
                          
                           var row = result.rows.item(0);
                           selectedL = row.language;
                           window['idioma'] =  row.language;
                           console.log("languaje es "+window['idioma']);
                           window['version']=row.version;
                           var randomKey = makeRandomKey();
                           var hash = CryptoJS.SHA1(publicKey+privateKey+randomKey);
                           ApiRequestLessonsPRO(window['idioma'],randomKey,hash);

                    }else{
                    	console.log("Error in the query of userData");
                    }

                },errorHandler);
            },errorHandler,nullHandler);
}

function ApiRequestLessonsPRO(selectedL,randomKey,hash){

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
                $.mobile.loading( 'show', {
    				text: "Downloading data",
    				textVisible: "false",
    				theme: "b",
    				html: ""
    			});
            
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

function InsertContentPro(tx){
     
    var sqlContenOutline ='';
    console.log("insercionj contenido pro");
    $.each(dataWS, function(k,v){
         for(var i=0; i<v.content.length; i++){
			    for(var j=0; j<v.content[i].length; j++){
					sqlContenOutline = 'INSERT INTO content_outline(week_id, out, content) VALUES('+v.week+","+(i+1)+',"'+v.content[i][j]+'")';
					//console.log(sqlContenOutline);
                    tx.executeSql(sqlContenOutline);		
				}
			}
     });
    console.log("termino el ciclo");
    updateClient();
}

function InsertLessons(tx){
	var countLesson = 0;
	
    $.each(dataWS, function(k,v){
			
            if(v.content.length == 2){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.introduction+'","'+v.bible_passage+'", 2)';    
            }
            if(v.content.length == 3){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.introduction+'","'+v.bible_passage+'", 3)';    
            }
            if(v.content.length == 4){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.introduction+'","'+v.bible_passage+'", 4)';    
            }
            if(v.content.length == 5){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.introduction+'","'+v.bible_passage+'", 5)';    
            }
            if(v.content.length == 6){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.introduction+'","'+v.bible_passage+'", 6)';    
            }
            if(v.content.length == 7){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, out7, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.introduction+'","'+v.bible_passage+'", 7)';    
            }
            if(v.content.length == 8){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, out7, out8, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.outline[7]+'","'+v.introduction+'","'+v.bible_passage+'", 8)';    
            }
            
			sqlBlessedWeek = 'INSERT OR REPLACE INTO blessed_week(week_id, mon, tue, wed, thu, fri, sat, sun) VALUES('+v.week+',"'+v.blessed_week[0]+'","'+v.blessed_week[1]+'","'+v.blessed_week[2]+'","'+v.blessed_week[3]+'","'+v.blessed_week[4]+'","'+v.blessed_week[5]+'","'+v.blessed_week[6]+'" )';
			
            tx.executeSql(sqlBlessedWeek);
        
			for(var i=0; i<v.content.length; i++){
			    for(var j=0; j<v.content[i].length; j++){
					sqlContenOutline = 'INSERT INTO content_outline(week_id, out, content) VALUES('+v.week+","+(i+1)+',"'+v.content[i][j]+'")';
					tx.executeSql(sqlContenOutline);		
				}
			}
			
			tx.executeSql(sqlLesson);
			countLesson++;
            window['dataLesson'] = '1';

		});
		
		$.mobile.loading( 'hide' );
		console.log("number of lessons "+countLesson);
        eventsHome();
}

// Contenido Lessons

function queryVersionApp(){
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      var sql = 'SELECT * FROM userData';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length == 1) {
                        var row = result.rows.item(0);
                    	version = row.version;
                        console.log("version app "+version);
                        selectedL = row.language;
                        window['version'] = row.version;
                        window['idioma']= row.language;
                        if(page == 2){
                            if(window['version'] == 0){
                                classApp = 'free';
                                console.log("version free");
                    	    }else{
                                classApp = 'pro';   
                                console.log("version pro");
                    	    }
                            window['listLesson'] = true;
                            queryFindLessons();
                            
                        }if(page == 4){
                            window['today'] = true;
                            queryBlesedWeek();
                        } 
                    }
                    else{
                        console.log("No USERS");
                    }
                },errorHandler);
            },errorHandler,nullHandler);
}

function versionType(){
    if(version == 1){
        $('#verification').html('<h3>Version pro</h3>')
        $('#verificationN').html('<h3>Version pro</h3>')
        $('#verificationT').html('<h3>Version pro</h3>')
        $('#verificationS').html('<h3>Version pro</h3>')
        $('#verificationLL').html('<h3>Version pro</h3>')
        $('#verificationLLD').html('<h3>Version pro</h3>')
        
        $("."+window['namePanel']).panel("close")
        console.log("modifico el contenido del panel "+window['namePanel']);
    }
}

function queryFindLessons(){
	
	db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM lessons ORDER BY week';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        console.log("cantidad de semanas "+result.rows.length);
                        
                        var fecha = new Date(getWeekIni());
                        var dateGo = new Date(getWeekIni());
                        var dias = 7;
                        
                        var lastweek = weeksOfYear(fecha);
                        console.log("ultima semana "+lastweek);
                        var countLesson = getWeekOfYear(fecha);
                        //countLesson = countLesson -1;
                        dateGo.setDate(dateGo.getDate() + (dias*countLesson));
                        window['currentL'] = getWeekOfYear(fecha) - 1;
                        //countLesson++;
                        var mesActual='';
                        var anoActual ='';
                        
	                    for(var i=0;i<lastweek; i++)
                        {
	                    	
                            mesActual = fecha.getMonth()+1;
                            anoActual = fecha.getYear();
                             countLesson = (i+1);
                            
                            
                            
                            if(i==0){
                                $('#listLessons').append('<li data-role="list-divider" data-theme="b"></li>');
                                $('#listLessons').append('<li data-role="list-divider">'+months[mesActual-1].month+', '+fecha.getFullYear()+' - '+months[mesActual-1].quarter+
                                                         '<span class="ui-li-count">'+weeksinMonth(mesActual,anoActual)+' Lessons</span>'+
                                                         '</li>');
                            }
	                    	
                            $('#listLessons').append('<li id="'+result.rows.item(i).week+'" data-nro="week'+result.rows.item(i).week+'" class="'+classApp+' '+result.rows.item(i).week+'" data-lesson="'+countLesson+'" data-date="'+months[mesActual-1].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'" data-quarter="'+months[mesActual-1].quarter+'" ><a>'+
                            '<img src="images/'+monthN[fecha.getMonth()]+''+fecha.getDate()+'.png" />'+
							'<h3>' + result.rows.item(i).title  + '</h3>' +
							'<p>' + result.rows.item(i).out1 + '</p>' +
							'<p>' + result.rows.item(i).out2 + '</p>' +
							'<p class="ui-li-aside"><strong>Lesson ' + (countLesson) + '</strong></p></a></li>');
                            
                            
                            fecha.setDate(fecha.getDate() + dias);
                            //countLesson++;
                            if(mesActual != fecha.getMonth()+1){
                                var n = fecha.getMonth();
                                if(mesActual != 8 && fecha.getMonth()+1 != 9){
                                $('#listLessons').append('<li data-role="list-divider" data-theme="b"></li>');
                                $('#listLessons').append('<li data-role="list-divider">'+months[n].month+', '+fecha.getFullYear()+' - '+months[n].quarter+
                                                         '<span class="ui-li-count">'+weeksinMonth(n,fecha.getFullYear())+' Lessons</span>'+
                                                         '</li>');
                                } 
                            }
                     
    	                }
    	                $('#listLessons').listview('refresh');
                        eventDetailLesson();
    	                $.mobile.loading( 'hide' );
                    }else{
                    	console.log("No lessons");
                    }

                },errorHandler);
            },errorHandler,nullHandler);
}

function getWeekIni(){

  Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 0) / 7);
        //where "0" represents Sunday for the Sunday School Lessons to load automatically on app launch and "7" represents the days of the week
  }

  var today = new Date();
  var YearIni;
  var weekIni;
  today.setDate(today.getDate() - (today.getDay() + 7) % 7);
  var week = today.getWeek();

  if(week < 36){
      YearIni = today.getFullYear()-1;
  }else{
    YearIni = today.getFullYear(); 
  }

  weekIni =  new Date(YearIni, 8, 1);
  weekIni.setDate(weekIni.getDate() - (weekIni.getDay() + 7) % 7);
  if(weekIni.getMonth() != 8)
      weekIni.setDate(weekIni.getDate() + 7);


  //console.log("semana iniciar "+weekIni);
    return weekIni;  
}

function getWeekOfYear(WIni) {
  
  Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 0) / 7);
        //where "0" represents Sunday for the Sunday School Lessons to load automatically on app launch and "7" represents the days of the week
  }
  
  //console.log(" A#o "+WIni.getFullYear());
  var today = new Date();
  today.setDate(today.getDate() - (today.getDay() + 7) % 7);
  var numberWeek = 1;
  var weekIni = new Date (WIni);
  var flag = true;

  if(WIni.getFullYear() == today.getFullYear())
  {
    numberWeek = ( today.getWeek() - WIni.getWeek() );
    if(numberWeek == 0){
      numberWeek++;
    }
  }else{
    while(flag){
      weekIni.setDate(weekIni.getDate() + 7);
      numberWeek++; 
      if( (weekIni.getDate() == today.getDate()) && (weekIni.getMonth() == today.getMonth()) && (weekIni.getFullYear() == today.getFullYear()) ){
        flag = false;
      }
    }

  }

  return numberWeek;

}

function weeksOfYear(WIni){

  firstWeekNextYear =  new Date(WIni.getFullYear()+1, 8, 1);
  firstWeekNextYear.setDate(firstWeekNextYear.getDate() - (firstWeekNextYear.getDay() + 7) % 7);
  if(firstWeekNextYear.getMonth() != 8)
    firstWeekNextYear.setDate(firstWeekNextYear.getDate() + 7);

  //console.log("semana inicial next year "+firstWeekNextYear);
  var weekIterativa =  new Date(WIni);
  var cont = 1;
  var flag = true;
  while(flag)
  {
      weekIterativa.setDate(weekIterativa.getDate() + 7);    

      
      if( (weekIterativa.getDate() == firstWeekNextYear.getDate()) && (weekIterativa.getMonth() == firstWeekNextYear.getMonth()) && (weekIterativa.getFullYear() == firstWeekNextYear.getFullYear()) ){
        flag = false;
      }else
      cont++;

  }

  return cont;
}

function getWeekOfMonth(){
    var today = new Date();
    year= today.getFullYear();
    var mes;
    cont = 0;
    var d= new Date(year, today.getMonth(), 1);
    
    today.setDate(today.getDate() - (today.getDay() + 7) % 7);
    mes = d.getMonth();

    d.setDate(d.getDate() - (d.getDay() + 7) % 7);
    if(mes == d.getMonth())
    {
      cont++;
    }else
    {
      d.setDate(d.getDate() + 7);
      cont++;
    }
    
    while(today.getDate() != d.getDate()){
        d.setDate(d.getDate() + 7);
        cont++;
    }

    return cont;
} 

function weeksinMonth(m, y){
    year= y;
    var mes;
    cont = 0;
    var d= new Date(year, m, 1);
    mes = d.getMonth();
    d.setDate(d.getDate() - (d.getDay() + 7) % 7);
    if(mes == d.getMonth())
    {
      cont++;
    }else
    {
      d.setDate(d.getDate() + 7);
      cont++;
    }

    while(mes == d.getMonth())
    {
      d.setDate(d.getDate() + 7);
      cont++;
      
    }
    return cont-1;     
}

function queryContentOutline(id){
    
    console.log("consultacontenidoOutline "+id);
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM content_outline where week_id='+id+' ORDER BY week_id';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
	                    resultConsult = result;
                        queryLesson(idLesson, resultConsult);
                    }else{
                    	console.log("NO content for lesson"+id);
                    }
                   
                },errorHandler);
            },errorHandler,nullHandler);
}

function queryLesson(id, resultConsult){
    
   //console.log("contenido del html");
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM lessons where week='+idLesson;
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length == 1) {
	                    var row = result.rows.item(0);
                        var htmlOut1 ='';
                        $('#lesson').text('LESSON '+titleLesson);
	                    $('#quarter').text(lessonQuarter);
                        $('#title').text(row.title);
                        $('#date').html('<strong>'+lessonDate+'</strong>');
                        if(row.memory_verse == 'no' || row.memory_verse.toUpperCase() == 'NO'){
                            console.log("semanas iteractivas");
                            if(row.intro == 'no' || row.introtoUpperCase() == 'NO'){
                                	$('#introducion').html(row.question1+'<br />- '+row.question2+'<br />- '+row.question3+'<br />- '+row.question4+'<br />- ETC...');
                            }else{
                            	$('#introducion').html('<b><u>'+row.intro+'</u></b><br />- '+row.question1+'<br />- '+row.question2+'<br />- '+row.question3+'<br />- '+row.question4+'<br />- ETC...');    
                            }
                            
                        	$('.memory_verse').hide();
                            $('#bible_pass').hide();
                            $('#out').hide();
                            $('#question').hide();
                            $('#conclusion').hide();
                            $('#outlines').hide();
                            $('.outlines').hide();
                        }else{
                            $('#memory_verse').html('<b>MEMORY VERSE TEXT</b><br>"'+row.memory_verse+'"- <strong>'+row.verse+'</strong>');
                            $('#bible_pass').html('<span class="ui-li-aside"><img src="images/biblesmall.png" /></span><br><b>BIBLE PASSAGE:</b><br>'+row.bible_pass);
                            if(row.intro != 'no' || row.intro.toUpperCase() == 'NO');
                            $('#introducion').html('<b><u>INTRODUCTION</u></b><br>'+row.intro);
                            if(row.numberOfQuestions == 2){
                            	$('#question').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p>');    
                            }
                            if(row.numberOfQuestions == 3){
                                $('#question').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p><hr><p>'+row.question3+'</p>');
                            }
                            if(row.numberOfQuestions == 4){
                                $('#question').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p><hr><p>'+row.question3+'</p><hr><p>'+row.question4+'</p>');
                            }
                            if(row.conclusion != 'no' || row.conclusion.toUpperCase() == 'NO'){
                            	$('#conclusion').html('<b>CONCLUSION</b><hr><p style="white-space:pre-line">'+row.conclusion+'</p>');    
                            }
                            
    				    
                            if(row.numberOutLines == 2){
                                $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>')    
                            }
                            if(row.numberOutLines == 3){
                                $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>');    
                            }
                            if(row.numberOutLines == 4){
                                 $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>');   
                            }
                            if(row.numberOutLines == 5){
                                 $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>');      
                            }
                            if(row.numberOutLines == 6){
                                 $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>'+'<br><b>6.'+row.out6+'</b>');         
                            }
                            if(row.numberOutLines == 7){
                                 $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>'+'<br><b>6.'+row.out6+'</b>'+'<br><b>7.'+row.out7+'</b>');       
                            }
                            if(row.numberOutLines == 8){
                                 $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>'+'<br><b>6.'+row.out6+'</b>'+'<br><b>7.'+row.out7+'</b>'+'<br><b>8.'+row.out8+'</b>');          
                            }
                            
                            for(var j=0;j<row.numberOutLines; j++)
                            {
                                for(var i=0; i<resultConsult.rows.length; i++){ 
                                    var content = resultConsult.rows.item(i);
                                    if(content.out == (j+1)){
                                        htmlOut1+='<p style="white-space:pre-line">'+content.content+'</p>';        
                                    }
                                }
                                
                                if(j==0){
                                    $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out1+'</b><hr>'+htmlOut1+'</p></li>');    
                                }
                                if(j==1){
                                    $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out2+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==2){
                                   $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out3+'</b><hr>'+htmlOut1+'</p></li>');   
                                }
                                if(j==3){
                                    $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out4+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==4){
                                    $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out5+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==5){
                                    $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out6+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==6){
                                    $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out7+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==7){
                                    $('#outlines').append('<li><p style="white-space:pre-line"><b>'+row.out8+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                htmlOut1='';
                                
                            }
                        }
                        
                        $('#detail').listview('refresh');
                        eventLessonDetail();
                    }else{
                    	console.log("No lessons "+idLesson);
                    }

                },errorHandler);
            },errorHandler,nullHandler);

}

function eventLessonDetail(){
    
    console.log("cargo los eventos del detalle de la leccion");
    $('.backLessons').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde detalle lesson");
            page = 2;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "lessons.html", {reverse: "true"} );
            init();
            
    	});
    
    fontSize()
    setFontSize(window['size'])
    $('.optionsLLD').tap(openP)
    $('body').on( "swiperight", function(){event.preventDefault();$(".optionPanelLLD").panel("close")});

    
    $('.storeLLD').tap(function(event){
        event.preventDefault();
        cargarURl();
    });

    $('input#validateLLD').tap(function(event){
        event.preventDefault();
        if($('.payedCodeLLD').val()=='')
        {
             alert('Please insert code')   
        }else
        {
             //alert("codigo en List Lessons "+$('.payedCodeLLD').val());    
             APIRequestCode($('.payedCodeLLD').val())   
        }
    });
    
}

function eventDetailLesson(){

    console.log("entro en eventos del listado de lesson");
    
    $('.homeLesson').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde lesson");
            page = 4;
             $("#page").attr("data-index","today");
            $.mobile.changePage( "today.html", {reverse: "true"} );
            init();
    	});
        
    
        $('.free').tap(function(event){
    		event.preventDefault();
            if(window['version'] == 0){
                function checkButtonSelection(param){
                     if(param == 2)
                     {
                         console.log("Le dio comprar");
                         page = 1;
                         $("#page").attr("data-index","lessons");
                         $.mobile.changePage( "lessons.html", {reverse: "true"} );
                         init();
                         cargarURl();
                     }   
                 }       
              
              navigator.notification.confirm(
              "Sorry, but the content must be purchased in order to have access to lessons and other information",
              checkButtonSelection,
              ' Oops!',
              'Cancel,Buy Now');    
            }
            if(window['version'] == 1){
                event.preventDefault();
        		console.log("SI tienes acceso a este contenido");
                idLesson = $(this).attr('id');
                titleLesson = $(this).attr('data-lesson');
                lessonQuarter = $(this).attr('data-quarter');
                lessonDate = $(this).attr('data-date');
                page = 3;
                $.mobile.changePage( "detailLesson.html", {reloadPage: true });
                init();
            }
            
    	});
            

    	$('.pro').tap(function(event){
    		event.preventDefault();
    		console.log("SI tienes acceso a este contenido");
            idLesson = $(this).attr('id');
            titleLesson = $(this).attr('data-lesson');
            lessonQuarter = $(this).attr('data-quarter');
            lessonDate = $(this).attr('data-date');
            page = 3;
            $.mobile.changePage( "detailLesson.html", {reloadPage: true });
            init();
    	});
        
        
        
         $('.calendarLesson').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde lesson");
            page = 4;
             $("#page").attr("data-index","today");
            $.mobile.changePage( "today.html", { reverse: true});
            init();
    	});
        
        $('.backHomeLesson').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde lessonsssss");
            page = 1;
            $("#page").attr("data-index","home");
            $.mobile.changePage( "home.html" );
            init();
    	});
        
        
        $('.searchLesson').tap(function(event){
            event.preventDefault();
            console.log("evento search desde HOme");
            page = 6;
            $("#page").attr("data-index","search");
            $.mobile.changePage( "search.html" );
            init();
        });
        
        $('.notesLesson').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde lesson");
            page = 5;
            $.mobile.changePage( "notes.html", { reloadPage: true });
            $("#page").attr("data-index","notes");
            init();
            
    	});
        
        fontSize()
        setFontSize(window['size'])
        $('.optionsLL').tap(openP)
        $('body').on( "swiperight", function(){event.preventDefault();$(".optionPanelLL").panel("close")});
    
        
        $('.storeLL').tap(function(event){
            event.preventDefault();
            cargarURl();
        });
    
        $('input#validateLL').tap(function(event){
            event.preventDefault();
            if($('.payedCodeLL').val()=='')
            {
                 alert('Please insert code')   
            }else
            {
                 //alert("codigo en List Lessons "+$('.payedCodeLL').val());    
                 APIRequestCode($('.payedCodeLL').val())   
            }
        });
    
}

function eventsNotes(){
    
       console.log("cargo los eventos de notes");
        $('.homeNotes').tap(function(event){
    		event.preventDefault();
    		console.log("evento del home desde notes");
            page = 1;
            $("#page").attr("data-index","home");
            $.mobile.changePage( "home.html", {reverse: "true"} );
            init();
    	});
        
         $('.calendarNotes').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde notes");
            page = 4;
             $("#page").attr("data-index","today");
            $.mobile.changePage( "today.html", {reverse: "true"} );
            init();
    	});
        
        $(".saveNote").on('tap', function(e) {
            e.preventDefault();
            if(!$('#noteTitle').val()  || !$('#text').val())
                alert('All fields are requiered')
            else{
                //alert("campos completos");
                db.transaction(insertNote, errorCB, function(){});
            }
        });
        
        $('.contentNotes').tap(function(event){
    		event.preventDefault();
    		console.log("evento de lesson desde notes");
            page = 2;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "lessons.html", {reverse: "true"} );
            init();
            
    	});
        
        $('.backHomeNotes').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde notes");
            page = 1;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "home.html", {reverse: "true"} );
            init();
    	});
        
        $('.searchNotes').tap(function(event){
            event.preventDefault();    
            console.log("evento search desde HOme");
            page = 6;
            $("#page").attr("data-index","search");
            $.mobile.changePage( "search.html" );
            init();
        });
        
        fontSize()
        setFontSize(window['size'])
        $('.optionsN').tap(openP)
        $('body').on( "swiperight", function(){event.preventDefault();$(".optionPanelN").panel("close")});

        
        $('.storeN').tap(function(event){
            event.preventDefault();
            cargarURl();
        });

        $('input#validateN').tap(function(event){
            event.preventDefault();
            if($('.payedCodeN').val()=='')
            {
                 alert('Please insert code')   
            }else
            {
                 APIRequestCode($('.payedCodeN').val())   
            }
        });
    
}

function APIRequestCode(code) {
    console.log("revisando el codigo de activacion ");
    if(code == 'none'){
            //alert('Insert valide code please');
            queryDataUser();
    }
    else{
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
                    queryDataUser();
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

function updateClient(){
    console.log("Actualizando el cliente");
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
                        var sql = "UPDATE userData SET version = 1 WHERE version = '0' ";
                        console.log("sql "+sql);
                        transaction.executeSql(sql, [],function(transaction, result) {},errorHandler);
                    },errorHandler,nullHandler);
    $.mobile.loading( 'hide' );
    alert('Activated successfully');
    version = 1;
    window['version'] = '1';
    //window['listLesson'] = false;
    //window['dataLesson'] = '';
    window['today'] = false;
    versionType();
    page = 1;
    $.mobile.changePage( "home.html" );
    $("#page").attr("data-index","home");
    init();
}

function queryBlesedWeek(){
   
    console.log("bessed week");
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 0) / 7);
    }
    var fecha = new Date(getWeekIni());
    var semana = getWeekOfYear(fecha);
    
    db.transaction(function(transaction) {
      var sql = 'SELECT * FROM blessed_week where week_id='+semana;
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                       blessedWeek = result;
                       if(version == 1){
                         queryOutlineWeek(semana,blessedWeek);       
                       }else{
                           showLessonWeek(blessedWeek, semana);
                       }
                    }else{
                    	console.log("NO blesed week for "+semana);
                    }
                   
                },errorHandler);
            },errorHandler,nullHandler);
}

function showLessonWeek(blessedWeek, week){
    
    console.log("mostrando solo version free");
    var fecha = new Date();
    fecha.setDate(fecha.getDate() - (fecha.getDay() + 7) % 7);
    
    $('#pro').hide();
    
    $('#blessedWeek').append('<li data-role="list-divider" data-theme="b"></li>'+
                             '<li data-role="list-divider">Week-'+week+
                             '<span class="ui-li-count">'+months[fecha.getMonth()].quarter+'</span>'+
                             '</li>');
    //----------------------------------------------------------------------------------------------------------------                    
    /*$('#blessedWeek').append('<li id="sun"><a><img src="images/dateIcons/sunday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sun+'</p>'+
                             '<p class="ui-li-aside"><strong>Sunday</strong></p></a></li>'); 
    $('#sun').tap(function(e){
        e.preventDefault();
        alert(blessedWeek.rows.item(0).sun)
        
    })*/
    //fecha.setDate(fecha.getDate() + 1);
    $('#blessedWeek').append('<li id="sun"><img src="images/dateIcons/sunday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sun+'</p>'+
                             '<p class="ui-li-aside"><strong>Sunday</strong></p></li>'); 
    $('#sun').tap(function(e){
        e.preventDefault();
        navigator.notification.alert(blessedWeek.rows.item(0).mon,function(){},'Blessed Day','Ok');
    })
    fecha.setDate(fecha.getDate() + 1);
    //----------------------------------------------------------------------------------------------------------------
    $('#blessedWeek').append('<li id="mon"><img src="images/dateIcons/monday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).mon+'</p>'+
                             '<p class="ui-li-aside"><strong>Monday</strong></p></li>'); 
    $('#mon').tap(function(e){
        e.preventDefault();
        navigator.notification.alert(blessedWeek.rows.item(0).mon,function(){},'Blessed Day','Ok');
    })
    fecha.setDate(fecha.getDate() + 1);
    //----------------------------------------------------------------------------------------------------------------
    $('#blessedWeek').append('<li id="tue"><img src="images/dateIcons/tuesday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).tue+'</p>'+
                             '<p class="ui-li-aside"><strong>Tuesday</strong></p></li>'); 
    $('#tue').tap(function(e){
        e.preventDefault();
        navigator.notification.alert(blessedWeek.rows.item(0).tue,function(){},'Blessed Day','Ok');
    })
    fecha.setDate(fecha.getDate() + 1);
    //----------------------------------------------------------------------------------------------------------------
    $('#blessedWeek').append('<li  id="wed"><img src="images/dateIcons/wednesday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).wed+'</p>'+
                             '<p class="ui-li-aside"><strong>Wednesday</strong></p></li>');
    $('#wed').tap(function(e){
        e.preventDefault();
        navigator.notification.alert(blessedWeek.rows.item(0).wed,function(){},'Blessed Day','Ok');
    })
    fecha.setDate(fecha.getDate() + 1);
    //----------------------------------------------------------------------------------------------------------------
    $('#blessedWeek').append('<li id="thu"><img src="images/dateIcons/thursday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).thu+'</p>'+
                             '<p class="ui-li-aside"><strong>Thursday</strong></p></li>'); 
    $('#thu').tap(function(e){
        e.preventDefault();
        navigator.notification.alert(blessedWeek.rows.item(0).thu,function(){},'Blessed Day','Ok');
    })
    fecha.setDate(fecha.getDate() + 1);
    //----------------------------------------------------------------------------------------------------------------
    $('#blessedWeek').append('<li id="fri"><img src="images/dateIcons/friday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).fri+'</p>'+
                             '<p class="ui-li-aside"><strong>Friday</strong></p></li>');
    $('#fri').tap(function(e){
        e.preventDefault();
        navigator.notification.alert(blessedWeek.rows.item(0).fri,function(){},'Blessed Day','Ok');
    })
    fecha.setDate(fecha.getDate() + 1);
    //----------------------------------------------------------------------------------------------------------------
    $('#blessedWeek').append('<li id="sat"><img src="images/dateIcons/saturday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sat+'</p>'+
                             '<p class="ui-li-aside"><strong>Saturday</strong></p></li>'+
                             '<li data-role="list-divider" data-theme="b"></li>');
    $('#sat').tap(function(e){
        e.preventDefault();
        navigator.notification.alert(blessedWeek.rows.item(0).sat,function(){},'Blessed Day','Ok');
    })
    //----------------------------------------------------------------------------------------------------------------
    $('#blessedWeek').listview('refresh');
    eventsCalendar();
}

function queryOutlineWeek(week, blessedWeek){
    
    console.log("mostrando version paga");
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM content_outline where week_id='+week+' ORDER BY out';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
	                    resultConsult = result;
                        queryLessonWeek(week, blessedWeek, resultConsult);
                    }else{
                    	console.log("NO content for lesson"+id);
                    }
                   
                },errorHandler);
            },errorHandler,nullHandler);
    
}

function queryLessonWeek(week, blessedWeek, resultConsult){
    
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    Date.prototype.getWeekOfMonth = function(exact) {
        var month = this.getMonth()
            , year = this.getFullYear()
            , firstWeekday = new Date(year, month, 1).getDay()
            , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
            , offsetDate = this.getDate() + firstWeekday - 1
            , index = 0 // start index at 0 or 1, your choice
            , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
            , week = index + Math.floor(offsetDate / 7)
        ;
        if (exact || week < 2 + index) return week;
        return week === weeksInMonth ? index + 5 : week;
    }
    
    var LessonNumber = '';
    var fecha = new Date();
    fecha.setDate(fecha.getDate() - (fecha.getDay() + 7) % 7);
    var today = new Date();
    var semanaInicial =  new Date(getWeekIni());
    LessonNumber = getWeekOfYear(semanaInicial);
    
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM lessons where week='+week;
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length == 1) {
	                    var row = result.rows.item(0);
                        if(today.getDate() != fecha.getDate()){
                            $('#pro').hide();
                        }
                        var htmlOut1='';
                        var htmlOut2='';
                        $('#lessonBW').text('LESSON '+LessonNumber);
	                    $('#quarterBW').text(months[fecha.getMonth()].quarter);
                        $('#titleBW').text(row.title);
                        $('#dateBW').html('<strong>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</strong>');
                        if(row.memory_verse == 'no' || row.memory_verse.toUpperCase() == 'NO'){
                            console.log("semanas iteractivas");
                            $('#introducionBW').html('<b><u>'+row.intro+'</u></b><br />- '+row.question1+'<br />- '+row.question2+'<br />- '+row.question3+'<br />- '+row.question4+'<br />- ETC...');
                        	$('.memory_verseBW').hide();
                            $('#bible_passBW').hide();
                            $('#outBW').hide();
                            $('#questionBW').hide();
                            $('#conclusionBW').hide();
                            $('#outBW').hide();
                            $('.outBW').hide();
                        }else{
                            $('#memory_verseBW').html('<b>MEMORY VERSE TEXT</b><br>"'+row.memory_verse+'"- <strong>'+row.verse+'</strong>');
                            $('#bible_passBW').html('<span class="ui-li-aside"><img src="images/biblesmall.png" /></span><br><b>BIBLE PASSAGE:</b><br>'+row.bible_pass);
                            $('#introducionBW').html('<b><u>INTRODUCTION</u></b><br>'+row.intro);
                            if(row.numberOfQuestions == 2){
                            	$('#questionBW').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p>');    
                            }
                            if(row.numberOfQuestions == 3){
                                $('#questionBW').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p><hr><p>'+row.question3+'</p>');
                            }
                            if(row.numberOfQuestions == 4){
                                $('#questionBW').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p><hr><p>'+row.question3+'</p><hr><p>'+row.question4+'</p>');
                            }
                            
                            $('#conclusionBW').html('<b>CONCLUSION</b><hr><p style="white-space:pre-line">'+row.conclusion+'</p>');
                            if(row.numberOutLines == 2){
                                $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>')    
                            }
                            if(row.numberOutLines == 3){
                                $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>');    
                            }
                            if(row.numberOutLines == 4){
                                 $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>');   
                            }
                            if(row.numberOutLines == 5){
                                 $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>');      
                            }
                            if(row.numberOutLines == 6){
                                 $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>'+'<br><b>6.'+row.out6+'</b>');         
                            }
                            if(row.numberOutLines == 7){
                                 $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>'+'<br><b>6.'+row.out6+'</b>'+'<br><b>7.'+row.out7+'</b>');       
                            }
                            if(row.numberOutLines == 8){
                                 $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>'+'<br><b>3.'+row.out3+'</b>'+'<br><b>4.'+row.out4+'</b>'+'<br><b>5.'+row.out5+'</b>'+'<br><b>6.'+row.out6+'</b>'+'<br><b>7.'+row.out7+'</b>'+'<br><b>8.'+row.out8+'</b>');          
                            }
                            for(var j=0;j<row.numberOutLines; j++)
                            {
                                for(var i=0; i<resultConsult.rows.length; i++){ 
                                    var content = resultConsult.rows.item(i);
                                    if(content.out == (j+1)){
                                        htmlOut1+='<p style="white-space:pre-line">'+content.content+'</p>';        
                                    }
                                }
                                
                                if(j==0){
                                    $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out1+'</b><hr>'+htmlOut1+'</p></li>');    
                                }
                                if(j==1){
                                    $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out2+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==2){
                                   $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out3+'</b><hr>'+htmlOut1+'</p></li>');   
                                }
                                if(j==3){
                                    $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out4+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==4){
                                    $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out5+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==5){
                                    $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out6+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==6){
                                    $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out7+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                if(j==7){
                                    $('#outlinesBW').append('<li><p style="white-space:pre-line"><b>'+row.out8+'</b><hr>'+htmlOut1+'</p></li>');
                                }
                                htmlOut1='';
                                
                            }
                        }
                        
                        $('#LessonBW').listview('refresh');
                        /*for(var i=0; i<resultConsult.rows.length; i++){
	                    	var content = resultConsult.rows.item(i);
                            if(content.out == 1)
                            {
                                htmlOut1+='<p style="white-space:pre-line">'+content.content+'</p>';
                            
                            }else{
                                htmlOut2+='<p style="white-space:pre-line">'+content.content+'</p>';        
                            }
                        }
                        
                        $('#outline1BW').html('<b>'+row.out1+'</b><hr>'+htmlOut1);
                        $('#outline2BW').html('<b>'+row.out2+'</b><hr>'+htmlOut2);
                        */
                        
                        
                        $('#blessedWeek').append('<li data-role="list-divider" data-theme="b"></li>'+
                                                 '<li data-role="list-divider">Week-'+week+
                                                 '<span class="ui-li-count">'+months[fecha.getMonth()].quarter+'</span>'+
    	                                         '</li>');
                        
                        $('#blessedWeek').append('<li id="sun" data-id="'+week+'" data-lesson="'+row.title+'" data-quarter="'+months[fecha.getMonth()].quarter+'" data-date="'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'"><a><img src="images/dateIcons/sunday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sun+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Sunday</strong></p></a></li>'); 
                        
                        $('#sun').tap(function(e){
                            e.preventDefault();
                            navigator.notification.alert(blessedWeek.rows.item(0).sun,function(){},'Blessed Day','Ok');
                               /*if(window['version'] == 0){
                                function checkButtonSelection(param){
                                     if(param == 2)
                                     {
                                         console.log("Le dio comprar");
                                         page = 1;
                                         $("#page").attr("data-index","lessons");
                                         $.mobile.changePage( "lessons.html", {reverse: "true"} );
                                         init();
                                         cargarURl();
                                     }   
                                 }       
                              
                              navigator.notification.confirm(
                              "Sorry, but the content must be purchased in order to have access to lessons and other information",
                              checkButtonSelection,
                              ' Oops!',
                              'Cancel,Buy Now');    
                            }
                            if(window['version'] == 1){
                                event.preventDefault();
                        		console.log("SI tienes acceso a este contenido");
                                idLesson = $(this).attr('data-id');
                                titleLesson = $(this).attr('data-lesson');
                                lessonQuarter = $(this).attr('data-quarter');
                                lessonDate = $(this).attr('data-date');
                                page = 3;
                                $.mobile.changePage( "detailLesson.html", {reloadPage: true });
                                init();
                            }*/
                            
                            
                        });
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li id="mon"><img src="images/dateIcons/monday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).mon+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Monday</strong></p></li>'); 
    			        
                        $('#mon').tap(function(e){
                            e.preventDefault();
                            navigator.notification.alert(blessedWeek.rows.item(0).mon,function(){},'Blessed Day','Ok');
                        })
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li id="tue"><img src="images/dateIcons/tuesday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).tue+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Tuesday</strong></p></li>'); 
                        
                        $('#tue').tap(function(e){
                            e.preventDefault();
                            navigator.notification.alert(blessedWeek.rows.item(0).tue,function(){},'Blessed Day','Ok');
                            
                        })
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li id="wed"><img src="images/dateIcons/wednesday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).wed+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Wednesday</strong></p></li>');
                        
                        $('#wed').tap(function(e){
                            e.preventDefault();
                            navigator.notification.alert(blessedWeek.rows.item(0).wed,function(){},'Blessed Day','Ok');
                        })
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li id="thu"><img src="images/dateIcons/thursday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).thu+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Thursday</strong></p></li>'); 
                        
                        $('#thu').tap(function(e){
                            e.preventDefault();
                            navigator.notification.alert(blessedWeek.rows.item(0).thu,function(){},'Blessed Day','Ok');
                        })
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li id="fri"><img src="images/dateIcons/friday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).fri+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Friday</strong></p></li>');
                        
                        $('#fri').tap(function(e){
                            e.preventDefault();
                            navigator.notification.alert(blessedWeek.rows.item(0).fri,function(){},'Blessed Day','Ok');
                        })
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li id="sat"><img src="images/dateIcons/saturday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sat+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Saturday</strong></p></li>'+
                                                 '<li data-role="list-divider" data-theme="b"></li>');
                        
                        $('#sat').tap(function(e){
                            e.preventDefault();
                            navigator.notification.alert(blessedWeek.rows.item(0).sat,function(){},'Blessed Day','Ok');
                        })
                        
                        $('#blessedWeek').listview('refresh');
                        
                        eventsCalendar();
                    }else{
                    	console.log("No lessons "+idLesson);
                    }

                },errorHandler);
            },errorHandler,nullHandler);
}

function getFormatD(d) {
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var y = d.getFullYear();
    return (month <= 9 ? '0' + month : month) + '/' + (day <= 9 ? '0' + day : day) + '/' + y
}

function insertNote(db) {
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
        transaction.executeSql('INSERT INTO note (date, title, content) VALUES (?,?,?)',
                [getFormatD(new Date()), $('#noteTitle').val(),$('#text').val()], function(){
                                addNote(totalNotes,getFormatD(new Date()), $('#noteTitle').val(),$('#text').val())
                                totalNotes++;
                                $('#noteTitle').val('')
                                $('#text').val('')
                                },
                errorHandler);
    });
}

function accFocus( event, ui ) {
    //alert(event.currentTarget)
}

function addNote(index,date,title,content){
    
    $('#listNotes').prepend('<div data-role="collapsible" id="note'+index+'" data-collapsed="false">'+
                           '<h3>'+title+' - '+date+'</h3><label for="noteTitle'+index+'" class="ui-input-text">Note title</label>'+
                           '<div antes class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-d">'+
                           '<input name="noteTitle" id="noteTitle'+index+'" disabled maxlength="15" placeholder="Less than 15 characters please" type="text" readonly value="'+title+'" class="ui-input-text ui-body-d"/></div>'+
                           '<label for="text'+index+'" class="ui-input-text" >Note content</label>'+
                           '<textarea id="text'+index+'" maxlength="750" disabled placeholder="Write your notes here" readonly class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset">'+content+'</textarea>'+
                           '<div data-demo-html="true">'+
                           '<p>'+
                           '<a href="#" id="edit'+index+'" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-hover-c"><span class="ui-btn-inner"><span class="ui-btn-text">Edit</span></span></a>'+
                           '<a href="#" id="delete'+index+'" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-hover-c"><span class="ui-btn-inner"><span class="ui-btn-text">Delete</span></span></a>'+
                           '</p>'+
                           '</div>').collapsibleset('refresh');
                           
    
    $('#listNotes').collapsibleset('refresh');       
    
    $('#edit'+index).on('tap', function() {
        if($(this).find('span').find('span').html() === 'Edit'){
            $('input#noteTitle'+index).removeAttr('readonly').removeAttr('disabled')
            $('#text'+index).removeAttr('readonly').removeAttr('disabled')
            $(this).find('span').find('span').html('Save')
        }
        else{
            if(!$('input#noteTitle'+index).val() || !$('#text'+index).val()){
                alert('Please complete all fields before saving')
            }
            else{
                currentDate = getFormatD(new Date())
                editNote(index,$('input#noteTitle'+index).val(),$('#text'+index).val())
                $('#note'+index).find('h3').find('.ui-btn-text').html($('input#noteTitle'+index).val()+' - '+getFormatD(new Date()))
                $('input#noteTitle'+index).attr('readonly','true').attr('disabled','true');
                $('#text'+index).attr('readonly','true').attr('disabled','true');
                $(this).find('span').find('span').html('Edit')
            }
        }
});
    
    $('#delete'+index).on('tap', function(e) {
        e.preventDefault();
        navigator.notification.confirm(
        "Are sure you want to delete this note?",
        checkButtonSelection,
        'Delete Note',
        'No,Yes');
        function checkButtonSelection(param){
            if(param == 2){
                deleteNote(index)
                $('#note'+index).fadeOut('slow',function(){$(this).remove();});
            }
        }
    });
}

function queryNote(){
    
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      var sql = 'SELECT * FROM note';
        transaction.executeSql(sql, [],function(transaction, result) {
                 if (result.rows.length > 0) {
                    totalNotes = result.rows.length;
                     setTimeout(function() {
                     for (var i=0; i<result.rows.length; i++){
                        addNote(result.rows.item(i).note_id,result.rows.item(i).date,result.rows.item(i).title,result.rows.item(i).content);
                        
                    }
                    console.log("SI HAY NOTAS EN LA BD "+totalNotes);
                         eventsNotes();
                    }, 700);  
                    
                 }else{
                     setTimeout(function() {
                         console.log("NO HAY NOTAS EN LA BD");
                         eventsNotes();
                      }, 1000);
                  }   
                },errorHandler);
            },errorHandler,nullHandler);
}

function deleteNote(index){
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
                        var sql = 'DELETE FROM note WHERE note_id = '+index;
                        transaction.executeSql(sql, [],function(transaction, result) {},errorHandler);
                    },errorHandler,nullHandler);
}

function editNote(index,title,content){
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
                        var sql = 'UPDATE note SET title = "' + title + '",content = "' + content + '",date = "' + currentDate + '" WHERE note_id = ' + index;
                        transaction.executeSql(sql, [],function(transaction, result) {},errorHandler);
                    },errorHandler,nullHandler);
}

function fontSize() {
	var min=6;
	var max=20;
	$('.fontSizePlus').tap(function() {
		if (window['size'] <= max) {
		    setFontSize(++window['size'])
		}
		return false;	
	});
	$('.fontSizeMinus').tap(function() {
		if (window['size'] >= min) {
			setFontSize(--window['size'])
		}
		return false;	
	});
	$('.fontReset').tap(function () {
		 setFontSize(originalFont)
	});
}

function setFontSize(size){
    $('div[data-role="content"], div[data-role="listview"], ul, li, p').css({'fontSize' : size});
}
