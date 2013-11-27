var db; 
var dataWS = '';
var IdUsuario = '';
var language = '';
var version = 0;
var classApp = '';
var pagina ='2';
document.addEventListener("deviceready", onDeviceReady, false);

$(document).on('pagebeforeshow', '#home', function(){       
    //console.log("evento before home -> lessons");
    //pagina=1;
    
    $('#content').tap(function(event){
		event.preventDefault();
        console.log("se va para lessons");
		window.location='lessons.html';
		//queryVersionApp();
		//console.log("le dio click a la lesson");
	});
});

function onDeviceReady() {
    db = window.openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    init();
}

function init() {
	queryVersionApp();

    $.mobile.loading( 'show', {
		text: "",
		textVisible: "false",
		theme: "b",
		html: ""
	});

    $('#home').tap(function(event){
		event.preventDefault();
		//document.location="home.html";
		//$.mobile.changePage("home.html");
        $.mobile.changePage( "home.html", { transition: "slideup", reloadPage: true });
	});

	$('#back').click(function(event){
		event.preventDefault();
		//document.location="home.html";
		//$.mobile.changePage("home.html");
        $.mobile.changePage( "home.html", { transition: "slideup", reloadPage: true });
	});



}


function queryVersionApp(){

    db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM userData';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length == 1) {
                        var row = result.rows.item(0);
                    	version = row.version;
                    	if(version == 0){
                    		console.log("version gratis");
                    		classApp = 'free';
                    		queryFindLessons();
                    	}else{
                    		classApp = 'pro';
                    		console.log("version paga");
                            queryFindLessons();
                    	}
                          
                    }else{
                    	console.log("No USERS");
                    }

                },errorHandler);
            },errorHandler,nullHandler);
}

function queryFindLessons(){
	
	db = openDatabase("sundayApp", "1.0", "Sunday School DB", 1000000);
    db.transaction(function(transaction) {
      
      var sql = 'SELECT * FROM lessons';
        transaction.executeSql(sql, [],function(transaction, result) {
                    if (result.rows.length > 0) {
	                    for(var i=0; i<result.rows.length; i++){
	                    	var row = result.rows.item(i);
	                    	
	                    	$('#listLessons').append('<li class="'+classApp+'"><a href="#"'+
							'>'+
							'<img src="images/calendar_dates_icons/sep_01.png" />'+
							'<h3>' + row.title  + '</h3>' +
							'<p>' + row.out1 + '</p>' +
							'<p>' + row.out1 + '</p>' +
							'<p class="ui-li-aside"><strong>Lesson ' + (i+1) + '</strong></p></a></li>');
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

function eventDetailLesson(){

	$('.free').tap(function(event){
		event.preventDefault();
		alert("Information not avaliable in FREE version");
	});

	$('.pro').tap(function(event){
		event.preventDefault();
		console.log("SI tienes acceso a este contenido");
	});


}