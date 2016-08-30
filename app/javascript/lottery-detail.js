const $     = require('jquery');
const utils = require('../javascript/lib/utils');
$(function(){
		const winnerData = utils.getLocal('winnerData',true);
		var html = '';
		
		for(let i in winnerData){
			let len  = countObjectLength(winnerData[i][0]);
			html    += `<tr><th colspan="${len}"><h2>${i}</h2></th></tr>`;
			html    += winnerData[i].map(function(element,index){
				let tmp = '<tr>';
				for(let key in element ) {
					if(key != 'id'){
						tmp +=`<td>${element[key]}</td>`;
					}
				}
				tmp +='</tr>';
				return tmp;
			});
		}
		$("#ExportTab").html(html);
	});
	function countObjectLength(object){
		let sum = 0;
		for(let i in object){
			sum++;
		}
		return sum;
	}
	var tableToExcel = (function() {
	  var uri = 'data:application/vnd.ms-excel;base64,';
	  var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head></head><body><table>{table}</table></body></html>';
	    var base64 = function(s) {return window.btoa(unescape(encodeURIComponent(s))) };
	    var format = function(s, c) {return s.replace(/{(\w+)}/g,function(m, p) {return c[p]; }) };
	  return function(table, name) {
	    if (!table.nodeType) table= document.getElementById(table)
	    var ctx = {worksheet: name|| 'Worksheet', table: table.innerHTML}
	    window.location.href = uri+ base64(format(template, ctx))
	  }
	})(); 
	function toExcel(inTblId, inWindow) {  
    tableToExcel('ExportTab','');
	} 
	function getTblData(inTbl, inWindow) {  
    var rows = 0; var tblDocument = document;  
    if (!!inWindow && inWindow != "") {  
        if (!document.all(inWindow)) {  
            return null;  
        } else {  
            tblDocument = eval(inWindow).document;  
        }  
    }  
    var curTbl = tblDocument.getElementById(inTbl);  
    if (curTbl.rows.length > 65000) {  
        utils.toastMsg('源行数不能大于65000行');  
        return false;  
    }  
    if (curTbl.rows.length <= 1) {  
        utils.toastMsg('数据源没有数据');  
        return false;  
    }  
    var outStr = "";  
    if (curTbl != null) {  
        for (var j = 0; j < curTbl.rows.length; j++) {  
            for (var i = 0; i < curTbl.rows[j].cells.length; i++) {  
                if (i == 0 && rows > 0) {  
                    outStr += " \t"; rows -= 1;  
                }  
                var tc = curTbl.rows[j].cells[i];  
                if (j > 0 && tc.hasChildNodes() && tc.firstChild.nodeName.toLowerCase() == "input") {  
                    if (tc.firstChild.type.toLowerCase() == "checkbox") {  
                        if (tc.firstChild.checked == true) {  
                            outStr += "是" + "\t";  
                        } else {  
                            outStr += "否" + "\t";  
                        }  
                    }  
                } else {  
                    outStr += " " + curTbl.rows[j].cells[i].innerText + "\t";  
                }  
                if (curTbl.rows[j].cells[i].colSpan > 1) {  
                    for (var k = 0; k < curTbl.rows[j].cells[i].colSpan - 1; k++) {  
                        outStr += " \t";  
                    }  
                }  
                if (i == 0) {  
                    if (rows == 0 && curTbl.rows[j].cells[i].rowSpan > 1) {  
                        rows = curTbl.rows[j].cells[i].rowSpan - 1;  
                    }  
                }  
            }  
            outStr += "\r\n";  
        }  
    } else {  
        outStr = null; utils.toastMsg(inTbl + "不存在!");  
    }  
    return outStr;  
	}  
	function getExcelFileName() {  
    var d = new Date(); var curYear = d.getYear(); var curMonth = "" + (d.getMonth() + 1);  
    var curDate = "" + d.getDate(); var curHour = "" + d.getHours(); var curMinute = "" +  
     d.getMinutes(); var curSecond = "" + d.getSeconds();  
    if (curMonth.length == 1) {  
        curMonth = "0" + curMonth;  
    }  
    if (curDate.length == 1) {  
        curDate = "0" + curDate;  
    }  
    if (curHour.length == 1) {  
        curHour = "0" + curHour;  
    }  
    if (curMinute.length == 1) {  
        curMinute = "0" + curMinute;  
    }  
    if (curSecond.length == 1) {  
        curSecond = "0" + curSecond;  
    }  
    var fileName = "设备状态" + curYear + curMonth + curDate + curHour + curMinute + curSecond + ".xls";  
    return fileName;  
	}  
	function doFileExport(inName, inStr) {  
    var xlsWin = null;  
    if (!!document.all("glbHideFrm")) {  
        xlsWin = glbHideFrm;  
    } else {  
        var width = 1; var height = 1;  
        var openPara = "left=" + (window.screen.width / 2 + width / 2) + ",top=" + (window.screen.height + height / 2) +  
         ",scrollbars=no,width=" + width + ",height=" + height;  
        xlsWin = window.open("", "_blank", openPara);  
    }  
    xlsWin.document.write(inStr);  
    xlsWin.document.close();  
    xlsWin.document.execCommand('Saveas', true, inName);  
    xlsWin.close();  
	} 
	