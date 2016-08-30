const $                 = require('jquery');
const { BrowserWindow } = require('electron').remote;
const Lottery           = require('../javascript/lib/lottery-model');
const lottery           = new Lottery();

$(function(){

	// 选择抽奖数据源
	initDataSource();
	

	// 数据选择事件
	$("#select-data").on('click', 'li',function(event) {
		event.preventDefault();
		let dataSource = $(this).attr('data-value');
		if(dataSource && dataSource !='请选择抽奖名称'){
			lottery.init(dataSource);
			initDataSource();
			// hideToolBar();
		}else{
			alert('请选择抽奖名称');
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
		if( sure ) lottery.clear();
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
