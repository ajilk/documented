const { app, BrowserWindow, ipcMain, dialog } = require('electron');
yaml = require('js-yaml');
fs = require('fs');
ejs = require('ejs');

let DEBUG = true
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
	if (DEBUG) win.webContents.openDevTools()

	win.loadFile('index.html');

	win.on('closed', () => {
		console.log('[CLOSED]')
	});
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());

ipcMain.on('load-file', (event) => {
	dialog.showOpenDialog({
		properties: ['openFile'],
		defaultPath: __dirname
	}, (file) => {
		if (file) {
			var form = loadForm(file[0]);
			event.sender.send('render-form', form);
		}
	});
});

ipcMain.on('submit-form', (event, values) => {
	ejs.renderFile('newUser.md', values, (err, str) => {
		if (err) console.log(err)
		else {
			const options = {
				title: "Save",
				defaultPath: __dirname + '/newUser_FILLED.md',
				filters: [{ extensions: ['md'] }]
			}
			dialog.showSaveDialog(options, (filename) => {
				fs.writeFile(filename, str, (err) => {
					if (err) throw err;
				});
				event.sender.send('close')
			});
		}
	});
});

function loadForm(filePath) {
	try {
		var fields = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
	} catch (e) {
		console.log(e);
	}
	return fields;
}