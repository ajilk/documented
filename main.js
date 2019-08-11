const { app, BrowserWindow, ipcMain, dialog } = require('electron');
yaml = require('js-yaml');
fs = require('fs');
ejs = require('ejs');

let DEBUG = true
let mainWindow;

// Create the browser window
function createWindow() {
	mainWindow = new BrowserWindow({
		x: 100,
		y: 80,
		width: 500,
		height: 800,
		fullscreenable: false,
		resizable: false,
		darkTheme: true,
		webPreferences: {
			nodeIntegration: true
		}
	});
	if (DEBUG) mainWindow.webContents.openDevTools()

	mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => mainWindow.restore());

ipcMain.on('load-form', (event) => {
	dialog.showOpenDialog(mainWindow, {
		properties: ['openFile', 'multiSelections'],
		defaultPath: __dirname,
		filters: [{ name: 'Markdown', extensions: ['yml', 'yaml'] }]
	}).then(result => {
		if (!result.canceled) {
			formFile = result.filePaths[0]
			form = yaml.safeLoad(fs.readFileSync(formFile, 'utf8'));
			event.sender.send('render-form', form);
		}
	}).catch(error => console.log(error));
});

ipcMain.on('submit-form', (event, values) => {
	// Render then save
	ejs.renderFile('newUser.md', values).then(result => {
		dialog.showSaveDialog(mainWindow, {
			title: "Save",
			defaultPath: __dirname + '/newUser_FILLED.md',
		}, (filename) => {
			fs.writeFile(filename, result, (error) => {
				if (error) {
					switch (error.code) {
						case 'ENOENT': break; // Cancelled
						default: throw error;
					}
				} else {
					event.sender.send('file-saved', event)
				}
			})
		}).catch(error => console.log(error));
	});
});