const fs = require('fs');
// before require the lib, we should use npm install node-xlsx --save;
const xlsxParser = require('node-xlsx');
// before require the lib, we should use npm install jquery --save;
const $ = require('jquery');
const holder = document.getElementById('holder');
var importData = [];
holder.ondragover = () => {
  return false;
};
holder.ondragleave = holder.ondragend = () => {
  return false;
};
holder.ondrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  const dataList = xlsxParser.parse(file.path)[0]['data'][0];
  importData = xlsxParser.parse(file.path)[0]['data'];
  console.log(importData);
  const template = dataList.map((value,index)=>{
    return (`<a href="javascript:;" data-name="lotteryName${index}">${value}</a>`);
  }).join('');
  $("#tab-header").html(template);
  // console.log(dataList);
  console.log('File you dragged here is', file.path);
  return false;
};
const dataSave = [];
const dataContent = [];
$("#tab-header").on('click','a',function(event){
  let name = $(this).attr('data-name');
  let value = $(this).text();
  dataSave.push(name);
  dataContent.push({
    name : name,
    value : value
  });
  let temp = dataContent.map((element,index)=>{
    return (`<a href="javascript:;" data-name="${element.name}">${element.value}</a>`);
  }).join(',');
  settings['needKey'] = dataSave;
  $("#data-content").html(temp);
});
$("#make-sure").on('click',(event)=>{
  dealUserSettings(dataSave,importData);
});
const settings = {};
function dealUserSettings(dataSave,importData){
  const dealObject = [];
  for (let i = 0; i < importData.length - 1; i++) {
    let temp = importData[i];
    dealObject[i] = {};
    for(let j in temp ) {
      dealObject[i]['lotteryName' + j] = temp[j];
    }
  }
  writeFile('basic',dealObject);
}

function writeFile(name,data,callback) {
  fs.writeFile( process.cwd() + '/app/data/' + name + '.txt',JSON.stringify(data))
}