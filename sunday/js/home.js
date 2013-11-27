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
var email = '';
var idDispositivo;
var valTypeSearch='BW'
window['size'] = 16
window['version'] = '';
window['listLesson'] = false;
window['dataLesson'] = '';
window['today'] = false;
window['idioma'] = '';
window['changeversion']=false;



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
	
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("pause", onPause, false);
    
    //queryVersionApp()
    if(page ==''){
         if($("#page").attr("data-index") == "home"){
            page=1;
        }
    }
    
    /*if(window['idioma'] == ''){
        console.log("no tiene lenguaje definido");
        queryVersionApp();
    }*/
    
    if(page == 1){
        console.log("eventos de pagina 1");
        if(window['dataLesson'] == ''){
            console.log("primera vez para variable sesion consulta de lecciones");
            queryLessons(); 
            if(window['version']==''){
                 queryVersionApp();           
            }
        }
    }
    else{
        if(page == 2){
          console.log("pagina 2 listado lesson");  
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
                        queryNote();
                        //eventsNotes();
                    }else{
                        if(page == 6){
                            console.log("pagina 6 search");
                            setTimeout(function() {
                            eventssearch();
                            }, 500);
                            
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
                $.mobile.changePage( "home.html", { transition: "slide" });
                init(); 
            }else{
                if(page == 3)
                {
                     page = 2;
                     $("#page").attr("data-index","lessons");
                     $.mobile.changePage( "lessons.html", { transition: "slideup" });
                     init();
                }else if(page == 4 || page == 5 || page == 6){
                        page = 1;
                        $.mobile.changePage( "home.html", { transition: "slide" });
                        init();        
                    }
                }
            }
}
 

function eventsCalendar(){
    
    console.log("cargo los eventos del calendar");
        
        $('.homeCalendar').tap(function(event){
    		event.preventDefault();
    		console.log("evento del home desde calendar");
            page = 1;
            $.mobile.changePage( "home.html", { transition: "slide" });
            $("#page").attr("data-index","home");
            init();
    	});
        
        $('.contentCalendar').tap(function(event){
    		event.preventDefault();
            console.log("tap lessons desde calendar");
            page = 2;
            $.mobile.changePage( "lessons.html", { transition: "slideup" });
            $("#page").attr("data-index","lessons");
    		//window.location='lessons.html';
            init();
    	});  
        
        $('.notesCalendar').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde calendar");
            page = 5;
            $.mobile.changePage( "notes.html", { transition: "slideup", reloadPage: true });
            $("#page").attr("data-index","notes");
    		//window.location='lessons.html';
            init();
    	});
        
        $('.backHomeCalendar').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde lessonsssss");
            page = 1;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "home.html", { transition: "slide" });
            init();
    	});
        
        $('.noAuth').tap(function(event){
    		event.preventDefault();
    		//alert("Avaliable in the Premion version");
            //messageGoPro();
            function checkButtonSelection(param){
                 if(param == 2)
                 {
                     //console.log("Le dio comprar");
                     //page = 6;
                     //$.mobile.changePage( "browser.html", { transition: "slideup", reloadPage: true });
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
            $.mobile.changePage( "search.html", { transition: "slideup", reloadPage: true });
            init();
        });
        
        eventsPanel()
    
}

function eventssearch(){
    
    console.log("cargo los eventos del search");
    
    valTypeSearch = 'BW';
    $('#searchBlessed').show();
    
        $('.homeSearch').tap(function(event){
    		event.preventDefault();
    		console.log("evento del home desde search");
            page = 1;
            $.mobile.changePage( "home.html", { transition: "slide" });
            $("#page").attr("data-index","home");
            init();
    	});
        
        $('.contentSearch').tap(function(event){
    		event.preventDefault();
            console.log("tap lessons desde search");
            page = 2;
            $.mobile.changePage( "lessons.html", { transition: "slideup"});
            $("#page").attr("data-index","lessons");
    		//window.location='lessons.html';
            init();
    	});  
        
        $('.notesSearch').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde search");
            page = 5;
            $.mobile.changePage( "notes.html", { transition: "slideup", reloadPage: true });
            $("#page").attr("data-index","notes");
    		//window.location='lessons.html';
            init();
    	});
        
        $('.backHomeSearch').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde search");
            page = 1;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "home.html", { transition: "slide" });
            init();
    	});
        
        $('.calendarSearch').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde search");
            page = 4;
            $.mobile.changePage( "today.html", { transition: "slideup"});
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
                 $('#listNotes').html('');
                
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
                $('#listNotes').html('');
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
                $('#listNotes').html('');
            }
        });
        
        $('.searchInput').keyup(function(e){
            
            e.preventDefault();
            db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
            
            if($(".searchInput").val().length == 0){
                console.log("no hay nada")
                document.getElementById("listLessonsS").innerHTML="";
                document.getElementById("listBlessedWeek").innerHTML="";
                document.getElementById("listNotes").innerHTML="";
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
                         $('#listNotes').html('');
                         SearchNotes();
                    }else
                        if (valTypeSearch == 'LS' && $(".searchInput").val().length > 3) 
                        {
                            console.log("incremento es mayor a 3 y es LS"); 
                            $('#listLessonsS').html('');
                            SearchLesson();   
                        }
        });
        
        eventsPanel()
     
}

function getDateOfWeek(week){
    
    var date =  new Date();
    var d= new Date(date.getFullYear(), 0, 1);
    var mes = d.getMonth();
    d.setDate(d.getDate() - (d.getDay() + 7) % 7);
    var numberWeek = week;
    numberWeek--;
    if(mes != d.getMonth())
    {
        d.setDate(d.getDate() + 7);
        numberWeek--;
    }
    d.setDate(d.getDate() + 7*numberWeek);
    
    
    return d;
}

function SearchBW(){
    
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      var sql = 'SELECT * FROM blessed_week where week_id='+$(".searchInput").val();
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        
                     var weekBlessed = result.rows.item(0);
                     var date =  new Date(getDateOfWeek($(".searchInput").val()));
                     var mes = date.getMonth();   
                     console.log(""+months[mes].month);   
                     //console.log("si hay resultados y la fecha de la semana "+$(".searchInput").val()+" es ");
                        
                    $('#listBlessedWeek').append('<li data-role="list-divider" data-theme="b"></li>'+
                                             '<li data-role="list-divider">Week-'+$(".searchInput").val()+
                                             '<span class="ui-li-count"></span>'+
	                                         '</li>');
                    
                    $('#listBlessedWeek').append('<li><img src="images/calendar_dates_icons/sunday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.sun+'</p>'+
                                             '<p class="ui-li-aside"><strong>Sunday</strong></p></li>'); 
                        
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/calendar_dates_icons/monday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.mon+'</p>'+
                                             '<p class="ui-li-aside"><strong>Monday</strong></p></li>'); 
			        
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/calendar_dates_icons/tuesday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.tue+'</p>'+
                                             '<p class="ui-li-aside"><strong>Tuesday</strong></p></li>'); 
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/calendar_dates_icons/wednesday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.wed+'</p>'+
                                             '<p class="ui-li-aside"><strong>Wednesday</strong></p></li>');
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/calendar_dates_icons/thursday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.thu+'</p>'+
                                             '<p class="ui-li-aside"><strong>Thursday</strong></p></li>'); 
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/calendar_dates_icons/friday.png" />'+
                                             '<h3>'+months[mes].month+'-'+date.getDate()+'-'+date.getFullYear()+'</h3><p>'+weekBlessed.fri+'</p>'+
                                             '<p class="ui-li-aside"><strong>Friday</strong></p></li>');
                    
                    date.setDate(date.getDate() + 1);
                    mes = date.getMonth();
                    $('#listBlessedWeek').append('<li><img src="images/calendar_dates_icons/saturday.png" />'+
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
                            $('#listNotes').prepend('<div data-role="collapsible" id="note'+note.note_id+'" data-collapsed="false">'+
                           '<h3>'+note.title+' - '+note.date+'</h3><label for="noteTitle'+note.note_id+'" class="ui-input-text">Note title</label>'+
                           '<div antes class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-d">'+
                           '<input name="noteTitle" id="noteTitle'+note.note_id+'" maxlength="15" placeholder="Less than 15 characters please" type="text" readonly value="'+note.title+'" class="ui-input-text ui-body-d"/></div>'+
                           '<label for="text'+note.note_id+'" class="ui-input-text" >Note content</label>'+
                           '<textarea id="text'+note.note_id+'" maxlength="750" placeholder="Write your notes here" readonly class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset">'+note.content+'</textarea>').collapsibleset('refresh');
                        }
                        
                        $('#listNotes').collapsibleset('refresh')
                    }else{
                    	
                        $('#listNotes').append('<h3>No find results</h3>');
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
                        for(var i=0; i<result.rows.length; i++){
                           
                          $('#listLessonsS').append('<li id="'+result.rows.item(i).week+'" ><a href="#"'+
							'>'+
							'<img src="images/calendar_dates_icons/sep_01.png" />'+
							'<h3>' + result.rows.item(i).title  + '</h3>' +
							'<p>' + result.rows.item(i).out1 + '</p>' +
							'<p>' + result.rows.item(i).out1 + '</p>' +
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
    url = 'http://lesson.galeriasmall.com/?email='+email;
    console.log("la url es "+url);
    var ref = window.open(encodeURI(url), '_system', 'location=no');
    ref.addEventListener('loadstart', function(event) { });
    ref.addEventListener('loadstop', function(event) {  });
    ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
    ref.addEventListener('exit', function(event) { 
        console.log("cerro el navegador");
        window.location="home.html";
    });
}

function eventsPanel(){
    fontSize()
    setFontSize(window['size'])
    $('.options').tap(openP)
    $('body').on( "swipeleft", openP );
    $('body').on( "swiperight", function(){$("#optionPanel").panel("close")});
    $('input#validate').tap(function(){
        if(!$('.payedCode').val())
            alert('Please insert code')
        else
            APIRequestCode($('input#payedCode').val())
    })
    $('.store').tap(function(){
        cargarURl();
    })
}

function eventsHome(){
     
    console.log("eventos de home cargados");

        $('.content').tap(function(event){
    		event.preventDefault();
            console.log("tap lessons");
            page = 2;
            $.mobile.changePage( "lessons.html", { transition: "slideup" });
            $("#page").attr("data-index","lessons");
    		//window.location='lessons.html';
            init();
	    });  
    
        $('.home').tap(function(event){
    		event.preventDefault();
            console.log("tap home desde home");
            
    	});
        
        $('.calendar').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde home");
            page = 4;
            $.mobile.changePage( "today.html", { transition: "slideup" });
            $("#page").attr("data-index","today");
            init();
    	});
        
        $('#goBW').tap(function(event){
    		event.preventDefault();
            page = 4;
            $.mobile.changePage( "today.html", { transition: "slideup" });
            $("#page").attr("data-index","today");
            init();
    	});
        
        $('.notes').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde home");
            page = 5;
            $.mobile.changePage( "notes.html", { transition: "slideup" });
            $("#page").attr("data-index","notes");
    		//window.location='lessons.html';
            init();
    	});
        
        $('.search').tap(function(event){
            console.log("evento search desde HOme");
            page = 6;
            $("#page").attr("data-index","search");
            $.mobile.changePage( "search.html", { transition: "slideup"});
            init();
        });
        
        eventsPanel()
    
        

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
                           IdUsuario = row.id;
                           selectedL = row.language;
                           window['idioma'] =  row.language;
                           console.log("usuario "+IdUsuario+"  languaje es"+window['idioma']);
                           email = row.email;
                           window['version']=row.version;
                           ApiRequestLessons(window['idioma']);

                    }else{
                    	console.log("Error in the query of userData");
                    }

                },errorHandler);
            },errorHandler,nullHandler);
}

function ApiRequestLessons(selectedL){

	var url = "http://dry-dawn-9293.herokuapp.com/lessons/language/"+selectedL;
    $.ajaxSetup({
        type: "GET",
        dataType: "json"
    });

    $.ajax({
    	
    	url: url,
        success: function(data) {
           dataWS = data;
           db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
           console.log("success API lessons");
           db.transaction(InsertLessons, errorCB, successCB);

        },
        error: function(xhr, status, error) {
            console.log("error en la consulta de lessons");
        }
    });
}

function InsertLessons(tx){
	var countLesson = 0;
	
    $.each(dataWS, function(k,v){
			
            sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, intro, bible_pass) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.introduction+'","'+v.bible_passage+'")';
            
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
                        
                        email = row.email;
                        if(page == 2){
                            if(version == 0){
                                classApp = 'free';
                    	    }else{
                                classApp = 'pro';   
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
        $('input#payedCode').hide()
        $('input#validate').closest('.ui-btn').hide()
        $('input#store').closest('.ui-btn').hide()
        $('#verification').html('<h3>Version pro</h3>')
        console.log("version paga");
    }
}

function queryFindLessons(){
	
	db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM lessons ORDER BY week';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
                        console.log("cantidad de semanas "+result.rows.length);
                        
                        Date.prototype.getWeek = function() {
                        var onejan = new Date(this.getFullYear(), 0, 1);
                        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 0) / 7);
                        }
                        
                        var fecha = new Date();
                        var i=0;
                        var dias = 7;
                        fecha.setDate(fecha.getDate() - (fecha.getDay() + 7) % 7);
                        //console.log(fecha);
                        var lastweekDate = new Date("2013-12-31");
                        var lastweek = lastweekDate.getWeek();
                        var semana = fecha.getWeek()-1;
                        console.log("semana inicial "+semana);
                        console.log("semana ultima "+lastweek);
                        var countLesson = getWeekOfMonth();
                        var mesActual='';
                        var anoActual ='';
                        
	                    while(i<lastweek){
	                    	
                            mesActual = fecha.getMonth()+1;
                            anoActual = fecha.getYear();
                            
                            if(i==0){
                                $('#listLessons').append('<li data-role="list-divider" data-theme="b"></li>');
                                $('#listLessons').append('<li data-role="list-divider">'+months[mesActual-1].month+', '+fecha.getFullYear()+' - '+months[mesActual-1].quarter+
                                                         '<span class="ui-li-count">'+weeksinMonth(mesActual-1,anoActual)+' Lessons</span>'+
                                                         '</li>');
                            }
	                    	
                            $('#listLessons').append('<li id="'+result.rows.item(semana).week+'" class="'+classApp+'" data-lesson="'+countLesson+'" data-date="'+months[mesActual-1].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'" data-quarter="'+months[mesActual-1].quarter+'" ><a href="#"'+
							'>'+
							'<img src="images/calendar_dates_icons/sep_01.png" />'+
							'<h3>' + result.rows.item(semana).title  + '</h3>' +
							'<p>' + result.rows.item(semana).out1 + '</p>' +
							'<p>' + result.rows.item(semana).out1 + '</p>' +
							'<p class="ui-li-aside"><strong>Lesson ' + (countLesson) + '</strong></p></a></li>');
                            
                            
                            fecha.setDate(fecha.getDate() + dias);
                            if(mesActual == fecha.getMonth()+1){
                                countLesson++;
                            }else{
                                countLesson = 1;
                                var n = fecha.getMonth();
                                $('#listLessons').append('<li data-role="list-divider" data-theme="b"></li>');
                                $('#listLessons').append('<li data-role="list-divider">'+months[n].month+', '+fecha.getFullYear()+' - '+months[n].quarter+
                                                         '<span class="ui-li-count">'+weeksinMonth(n,fecha.getFullYear())+' Lessons</span>'+
                                                         '</li>');
                                if(anoActual != fecha.getYear()){
                                    semana = 0;
                                }
                            }
                            semana++;
                            i++;
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
                        var htmlOut2 = '';
                        $('#lesson').text('LESSON 0'+titleLesson);
	                    $('#quarter').text(lessonQuarter);
                        $('#title').text(row.title);
                        $('#date').html('<strong>'+lessonDate+'</strong>');
                        $('#memory_verse').html('<b>MEMORY VERSE TEXT</b><br>"'+row.memory_verse+'"- <strong>'+row.verse+'</strong>');
                        $('#bible_pass').html('<span class="ui-li-aside"><img src="images/Bible_small.png" /></span><br><b>BIBLE PASSAGE:</b><br>'+row.bible_pass);
                        $('#introducion').html('<b><u>INTRODUCTION</u></b><br>'+row.intro);
                        $('#out').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>')    
                        $('#question').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p>');
                        $('#conclusion').html('<b>CONCLUSION</b><hr><p style="white-space:pre-line">'+row.conclusion+'</p>');
				    
                        for(var i=0; i<resultConsult.rows.length; i++){
	                    	var content = resultConsult.rows.item(i);
                            if(content.out == 1)
                            {
                                htmlOut1+='<p style="white-space:pre-line">'+content.content+'</p>';
                            
                            }else{
                                htmlOut2+='<p style="white-space:pre-line">'+content.content+'</p>';        
                            }
                        }
                        
                        $('#outline1').html('<b>'+row.out1+'</b><hr>'+htmlOut1);
                        $('#outline2').html('<b>'+row.out2+'</b><hr>'+htmlOut2);
    
                        eventLessonDetail();
                    }else{
                    	console.log("No lessons "+idLesson);
                    }

                },errorHandler);
            },errorHandler,nullHandler);

}

function eventLessonDetail(){
    
    $('.backLessons').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde detalle lesson");
            page = 2;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "lessons.html", { transition: "slide" });
            init();
    	});
    
}

function eventDetailLesson(){

    console.log("entro en eventos detailLesson");
        /*$('.backLessons').tap(function(event){
    		//event.preventDefault();
    		console.log("evento del back desde detalle lesson");
            page = 2;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "lessons.html", { transition: "slide" });
            init();
    	});*/
    
    
    $('.homeLesson').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde lesson");
            page = 4;
             $("#page").attr("data-index","today");
            $.mobile.changePage( "today.html", { transition: "slide"});
            init();
    	});
        
    
        $('.free').tap(function(event){
    		event.preventDefault();
            function checkButtonSelection(param){
                 if(param == 2)
                 {
                     console.log("Le dio comprar");
                     page = 1;
                     $("#page").attr("data-index","lessons");
                     $.mobile.changePage( "home.html", { transition: "slide" });
                     init();
                     cargarURl();
                 }   
             }       
              
              navigator.notification.confirm(
              "Not avaliable in FREE version, you want to buy the app? ",
              checkButtonSelection,
              'Information',
              'Cancel,Buy');
    	});
            

    	$('.pro').tap(function(event){
    		event.preventDefault();
    		console.log("SI tienes acceso a este contenido");
            idLesson = $(this).attr('id');
            titleLesson = $(this).attr('data-lesson');
            lessonQuarter = $(this).attr('data-quarter');
            lessonDate = $(this).attr('data-date');
            page = 3;
            $.mobile.changePage( "detailLesson.html", { transition: "slide", reloadPage: true });
            init();
    	});
        
        
        
         $('.calendarLesson').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde lesson");
            page = 4;
             $("#page").attr("data-index","today");
            $.mobile.changePage( "today.html", { transition: "slide"});
            init();
    	});
        
        $('.backHomeLesson').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde lessonsssss");
            page = 1;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "home.html", { transition: "slide" });
            init();
    	});
        
        
        $('.searchLesson').tap(function(event){
            event.preventDefault();
            console.log("evento search desde HOme");
            page = 6;
            $("#page").attr("data-index","search");
            $.mobile.changePage( "search.html", { transition: "slideup", reloadPage: true });
            init();
        });
        
        $('.notesLesson').tap(function(event){
    		event.preventDefault();
            console.log("tap notes desde lesson");
            page = 5;
            $.mobile.changePage( "notes.html", { transition: "slideup", reloadPage: true });
            $("#page").attr("data-index","notes");
            init();
    	});
        
        eventsPanel()
    
}

function eventsNotes(){
    
       
        $('.homeNotes').tap(function(event){
    		event.preventDefault();
    		console.log("evento del home desde notes");
            page = 1;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "home.html", { transition: "slide" });
            init();
    	});
        
         $('.calendarNotes').tap(function(event){
    		event.preventDefault();
            console.log("tap calendar desde notes");
            page = 4;
             $("#page").attr("data-index","today");
            $.mobile.changePage( "today.html", { transition: "slide" });
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
            $.mobile.changePage( "lessons.html", { transition: "slide" });
            init();
    	});
        
        $('.backHomeNotes').tap(function(event){
    		event.preventDefault();
    		console.log("evento del back desde notes");
            page = 1;
            $("#page").attr("data-index","lessons");
            $.mobile.changePage( "home.html", { transition: "slide" });
            init();
    	});
        
        $('.searchNotes').tap(function(event){
            event.preventDefault();    
            console.log("evento search desde HOme");
            page = 6;
            $("#page").attr("data-index","search");
            $.mobile.changePage( "search.html", { transition: "slideup", reloadPage: true });
            init();
        });
        
        eventsPanel();
    
}

function APIRequestCode(code) {
    console.log("revisando el codigo de activacion ");
    if(code == 'none')
        alert('Insert valide code please')
    else{
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://dry-dawn-9293.herokuapp.com/user/active_code/" + code,
            success: function(data) {
                idDispositivo = device.uuid;
                if (data.uuid_1 == idDispositivo || data.uuid_2 == idDispositivo){
                    // El dispositivo se le borro la informacion
                    dataWS = data;
                    alert("The application is registered in two devices, it will be activate as free version");
                    updateClient();
                    //Actualizar cliente
                } else {
                    if (data.count_device < 2) {
                        if (data.count_device == 0) {
                            APIRequestUpdateCount(data._id, 1);
                        } else {
                            APIRequestUpdateCount(data._id, 2);
                        }
                    } else {
                        //alert(language[window['idioma']].twoDevices);
                        alert("The application is registered in two devices, it will be activate as free version");
                        //APIRequestInsert();
                    }
                }
            },
            error: function(xhr, status, error) {
                //console.log(""+language[selectedL].badCodeActivation+" "+selectedL);
                //alert(language[selectedL].badCodeActivation);
                alert("Invalid activation code");
                //console.log("codigo de acivacion incorrecto");
            }
        });
    }
}

function updateClient(){
    console.log("Actualizando el cliente");
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
                        var sql = "UPDATE userData SET version = 1 WHERE id = '"  + dataWS._id+"'";
                        console.log("sql "+sql);
                        transaction.executeSql(sql, [],function(transaction, result) {},errorHandler);
                    },errorHandler,nullHandler);
    version = 1;
    window['version'] = '';
    window['listLesson'] = false;
    //window['dataLesson'] = '';
    window['today'] = false;
    window['changeversion'] = true;
    versionType();
}

function APIRequestUpdateCount(idUser, count) {
    console.log("Aumentando numero de dispositivos");
    var url = "http://dry-dawn-9293.herokuapp.com/user/" + idUser + "/" + count;
    console.log("contador a actualizar es " + count);
    idDispositivo = device.uuid;
    $.ajaxSetup({
        contentType: "application/json; charset=utf-8",
        type: "PUT",
        dataType: "json",
        url: url
    });

    $.ajax({
        
        data: JSON.stringify({"count_device": count, "uuid": idDispositivo}),
        success: function(data) {
            //alert(language[window['idioma']].successUpdatePro);
             alert("Device registered successfully");
             dataWS = data;
             updateClient();
            //insertClient(1);
        },
        error: function(xhr, status, error) {
            //alert(language[window['idioma']].errorUpdatePro); 
            alert("Error registering the device");
        }
    });
}


function queryBlesedWeek(){
   
    
    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 0) / 7);
    }
    var fecha = new Date();
    fecha.setDate(fecha.getDate() - (fecha.getDay() + 7) % 7);
    var semana = fecha.getWeek();
    
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
                        
    $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/sunday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sun+'</p>'+
                             '<p class="ui-li-aside"><strong>Sunday</strong></p></li>'); 
    
    fecha.setDate(fecha.getDate() + 1);
    
    $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/monday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).mon+'</p>'+
                             '<p class="ui-li-aside"><strong>Monday</strong></p></li>'); 
    
    fecha.setDate(fecha.getDate() + 1);
    $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/tuesday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).tue+'</p>'+
                             '<p class="ui-li-aside"><strong>Tuesday</strong></p></li>'); 
    
    fecha.setDate(fecha.getDate() + 1);
    $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/wednesday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).wed+'</p>'+
                             '<p class="ui-li-aside"><strong>Wednesday</strong></p></li>');
    
    fecha.setDate(fecha.getDate() + 1);
    $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/thursday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).thu+'</p>'+
                             '<p class="ui-li-aside"><strong>Thursday</strong></p></li>'); 
    
    fecha.setDate(fecha.getDate() + 1);
    $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/friday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).fri+'</p>'+
                             '<p class="ui-li-aside"><strong>Friday</strong></p></li>');
    
    fecha.setDate(fecha.getDate() + 1);
    $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/saturday.png" />'+
                             '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sat+'</p>'+
                             '<p class="ui-li-aside"><strong>Saturday</strong></p></li>'+
                             '<li data-role="list-divider" data-theme="b"></li>');
    
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
    LessonNumber = fecha.getWeekOfMonth();
    var today = new Date();
    
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
                        $('#lessonBW').text('LESSON 0'+LessonNumber);
	                    $('#quarterBW').text(months[fecha.getMonth()].quarter);
                        $('#titleBW').text(row.title);
                        $('#dateBW').html('<strong>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</strong>');
                        $('#memory_verseBW').html('<b>MEMORY VERSE TEXT</b><br>"'+row.memory_verse+'"- <strong>'+row.verse+'</strong>');
                        $('#bible_passBW').html('<span class="ui-li-aside"><img src="images/Bible_small.png" /></span><br><b>BIBLE PASSAGE:</b><br>'+row.bible_pass);
                        $('#introducionBW').html('<b><u>INTRODUCTION</u></b><br>'+row.intro);
                        $('#outBW').html('<br><b>1. '+row.out1+'</b><br><b>2.'+row.out2+'</b>')    
                        $('#questionBW').html('<b>QUESTIONS</b><hr><p>'+row.question1+'</p><hr><p>'+row.question2+'</p>');
                        $('#conclusionBW').html('<b>CONCLUSION</b><hr><p style="white-space:pre-line">'+row.conclusion+'</p>');
				    
                        for(var i=0; i<resultConsult.rows.length; i++){
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
    
                        $('#blessedWeek').append('<li data-role="list-divider" data-theme="b"></li>'+
                                                 '<li data-role="list-divider">Week-'+week+
                                                 '<span class="ui-li-count">'+months[fecha.getMonth()].quarter+'</span>'+
    	                                         '</li>');
                        
                        $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/sunday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sun+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Sunday</strong></p></li>'); 
                        
                        fecha.setDate(fecha.getDate() + 1);
                        
                        $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/monday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).mon+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Monday</strong></p></li>'); 
    			        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/tuesday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).tue+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Tuesday</strong></p></li>'); 
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/wednesday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).wed+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Wednesday</strong></p></li>');
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/thursday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).thu+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Thursday</strong></p></li>'); 
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/friday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).fri+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Friday</strong></p></li>');
                        
                        fecha.setDate(fecha.getDate() + 1);
                        $('#blessedWeek').append('<li><img src="images/calendar_dates_icons/saturday.png" />'+
                                                 '<h3>'+months[fecha.getMonth()].month+'-'+fecha.getDate()+'-'+fecha.getFullYear()+'</h3><p>'+blessedWeek.rows.item(0).sat+'</p>'+
                                                 '<p class="ui-li-aside"><strong>Saturday</strong></p></li>'+
                                                 '<li data-role="list-divider" data-theme="b"></li>');
                        
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
    /*var hh = d.getHours();
    var m = d.getMinutes();
    var dd = "AM";
    if (hh >= 12) {
        hh -= 12;
        dd = "PM";
    }
    if (hh == 0) {
        hh = 12;
    }
    m = m<10?"0"+m:m;
    hh = hh<10?"0"+hh:hh;*/
    //return (month <= 9 ? '0' + month : month) + '/' + (day <= 9 ? '0' + day : day) + '/' + y + ' - ' + hh +':'+ m +' ' + dd;
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
                    }, 500);  
                    
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

function openP(){
    versionType()   
    $(".optionPanel").panel("open");
}

function fontSize() {
	var min=9;
	var max=21;
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
		 setFontSize(16)
	});
}

function setFontSize(size){
    $('div[data-role="content"], div[data-role="listview"], ul, li, p').css({'fontSize' : size});
}
