
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
    tx.executeSql('CREATE TABLE IF NOT EXISTS userData (version integer, language integer, id varchar[40], email varchar[255]);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS blessed_week (week_id integer, mon TEXT, tue TEXT, wed TEXT, thu TEXT, fri TEXT, sat TEXT, sun TEXT);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS content_outline (week_id integer, out int, content TEXT);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS lessons (week integer, title varchar[50], out1 varchar[50], out2 varchar[50], out3 varchar[50], out4 varchar[50], out5 varchar[50], out6 varchar[50], out7 varchar[50], out8 varchar[50], question1 varchar[255], question2 varchar[255], conclusion text, verse varchar[50], memory_verse text, date long, intro TEXT, bible_pass TEXT, numberOutLines INTEGER);');
    tx.executeSql('CREATE TABLE IF NOT EXISTS note (note_id integer PRIMARY KEY, date varchar[18],title varchar[27], content TEXT);');
    queryClient();
}
