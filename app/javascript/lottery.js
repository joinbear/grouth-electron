const $                 = require('jquery');
const { BrowserWindow } = require('electron').remote;
const Lottery           = require('../javascript/lib/lottery-model');
const utils             = require('../javascript/lib/utils');
const IntroJs           = require('intro.js/intro');
const introPsth         = utils.createPath('lottery_intro.txt');
const lottery           = new Lottery();

$(function(){



		function setIntro(){
	  	IntroJs
	  	.introJs()
	    .setOptions({
	        steps: [
		        { 
	            intro: "即将开启使用教程引导，请根据引导进行操作，点击next开始引导之旅"
	          },
	          {
	            element: '#select-data',
	            intro: "选择你配置好的抽奖信息",
	            position: 'top'
	          },
	          {
	            element: '#start-btn',
	            intro: "选择好抽奖数据后点击开始或者按下空格键即开始摇奖",
	            position: 'top'
	          },
	          {
	            element: '#stop-btn',
	            intro: '点击停止或者回车键即可停止摇奖',
	            position: 'top'
	          },
	          {
	            element: '#js-lookup-detail',
	            intro: "抽奖完毕，可以点击查看所有抽奖明细",
	            position: 'top'
	          },
	          {
	            element: '#js-clear-data',
	            intro: "点击该按钮可以将数据重置为初始状态",
	            position: 'top'
	          },
	          {
	            element: '#js-hide-box',
	            intro: "可以点击该按钮，隐藏操作栏",
	            position: 'top'
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
	  //setIntro();
	}

	// 选择抽奖数据源
	initDataSource();
	

	// 数据选择事件
	$("#select-data").on('click', 'li',function(event) {
		event.preventDefault();
		let dataSource = $(this).attr('data-value');
		if(dataSource && dataSource !='请选择抽奖名称'){
			lottery.init(dataSource);
			initDataSource();
			//hideToolBar();
		}else{
			utils.toastMsg('请选择抽奖名称');
			$("#prize-title").html("");
			$(".content").attr("css","");
		}
		$("#select-data").removeClass('dropup')
	});
	// 显示下拉框
	$("#select-data").on('click', 'button',function(event) {
		event.preventDefault();
		$("#select-data").addClass('dropup');
	});

	// 开始抽奖
	$("#start-btn").on('click',function(){
		lottery.start();
	});

	//停止抽奖
	$("#stop-btn").on('click',function(){
		lottery.stop();
	});

	//重置数据
	$("#js-clear-data").on('click',function(event){
		const sure = confirm('确认重置数据？');
		if( sure ) {
			lottery.clear();
			$(this).blur();
			$("#result_box").html("");
		}
	});
	$("#add-prize").on("click",function(){
		var settings =  JSON.parse(utils.getLocal("settings"));
		const isValidate = utils.validate($("#prizeForm .form-control"));
		if(isValidate){
		    const formObj = utils.serializeJson( $("#prizeForm") );
		    formObj['id'] = settings.prizeIndex
		    settings.prizeArray.push(formObj);
		    settings.prizeIndex = settings.prizeIndex + 1;
		    utils.setLocal("settings",JSON.stringify(settings));
		    utils.removeLocal('isFinish');
		    utils.toastMsg('新增成功！','danger');
			$("#prizeForm")[0].reset();
			$(".config").hide();
		}
		
	})
	$("#hide-add-box").on('click',function(){
		$(".config").hide();
	});
	$("#reset").on('click',function(){
		$("#prizeForm")[0].reset();
	});
	$("#js-add").on('click',function(){
		$(".config").show();
	});
	// 绑定空格和回车事件
	$(document).keydown(function(event){
		switch(event.which){
			case 32:
				lottery.start();
			break;
			case 13:
				lottery.stop();
			break;
			default:
			break;
		} 
	});
	// 查看中奖名单
	$("#js-lookup-detail").on('click',function(){
		var url = $(this).attr('data-url');
		let win = new BrowserWindow({width: 1024, height: 768 , fullscreen : false});
		win.loadURL(`file://${__dirname}/`+url);
		let webContents = win.webContents;
		// webContents.openDevTools();
	});
	// 显示操作栏
	$(".arrow").click(function(){

		$(this).addClass('none');
		$(".float-box").animate({
			'left':'50%'
		},1000);

	});

	// 隐藏操作栏
	$("#js-hide-box").click(hideToolBar);

	function initDataSource() {
		$("#select-data").html(lottery.buildDataSource());
	}
	/**
	 * [hideToolBar 隐藏操作栏]
	 * @return {[type]} [description]
	 */
	function hideToolBar(){
		$(".float-box").animate({
			'left':'-450px'
		},1000,function(){
			$('.arrow').removeClass('none');
		});
	}
});
