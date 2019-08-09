const { app, BrowserWindow, ipcMain, dialog } = require('electron');
yaml = require('js-yaml');
fs = require('fs');
ejs = require('ejs');

let win;

// Create the browser window
function createWindow() {
	win = new BrowserWindow({
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
		if (file) {
			var form = loadForm(file[0]);
			event.sender.send('render-form', form);
		}
	});
});

ipcMain.on('form-submit', (event, values) => {
	ejs.renderFile('newUser.md', values, (err, str) => {
		if (err) console.log(err)
		// Todo: Write to specified location
		else fs.writeFile('newUser_filled.md', str, (err) => {
			if (err) throw err;
		});
	});
	event.sender.send('close')
});

function loadForm(filePath) {
	try {
		var fields = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
	} catch (e) {
		console.log(e);
	}
	return fields;
}