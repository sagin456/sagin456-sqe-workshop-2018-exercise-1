import $ from 'jquery';
import {parseCode} from './code-analyzer';

let first_time = true;//a variable to symbolize this is the first time to run, so we don't have to clean table

//inspired by stack overflow
const build_html_table = (rows) => {
    let html_table = document.getElementById('html_table');
    for(let i=0;i<rows.length; i++){
        let new_row = html_table.insertRow();
        for(let j=0; j<5;j++){
            let new_cell = new_row.insertCell(j);
            new_cell.innerHTML = rows[i][j];
        }
    }
};

const clean_html_table = () =>{
    let len = 0;
    if(!first_time){
        len = document.getElementById('html_table').rows.length-1;
    }
    for(let i=len;i>0;i--){
        document.getElementById('html_table').deleteRow(i);
    }
    first_time=false;
};


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        clean_html_table();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        build_html_table(parsedCode);
    });
});
