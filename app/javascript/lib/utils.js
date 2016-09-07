const fs         = require('fs-extra');
// before require the lib, we should use npm install node-xlsx --save;
const xlsxParser = require('node-xlsx');
const $          = require('jquery');
const dataPath   = process.cwd() + '/app/data/';

function alertMsg(message,messageType = 'info',delayTime = 1500){
	if($("#msg").size() == 0){
		$('body').append('<div id="msg"></div>');
	}
	$("#msg").html(`<div class="alert alert-${messageType}" role="alert">${message}</div>`).show();
  setTimeout(function(){
    $("#msg").hide();
  },delayTime);
}
module.exports = {
	debug: true,
	toastMsg:function(message,messageType = 'info',delayTime = 1500){
		alertMsg(message,messageType = 'info',delayTime = 1500);
	},
	/**
	 * [parseXlsx 解析excel]
	 * @param  {[type]} filePath [excel文件路径]
	 * @return {[type]}          [description]
	 */
	parseXlsx:function(filePath){
		return xlsxParser.parse(filePath);
	},
	/**
	 * [readFile 根据path同步读取数据]
	 * @param  {[type]} path [文件坐在路径]
	 * @return {[type]}      [description]
	 */
	readFile : function(path){
		try{
			return fs.readFileSync(path,{encoding:'utf8'});
		}catch(error) {
			return [];
		}
		
	},
	/**
	 * [createPath 生成文件路径]
	 * @param  {[type]} fileName [文件名称]
	 * @return {[type]}          [description]
	 */
	createPath : function(fileName){
		return dataPath + fileName;
	},
	/**
	 * [writeFile 写入文件]
	 * @param  {[type]} path      [路径]
	 * @param  {[type]} data      [数据]
	 * @param  {[type]} showError [是否显示错误信息]
	 * @return {[type]}           [description]
	 */
	writeFile : function(path,data,showError){
		try {
      fs.outputFile(path,data);
      if(showError) return true;
    }catch(err) {
    	return err.toString();
    }
	},
	emptyDir:function(){
		try {
      fs.emptyDirSync(dataPath)
      return true;
    }catch(err) {
    	return err.toString();
    }
		
	},
	/**
	 * [createRandom 创建随机数]
	 * @param  {[type]} min [最小值]
	 * @param  {[type]} max [最大值]
	 * @return {[type]}     [description]
	 */
	createRandom: function(min,max){
		return parseInt(Math.random()*(max-min+1));   
	},
	/**
	 * [deleteElement 从数组中删除元素或者对象，当key存在则删除的是对象]
	 * @param  {[type]} array    [数组]
	 * @param  {[type]} element  [删除元素的值]
	 * @param  {[type]} key  		 [删除数组值为对象的key]
	 * @return {[type]}          [description]
	 */
	deleteElement:function (array,element,key){
		for(let i = 0 , ii = array.length ; i < ii ; i++){
			let value = key ? array[i][key] : array[i];
			if(value == element) {
				array.splice(i,1);
				return array;	
			};
		};
		return array;
	},
	/**
	 * [objectInArray 判断元素是否存在数据中]
	 * @param  {[type]} array   [description]
	 * @param  {[type]} element [元素值]
	 * @param  {[type]} key     [key存在时，则元素为对象]
	 * @return {[type]}         [description]
	 */
	objectInArray:function(array,element,key){
		if(!array || !element) return false;  
		for(let i = 0 , ii = array.length ; i < ii ; i++){
			let value = key ? array[i][key] : array[i];
			if(value == element) return true;
		};
		return false;
	},
	emptyObject:function(object){
		if(typeof object == "object"){
			for(var n in object){
	    	return false
	    } 
	    return true; 
		}
	},
	validate:function (validateForm){
		var sumRequired = 0;
		var size        = $(validateForm).size();
    $(validateForm).each(function(index,element){
      if(doValidate(element)){
        sumRequired++;
      }else{
      	return false;
      }
    });
    if(sumRequired == size){
      return true;
    }else {
      return false;
    }
    function doValidate(object){
    	var reg         = $(object).attr('reg');
	    var value       = $(object).val();
	    var msg         = $(object).attr('placeholder') || '输入有误请核实';
	    if(reg && !checkReg(reg,value) ){
	      alertMsg(msg);
	      return false;
	    }else {
	      return true;
	    }
    }
    function checkReg(regStr,value){
      var reg = new RegExp(regStr);
      return reg.test(value) ? true : false;
    }
  },
	/**
	 * [setLocal 将数据缓存到本地]
	 * @param {[type]} name   [数据键名]
	 * @param {[type]} data   [数据值]
	 * @param {[type]} toJson [是否转json 通常对象需要转json]
	 */
	setLocal:function(name,data,toJson){
		let cacheData = toJson ? JSON.stringify(data) : data;
		localStorage.setItem(name,cacheData);
	},
	/**
	 * [getLocal 获取本地缓存数据]
	 * @param  {[type]} name [数据键名]
	 * @return {[type]}      [description]
	 */
	getLocal:function(name,parseJson){
		const value = localStorage.getItem(name);
		return parseJson ? JSON.parse(value) : value;
	},
	/**
	 * [clearLocal 清除本地数据]
	 * @return {[type]} [description]
	 */
	clearLocal:function(){
		localStorage.clear();
	},
	/**
   * [serializeJson 将表单数据序列化为json]
   * @param  {[type]} formObj [需要序列化为json的form表单]
   * @return {[type]}                [description]
   */
  serializeJson:function(formObj){
    var serializeObj= {},serializeArray = $(formObj).serializeArray();  
    $.each(serializeArray, function() {  
       if (serializeObj[this.name]) {  
           if (!serializeObj[this.name].push) {  
               serializeObj[this.name] = [serializeObj[this.name]];  
           }  
           serializeObj[this.name].push(this.value || '');  
       } else {  
           serializeObj[this.name] = this.value || '';  
       }  
    });  
    return serializeObj;  
  }
};
