const fs   = require('fs-extra');
// before require the lib, we should use npm install jquery --save;
const $    = require('jquery');
const util = require('./utils');

function Prize() {
	this.excelData = [];
	this.settings  = {
		// 奖项索引
	  prizeIndex : 0,
	  // 奖项信息
	  prizeArray : [],
	  // 抽奖字段
	  prizeFields : [],
	  // 抽奖主键（唯一，若不设置，默认为id）
	  uniqueName : 'id',
	}
}
/**
 * [读取数据源配置文件]
 * @return {[type]} [description]
 */
Prize.prototype.readDataSource = function(){
	return util.readFile(util.createPath('data.txt'));
}
/**
 * [写入数据源]
 * @param  {[type]} data [数据源数据]
 * @return {[type]}      [description]
 */
Prize.prototype.writeDataSource = function(data){
	return util.writeFile(util.createPath('data.txt'), JSON.stringify(data) );
}

/**
 * [处理多数据源]
 * @param  {[type]} sourceName [数据源名称]
 * @return {[type]}            [description]
 */
Prize.prototype.handleDataSource = function(sourceName){
	let sourceArray = this.readDataSource();
	sourceArray     = sourceArray.length > 0 ? JSON.parse(sourceArray) : [];
  if($.inArray(sourceName, sourceArray) == -1 ){
  	sourceArray.push(sourceName);
    this.writeDataSource(sourceArray);
  }
}

/**
 * [处理展现字段]
 * @param  {[type]} filePath [数据源路径]
 * @return {[type]}          [description]
 */
Prize.prototype.handleFields  = function(filePath){
	this.excelData     = util.parseXlsx(filePath)[0]['data'];
	const headerFields = this.excelData[0];
	const template     = headerFields.map((value,index)=>{
    return (`<a class="alert-success" href="javascript:;" data-name="Name${index + 1}">${value}</a>`);
  }).join('');
  $("#tab-header").html(template);
  $(".data-intro").show();
  return false;
}

/**
 * [存储抽奖数据]
 * @param  {[type]} fileName [数据源路径]
 * @return {[type]}          [description]
 */
Prize.prototype.saveExcelData = function(fileName){
	const dataArray = [];
	const data      = this.excelData;
  for (let i = 1 , len = data.length  ; i < len ; i++) {
    let temp = data[i];
		if(temp.length > 0){
      dataArray[i-1]       = {};
      dataArray[i-1]['id'] = i;
      for(let j = 0; j < temp.length ; j++ ) {
        dataArray[i-1]['Name' + parseInt(j + 1 )] = temp[j] || '';
      }
    }
  }
  const success = util.writeFile( util.createPath(fileName + '.txt'), JSON.stringify(dataArray) , true );
  if(success){
  	utils.toastMsg('保存成功');
  }
}

/**
 * [保存奖项配置信息]
 * @param  {[type]} fileName [数据源名称]
 * @return {[type]}          [description]
 */
Prize.prototype.saveSettings = function(fileName){
	util.writeFile( util.createPath(fileName + '-settings.txt'), JSON.stringify(this.settings) );
}

/**
 * [展现数据内容]
 * @param  {[type]} prizeConfig [§description]
 * @return {[type]}             [description]
 */
Prize.prototype.buildSettings = function(prizeConfig){
	var settings      = this.settings;
	prizeConfig['id'] = settings.prizeIndex;
  settings.prizeIndex++;
  settings.prizeArray.push(prizeConfig);
  return this.buildSettingsView();
}
Prize.prototype.deleteSettings = function(id){
	var settings        = this.settings;
	settings.prizeArray = utils.deleteElement(settings.prizeArray,id,'id');
	return this.buildSettingsView();
}
Prize.prototype.buildSettingsView = function(){
	let temp =  this.settings.prizeArray.map((element,index)=>{
    return (`
      <tr>
        <td>${element.prizeName}</td>
        <td>${element.prizePerson}</td>
        <td>${element.prizeNum}</td>
        <td><button data-id="${element.id}" class="btn btn-default">删除</button></td>
      </tr> 
    `);
  });
  return temp;
}

/**
 * [抽奖字段添加]
 * @param  {[type]} fields [array 用于抽奖的字段]
 * @return {[type]}        [description]
 */
Prize.prototype.addFields = function(fields){
	this.settings.prizeFields = fields;
}
Prize.prototype.addUinqueName = function(name){
	this.settings.uniqueName = name;
}
/**
 * [保存整个抽奖配置]
 * @param  {[type]} fileName [配置文件]
 * @return {[type]}          [description]
 */
Prize.prototype.saveConfig = function(fileName){
  this.saveSettings(fileName);
  this.handleDataSource(fileName);
  this.saveExcelData(fileName);
}

module.exports = Prize;