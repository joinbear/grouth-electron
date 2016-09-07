// before require the lib, we should use npm install jquery --save;
const $                 = require('jquery');
const utils             = require('./javascript/lib/utils');
const { BrowserWindow } = require('electron').remote;


$('.item').on('click', function(event) {

	event.preventDefault();
	let url = $(this).attr('data-url');
	if(url){
		let win = new BrowserWindow({width: 1024, height: 768 , fullscreen : false});
		win.loadURL(`file://${__dirname}/`+url);
		let webContents = win.webContents;
		if(utils.debug){
			webContents.openDevTools();
		}
	}else{
		const sure = confirm('确认清除历史数据？');
		if(sure){
			const success = utils.emptyDir();
			if(success){
				utils.toastMsg('历史数据已经清空！');
				utils.clearLocal();
			}
		}
	}
	
});