// before require the lib, we should use npm install jquery --save;
const $ = require('jquery');
const { BrowserWindow } = require('electron').remote;




$('.item').on('click', function(event) {
	event.preventDefault();
	let url = $(this).attr('data-url');
	let win = new BrowserWindow({width: 800, height: 600});
	win.loadURL(url);
	let webContents = win.webContents;
});