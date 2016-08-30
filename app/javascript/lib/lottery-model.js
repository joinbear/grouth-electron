const fs    = require('fs-extra');
// before require the lib, we should use npm install jquery --save;
const $     = require('jquery');
const utils = require('./utils');

/**
 * [Lottery 抽奖构造函数]
 * @param {[type]} sourceName [数据源名称]
 */
function Lottery(sourceName){

	this.sourceName   = sourceName;
	this.timer        = '';
	this.counter      = 0;

}

/**
 * [readDataSource 读取数据源信息]
 * @return {[type]} [description]
 */
Lottery.prototype.readDataSource = function(){

	let sourceArray = utils.readFile(utils.createPath('data.txt'));
  return sourceArray.length > 0 ? JSON.parse(sourceArray) : [];

}

/**
 * [buildDataSource 构建数据源options]
 * @return {[type]} [description]
 */
Lottery.prototype.buildDataSource = function(){

	const source     = this.readDataSource();
	const sourceName = utils.getLocal('sourceName') || '选择抽奖名称';
	let options      = '<li><a href="#" value="">选择抽奖名称</a></li>';
	
	if( source.length > 0){
		options += source.map((element,index)=>{
			return `<li data-value="${element}"><a href="#">${element}</a></li>`;
		}).join('');
	}
	let tmp = `
		<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
	    ${sourceName}
	    <input type="hidden" value="${sourceName}" id="select-val" />
	    <span class="caret"></span>
	  </button>
	  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
	    ${options}
	  </ul>
	`
	return tmp;

}

/**
 * [init 初始化抽奖数据]
 * @return {[type]} [description]
 */
Lottery.prototype.init = function(sourceName){

	const data_obj = utils.readFile( utils.createPath(sourceName + '.txt') );
	const settings = utils.readFile( utils.createPath(sourceName + '-settings.txt') );
	utils.setLocal('sourceName',sourceName);
	utils.setLocal('settings',settings);
	utils.setLocal('data_obj',data_obj);

}

/**
 * [start 开始抽奖]
 * @return {[type]} [description]
 */
Lottery.prototype.start = function(){
	
	if( this.isFinish() ) return false;
	clearInterval(this.timer);
	const settings = this.getObjectByName('settings');
	let prizeArray = settings['prizeArray'];
	let id         = prizeArray[0]['id'];
	let prizeName  = prizeArray[0]['prizeName'];
	this.counter   = utils.getLocal('counter') || 0;
	// 判断奖项是否抽取完成
	if( this.counter >= prizeArray[0]['prizeNum'] ){
		prizeArray = utils.deleteElement(prizeArray,id,'id');
		settings['prizeArray'] = prizeArray;
		this.counter = 0;
		utils.setLocal('settings',settings,true);
		utils.setLocal('counter',this.counter);
		if(prizeArray.length > 0){
			utils.toastMsg(prizeName+'已经抽满,即将抽取'+prizeArray[0]['prizeName']);
		}else{
			utils.toastMsg(prizeName+'已经抽满,所有奖项抽取完毕！');
			utils.setLocal('isFinish',1);
			return false;
		}
	}
	//设置显示样式
	if(prizeArray[0]['prizePerson'] >= 10){
		$("#result_box").addClass('clearfix');
	}else if( prizeArray[0]['prizePerson'] == 5 ) {
		$("#result_box").removeClass('clearfix');
	}else{
		$("#result_box").removeAttr('style');
		$("#result_box").removeClass('clearfix');
	}
	//获取抽奖数据
	this.createWinner(prizeArray[0],settings.uniqueName,settings.prizeFields);


}

/**
 * [createWinner 创建中奖者视图]
 * @param  {[type]} prizeArray [配置参数数组]
 * @return {[type]}            [description]
 */
Lottery.prototype.createWinner = function(prizeArray,uniqueName,prizeFields){

	const data_obj    = this.getObjectByName('data_obj');
	const number      = data_obj.length;
	const _self       = this;
	this.buildResultList($("#result_box"),prizeArray);
	this.timer = setInterval(function(){
		let newArr = [] , newNo = [] , randomNo;
		let winnerArray = _self.getArrayByName('winnerArray');
		//产生抽奖名单
		for(let i = 0 ; i < prizeArray['prizePerson']; i++){
			randomNo        = utils.createRandom(1,number);
			let uniqueValue = data_obj[randomNo][uniqueName];
			//排除同一次抽到两个相同的人
			if($.inArray(randomNo,newArr) > -1 || $.inArray(uniqueValue,winnerArray) > -1 ){
				i--;
			}else{
				_self.buildResultDetail(i,randomNo,uniqueValue,prizeFields);
				newNo.push(uniqueValue);
				winnerArray.push(uniqueValue);
				newArr.push(randomNo);
			}
		}
	},16); //随机数据变换速度，越小变换的越快

	// 禁用开始按钮
	$("#start-btn").addClass('disabled').attr('disabled','disabled');

}
/**
 * [buildResultDetail 创建显示的内容]
 * @param  {[type]}   randomNo    [生成的随机数索引]
 * @param  {[type]}   uniqueValue [唯一值]
 * @param  {[type]}   prizeFields [展现作用域]
 * @return {[type]}       [description]
 */
Lottery.prototype.buildResultDetail = function(index,randomNo,uniqueValue,prizeFields){

	const data_obj = this.getObjectByName('data_obj');
	let   temp     = '<span>';
	let   len      = prizeFields.length;
	for( let i = 0 ; i < len ; i++){
		let field = prizeFields[i];
		if(i == len -1 ){
			temp     += data_obj[randomNo][field] + '';
		}else {
			temp     += data_obj[randomNo][field] + '-';
		}
	}
	temp +='</span>';
	$("#result_box").find('li').eq(index).html(temp).attr('data-id',data_obj[randomNo]['id']).attr('data-no',uniqueValue);

}

/**
 * [getArrayByName 获取本地数组数据]
 * @param  {[type]} name [数据名称]
 * @return {[type]}      [description]
 */
Lottery.prototype.getArrayByName = function(name) {

	const value  = utils.getLocal(name);
	return value == null ? [] : value.split(',');

}

/**
 * [getObjectByName 获取本地对象数据]
 * @param  {[type]} name [数据名称]
 * @return {[type]}      [description]
 */
Lottery.prototype.getObjectByName = function(name){

	return utils.getLocal(name,true) || {};

}
/**
 * [buildResultList 创建显示的li对象]
 * @param  {[type]} contentObj [父级对象]
 * @param  {[type]} settings   [配置信息]
 * @return {[type]}            [description]
 */
Lottery.prototype.buildResultList = function(contentObj,settings){
	const personNum = settings.prizePerson;
	var showHtml    = '';
	var fontSize;
	var className   = '';
	if(personNum < 1) return;
	switch( parseInt(personNum) ){
		case 1 :
			fontSize  = '50px';
			className = 'float-first'
		break;
		case 2:
		case 3:
		case 4:
			fontSize  = '48px';
		break;
		case 5:
			fontSize  = '36px';
		break;
		default:
			fontSize  = '24px';
			className = 'float-li';
		break;
	}
	for(var i = 0 ; i < personNum; i++){
		showHtml +="<li id='result"+i+"' class='"+className+"' style='font-size:"+fontSize+";'></li>";
	}
	$(contentObj).html(showHtml);
}

/**
 * [isFinish 是否抽奖完毕]
 * @return {Boolean} [description]
 */
Lottery.prototype.isFinish = function(){

	const isFinish = utils.getLocal('isFinish');
	if(isFinish){
		utils.toastMsg('所有奖项抽取完毕！');
		return true;
	}else{
		return false;
	}

}

/**
 * [stop 停止抽奖]
 * @return {[type]} [description]
 */
Lottery.prototype.stop = function(){


	if( this.isFinish() ) return false;
	this.counter++;
	clearInterval(this.timer);
	
	const winnerArray = this.getArrayByName('winnerArray');
	const winnerData  = this.getObjectByName('winnerData');
	const settings    = this.getObjectByName('settings');
	const uniqueName  = settings['uniqueName'];
	var data_obj      = this.getObjectByName('data_obj');
	const winnerName  = settings['prizeArray'][0]['prizeName'];
	const tmpArray    = winnerData[winnerName] || [];
	//获取停止后的抽奖人员信息
	$("#result_box").find('li').each(function(i){
		for(var j in data_obj){
			if( data_obj[j] && data_obj[j]['id'] == $(this).attr('data-id')){
				tmpArray.push(data_obj[j]);
				data_obj = utils.deleteElement(data_obj,data_obj[j]);
			}
		}
		winnerArray.push($(this).attr('data-no'));
	});
	winnerData[winnerName] = tmpArray;
	utils.setLocal('winnerData',winnerData,true);
	utils.setLocal('data_obj',data_obj,true);
	utils.setLocal('winnerArray',winnerArray);
	utils.setLocal('counter',this.counter);

	//启用开始按钮
	$("#start-btn").removeClass('disabled').removeAttr('disabled');

}

/**
 * [clear 重置抽奖数据]
 * @return {[type]} [description]
 */
Lottery.prototype.clear = function(){

	const sourceName = utils.getLocal('sourceName') || '';
	utils.clearLocal();
	utils.toastMsg('重置成功');
	if(sourceName) this.init(sourceName);

}

module.exports = Lottery;