// before require the lib, we should use npm install jquery --save;
const $                 = require('jquery');
const utils             = require('./javascript/lib/utils');
const { BrowserWindow } = require('electron').remote;
const IntroJs           = require('intro.js/intro');
const introPsth         = utils.createPath('index_intro.txt');

/**
 * [setIntro 引导函数]
 */
function setIntro(){
	IntroJs
		.introJs()
		.setOptions({
			exitOnOverlayClick : false,
			exitOnEsc: false
		})
		.start()
		.oncomplete(function(){
      skipOrDoneIntro();
    })
    .onexit(function() {
      skipOrDoneIntro();
    });;
}
function skipOrDoneIntro(){
  utils.writeFile(introPsth,'1');
}
if(utils.readFile(introPsth) != 1){
  setIntro();
}

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
		if($(this).attr('data-step') == 3){
			const sure = confirm('确认清除历史数据？');
			if(sure){
				const success = utils.emptyDir();
				if(success){
					utils.toastMsg('历史数据已经清空！');
					utils.clearLocal();
				}
			}
		}else{
			utils.writeFile(utils.createPath('config_intro.txt'),'');
			utils.writeFile(utils.createPath('lottery_intro.txt'),'');
			utils.toastMsg('您已经开启引导！');
		}
		
	}
	// 	var exec = require('child_process').exec;

	// 	function execute(command, callback){
	// 	    exec(command, function(error, stdout, stderr){ callback(stdout); });
	// 	};
	// 	let shell;
	// 	switch(process.platform){
	// 		case 'darwin':
	// 			shell = 'open /Users/qiaoni/lottery';
	// 		break;
	// 		case '':
	// 			shell = 'explorer c:';
	// 		break;
			
	// 	}
	// 	console.log(process.platform);
	// 	// call the function
	// 	execute('open /Users/qiaoni/lottery', function(output) {
	// 	    console.log(output);
	// 	});
	// }
	
});