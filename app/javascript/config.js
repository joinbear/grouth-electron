const fs         = require('fs-extra');
// before require the lib, we should use npm install node-xlsx --save;
const xlsxParser = require('node-xlsx');
// before require the lib, we should use npm install jquery --save;
const $          = require('jquery');
const IntroJs    = require('intro.js/intro');
const holder     = document.getElementById('holder');
// the file  is resolved relative to index.html
const utils      = require('../javascript/lib/utils');
const Prize      = require('../javascript/lib/config-model');
const remote     = require('electron').remote;
const prize      = new Prize();
const introPsth  = utils.createPath('config_intro.txt');
var   filePath   = '';
var chooseFields = [];
var params       = [];
var uniqueName   = '';


function setIntro(){
  IntroJs.introJs()
    .setOptions({
        exitOnOverlayClick : false,
        exitOnEsc: false,
        steps: [
          { 
            intro: "即将开启使用教程引导，请根据引导进行操作，点击next开始引导之旅"
          },
          {
            element: '#data-name',
            intro: "请输入用于抽奖的名称"
          },
          {
            element: '#step2',
            intro: "请导入抽奖用的excel数据",
          },
          {
            element: '#step3',
            intro: '请选择用于抽奖的字段',
          },
          {
            element: '#step4',
            intro: "选择唯一性字段，可选",
          },
          {
            element: '#step5',
            intro: '请配置抽奖的相关信息，奖项采用新增先抽的原则;一次可以配置多个奖项信息(注意：单次最大的人数为10人)',
            position: 'right'
          },
          {
            element: '#config-table',
            intro: '可以删除配置错误的奖项',
            position: 'right'
          },
          {
            intro: '保存前请确认配置信息是否有误，保存关闭后，数据将不可修改，可以通过清空历史数据删除配置选项,点击done结束引导，在主界面可以再次开启引导教程',
          }
        ]
    })
    .start()
    .oncomplete(function(){
      storageIntro();
    })
    .onexit(function() {
      storageIntro();
    });
}
function storageIntro(){
  utils.writeFile(introPsth,'1');
}
if(utils.readFile(introPsth) != 1){
  setIntro();
}
// 拖拽事件
holder.ondragover = () => {
  return false;
};
holder.ondragleave = holder.ondragend = () => {
  return false;
};
holder.ondrop = (e) => {
  e.preventDefault();
  filePath = e.dataTransfer.files[0].path;
  prize.handleFields(filePath);
  holder.innerHTML = '<span class="success">数据导入成功</span>';
  // console.log('File you dragged here is', filePath);
  return false;
};
// 文件上传事件
$("#upload").on('change',function(event){
  filePath = event.target.files[0].path;
  prize.handleFields(filePath);
  holder.innerHTML = '<span class="success">数据导入成功</span>';
  // console.log('your choose file is', filePath);
  return false;
});

// 选择展现字段
$("#tab-header").on('click','a',function(event){

  let name  = $(this).attr('data-name');
  let value = $(this).text();
  $(this).toggleClass('current');
  if(utils.objectInArray(chooseFields,name,'name') ){
    chooseFields = utils.deleteElement(chooseFields,name,'name');
    params       = utils.deleteElement(params,name);
  }else{
   chooseFields.push({
      name : name,
      value : value
    });
    params.push(name);
  }
  
  let temp = chooseFields.map((element,index)=>{
    return (`<a class="alert-success" href="javascript:;" data-name="${element.name}">${element.value}</a>`);
  });
  prize.addFields(params);
  $("#data-content").html(temp);
  $(".data-content").show();

});
// 设置唯一字段
$("#data-content").on('click', 'a', function(event) {

  event.preventDefault();
  var links  = $("#data-content").find('a');
  var text   = $(this).text(); 
  uniqueName = $(this).attr('data-name');
  links.removeClass('current');
  $(this).addClass('current');
  prize.addUinqueName(uniqueName);

});
// 配置奖项
$("#savePrizeConfig").on('click',(event)=>{

  const isValidate = utils.validate($("#prizeForm .form-control"));
  if(isValidate){
    const formObj   = utils.serializeJson( $("#prizeForm") );
    const prizeView = prize.buildSettings(formObj);
    $("#configTbody").html(prizeView);
    $("#config-table").show();
  }

});

$("#configTbody").on('click', '.btn', function(event) {

  event.preventDefault();
  const id = $(this).attr('data-id');
  const prizeView = prize.deleteSettings(id);
  $("#configTbody").html(prizeView);

});

// 清空奖项配置内容
$("#clearPrizeConfig").on('click',(event)=>{

  const sure = confirm('确定清空奖项配置信息');
  if(sure){
    $("#prizeForm")[0].reset();
    return false;
  }
  
});

// 保存并且关闭
$("#make-sure").on('click',(event)=>{

  checkValidate() 
  
});
// 保存并且新增
$("#make-more").on('click',(event)=>{

  windowAction('close');

});
function windowAction(type){
  let window = remote.getCurrentWindow();
  window.close();
  // setTimeout(function(){
  //   switch(type){
  //     case 'close':
  //       window.close();
  //     break;
  //     case 'reload':
  //       window.reload();
  //     break;
  //   }
  // },1500);
}
function checkValidate() {
  const name = $("#data-name").val();
  if(name == ''){
    utils.toastMsg('请输入配置名称','danger');
    return false;
  }
  if(prize.excelData.length == 0){
    utils.toastMsg('请导入数据','danger');
    return false;
  }
  if(prize.settings['prizeFields'].length == 0){
    utils.toastMsg('请选择用于抽奖的字段');
    return false;
  }
  if(prize.settings['prizeArray'].length == 0){
    utils.toastMsg('请配置奖项信息','danger');
    return false;
  }
  prize.saveConfig(name);
  return true;
}