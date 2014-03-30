var semana= 'semana';
var specialweek= '';
var semana2= '';
function errorHandler(transaction, error) {
    alert('Error: ' + error.message + ' code: ' + error.code);
}
function successCB() {

}

function errorCB(err) {
    //console.log("Error processing SQL: " + err + semana );
    console.log('Error: ' + err.message + ' code: ' + err.code);
    console.log(semana2);
    
}

function nullHandler() {
}

function createDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS userData (version integer, language integer);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS blessed_week (week_id integer, mon TEXT, tue TEXT, wed TEXT, thu TEXT, fri TEXT, sat TEXT, sun TEXT);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS content_outline (week_id integer, out int, content TEXT);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS lessons (week integer, title varchar[50], out1 varchar[50], out2 varchar[50], out3 varchar[50], out4 varchar[50], out5 varchar[50], out6 varchar[50], out7 varchar[50], out8 varchar[50], question1 varchar[255], question2 varchar[255], question3 varchar[255], question4 varchar[255], conclusion text, verse varchar[50], memory_verse text, date TEXT, intro TEXT, bible_pass TEXT, numberOutLines INTEGER, numberOfQuestions INTEGER);');
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
    $.each(dataWS2, function(k,v){
         for(var i=0; i<v.content.length; i++){
			    for(var j=0; j<v.content[i].length; j++){
					sqlContenOutline = 'INSERT INTO content_outline(week_id, out, content) VALUES('+v.week+","+(i+1)+',"'+v.content[i][j]+'")';
					semana2 = sqlContenOutline;
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
    //var sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4, out1, out2, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES (53,"BIENVENIDO A LA CUARTA SESION INTERACTIVA","undefined","no","no","no","HACER PREGUNTAS SOBRE LAS LECCIÃ“NES YA ESTUDIADAS PARA ACLARAR DUDAS","DAR TU VALORACIÃ“N CRÃTICA SOBRE LOS ESQUEMAS","DAR SUGERENCIAS ÃšTILES PARA OBTENER  UN MEJOR DESEMPEÃ‘O","DAR CONTRIBUCIONES ESPÃRITUALES ÃšTILES","HACER PREGUNTAS SOBRE LAS LECCIÃ“NES YA ESTUDIADAS PARA ACLARAR DUDAS","DAR TU VALORACIÃ“N CRÃTICA SOBRE LOS ESQUEMAS","TU PRIVILEGIO:","no", 2,4)';
    //tx.executeSql(sqlLesson);
    //console.log(dataWS);
	
    $.each(dataWS, function(k,v){
			
            semana = v.week;
			if(v.outline.length == 2){
                if(v.question.length == 2){
                	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.introduction+'","'+v.bible_passage+'",2,2)';    
                }
                if(v.question.length == 3){
                 	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, out1, out2, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.introduction+'","'+v.bible_passage+'", 2,3)';   
                }
                if(v.question.length == 4){
                 	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4, out1, out2, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.question[3]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.introduction+'","'+v.bible_passage+'", 2,4)';   
                }
            }
            if(v.outline.length == 3){
                if(v.question.length == 2){
                	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.introduction+'","'+v.bible_passage+'", 3, 2)';        
                }
                if(v.question.length == 3){
					sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, out1, out2, out3, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.introduction+'","'+v.bible_passage+'", 3, 3)';                        
                }
                if(v.question.length == 4){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4, out1, out2, out3, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.question[3]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.introduction+'","'+v.bible_passage+'", 3, 4)';                        
                }
            }
            if(v.outline.length == 4){
                if(v.question.length == 2){
                	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.introduction+'","'+v.bible_passage+'", 4, 2)';    
                }
                if(v.question.length == 3){
                 	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, out1, out2, out3, out4, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.introduction+'","'+v.bible_passage+'", 4, 3)';       
                }
                if(v.question.length == 4){
                 	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4, out1, out2, out3, out4, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.question[3]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.introduction+'","'+v.bible_passage+'", 4, 4)';          
                }
                    
            }
            if(v.outline.length == 5){
                if(v.question.length == 2){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.introduction+'","'+v.bible_passage+'", 5, 2)';    
                }
                if(v.question.length == 3){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, out1, out2, out3, out4, out5, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.introduction+'","'+v.bible_passage+'", 5, 3)';
                }
                if(v.question.length == 4){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4,  out1, out2, out3, out4, out5, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.question[3]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.introduction+'","'+v.bible_passage+'", 5, 4)';
                }
                
            }
            if(v.outline.length == 6){
                if(v.question.length == 2){
                	sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.introduction+'","'+v.bible_passage+'", 6, 2)';        
                }
                if(v.question.length == 3){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, out1, out2, out3, out4, out5, out6, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.introduction+'","'+v.bible_passage+'", 6, 3)';
                }
                if(v.question.length == 4){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4, out1, out2, out3, out4, out5, out6, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.question[3]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.introduction+'","'+v.bible_passage+'", 6, 4)';
                }
                
            }
            if(v.outline.length == 7){
                if(v.question.length == 2){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, out7, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.introduction+'","'+v.bible_passage+'", 2, 2)';
                }
                if(v.question.length == 3){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3,  out1, out2, out3, out4, out5, out6, out7, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.introduction+'","'+v.bible_passage+'", 3, 3)';
                }
                if(v.question.length == 4){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4, out1, out2, out3, out4, out5, out6, out7, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.question[3]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.introduction+'","'+v.bible_passage+'", 4, 4)';
                }
                    
            }
            if(v.outline.length == 8){
                if(v.question.length == 2){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, out1, out2, out3, out4, out5, out6, out7, out8, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.outline[7]+'","'+v.introduction+'","'+v.bible_passage+'", 8, 2)';    
                }
                if(v.question.length == 3){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, out1, out2, out3, out4, out5, out6, out7, out8, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.outline[7]+'","'+v.introduction+'","'+v.bible_passage+'", 8, 3)';    
                }
                if(v.question.length == 4){
                    sqlLesson= 'INSERT OR REPLACE INTO lessons (week, title, date, memory_verse, verse, conclusion, question1, question2, question3, question4, out1, out2, out3, out4, out5, out6, out7, out8, intro, bible_pass, numberOutLines, numberOfQuestions) VALUES ('+v.week+',"'+ v.title+'","'+v.date+'","'+v.memory_verse+'","'+v.verse+'","'+v.conclusion+'","'+v.question[0]+'","'+v.question[1]+'","'+v.question[2]+'","'+v.question[3]+'","'+v.outline[0]+'","'+v.outline[1]+'","'+v.outline[2]+'","'+v.outline[3]+'","'+v.outline[4]+'","'+v.outline[5]+'","'+v.outline[6]+'","'+v.outline[7]+'","'+v.introduction+'","'+v.bible_passage+'", 8, 4)';    
                }
                
            }               
            
			sqlBlessedWeek = 'INSERT OR REPLACE INTO blessed_week(week_id, mon, tue, wed, thu, fri, sat, sun) VALUES('+v.week+',"'+v.blessed_week[0]+'","'+v.blessed_week[1]+'","'+v.blessed_week[2]+'","'+v.blessed_week[3]+'","'+v.blessed_week[4]+'","'+v.blessed_week[5]+'","'+v.blessed_week[6]+'" )';
			//console.log(sqlBlessedWeek)
        
            tx.executeSql(sqlBlessedWeek);
        
			semana2  = sqlLesson;
        	//console.log(sqlLesson);
        	tx.executeSql(sqlLesson);        
			countLesson++;
            
		});
		
		console.log("number of lessons "+countLesson);
        if(!window['activation']){
            //insertClient(0);    
        }else{
            console.log("va por el contenido pro");
            ApiRequestLessonsPRO($('#language').val(),randomKey,hash);   
        }
        
}

