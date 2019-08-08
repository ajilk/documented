const { app, BrowserWindow, ipcMain, dialog} = require('electron');
yaml = require('js-yaml');
fs = require('fs');

// Create the browser window
function createWindow() {
	let win = new BrowserWindow({
		x: 100,
		y: 80,
		width: 500,
		height: 800,
		resizable: false,
		webPreferences: {
			nodeIntegration: true
		}
	});
	win.webContents.openDevTools()

	win.loadFile('index.html');

	win.on('closed', () => {
		console.log('[CLOSED]')
	});
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());

ipcMain.on('load-file', (event) => {
	dialog.showOpenDialog({
		properties: ['openFile']
	}, (file) => {
		if (file) event.sender.send('selected-file', file);
	});
});

ipcMain.on('load-fields', (event, arg) => {
	try {
		var fields = yaml.safeLoad(fs.readFileSync('./form.yml', 'utf8'));
	} catch (e) {
		console.log(e);
	}
	event.sender.send('render-fields', fields);
})