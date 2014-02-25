
function errorHandler(transaction, error) {
    alert('Error: ' + error.message + ' code: ' + error.code);
}
function successCB() {

}

function errorCB(err) {
    alert("Error processing SQL: " + err);
}

function nullHandler() {
}

function createDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS userData (version integer, language integer);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS blessed_week (week_id integer, mon TEXT, tue TEXT, wed TEXT, thu TEXT, fri TEXT, sat TEXT, sun TEXT);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS content_outline (week_id integer, out int, content TEXT);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS lessons (week integer, title varchar[50], out1 varchar[50], out2 varchar[50], out3 varchar[50], out4 varchar[50], out5 varchar[50], out6 varchar[50], out7 varchar[50], out8 varchar[50], question1 varchar[255], question2 varchar[255], conclusion text, verse varchar[50], memory_verse text, date long, intro TEXT, bible_pass TEXT, numberOutLines INTEGER);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS note (note_id integer PRIMARY KEY, date varchar[18],title varchar[27], content TEXT);');
    queryClient();
}

var publicKey='FrfuSF7Hnuf7';
var privateKey='YbeusYXc60c1V1';

function makeRandomKey()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function InsertContentPro(tx){
     
    var sqlContenOutline ='';
    $.each(dataWS, function(k,v){
         for(var i=0; i<v.content.length; i++){
			    for(var j=0; j<v.content[i].length; j++){
					sqlContenOutline = 'INSERT INTO content_outline(week_id, out, content) VALUES('+v.week+","+(i+1)+',"'+v.content[i][j]+'")';
					//console.log(sqlContenOutline);
                    tx.executeSql(sqlContenOutline);		
				}
			}
     });
    alert('Activated successfully');
    insertClient(1);
}

function InsertLessons(tx){
	var countLesson = 0;
	
    $.each(dataWS, function(k,v){
			
            if(v.outline.length == 2){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.introduction+'","'+v.bible_passage+'", 2)';    
            }
            if(v.outline.length == 3){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.introduction+'","'+v.bible_passage+'", 3)';    
            }
            if(v.outline.length == 4){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.introduction+'","'+v.bible_passage+'", 4)';    
            }
            if(v.outline.length == 5){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.introduction+'","'+v.bible_passage+'", 5)';    
            }
            if(v.outline.length == 6){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.introduction+'","'+v.bible_passage+'", 6)';    
            }
            if(v.outline.length == 7){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, out7, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.introduction+'","'+v.bible_passage+'", 7)';    
            }
            if(v.outline.length == 8){
                sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, out7, out8, intro, bible_pass, numberOutLines) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.questions[0]+'","'+v.questions[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.outline[7]+'","'+v.introduction+'","'+v.bible_passage+'", 8)';    
            }
            
			sqlBlessedWeek = 'INSERT OR REPLACE INTO blessed_week(week_id, mon, tue, wed, thu, fri, sat, sun) VALUES('+v.week+',"'+v.blessed_week[0]+'","'+v.blessed_week[1]+'","'+v.blessed_week[2]+'","'+v.blessed_week[3]+'","'+v.blessed_week[4]+'","'+v.blessed_week[5]+'","'+v.blessed_week[6]+'" )';
			
            tx.executeSql(sqlBlessedWeek);
        
            //Insertar cuando sea version pro
			/*for(var i=0; i<v.content.length; i++){
			    for(var j=0; j<v.content[i].length; j++){
					sqlContenOutline = 'INSERT INTO content_outline(week_id, out, content) VALUES('+v.week+","+(i+1)+',"'+v.content[i][j]+'")';
					tx.executeSql(sqlContenOutline);		
				}
			}*/
			
			tx.executeSql(sqlLesson);
			countLesson++;
            
		});
		
		console.log("number of lessons "+countLesson);
        if(!window['activation']){
            insertClient(0);    
        }else{
            ApiRequestLessonsPRO($('#language').val(),randomKey,hash);   
        }
        
}

