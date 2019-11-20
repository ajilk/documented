// TODO: crazy refactoring
// TODO: flow illustration
// TODO: better channel naming

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const latex = require('node-latex');
const temp = require('temp'); temp.track();
DataStore = require('nedb')
yaml = require('js-yaml');
fs = require('fs');
ejs = require('ejs');

let DEBUG = false
let mainWindow;
const recentFiles = new DataStore({ filename: './userConfig', autoload: true });

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

ipcMain.on('load: recentFiles', (event) => {
	// Send over the ones that have valid path
	recentFiles.find({ path: { $exists: true } }, (err, recentFiles) => {
		event.sender.send('render: recentFiles', recentFiles)
	});
});

ipcMain.on('load: form', (event) => {
	dialog.showOpenDialog(mainWindow, {
		properties: ['openFile', 'multiSelections'],
		defaultPath: __dirname,
		filters: [{ name: 'Markdown', extensions: ['yml', 'yaml'] }]
	}).then(result => {
		if (!result.canceled) {
			formFilePath = result.filePaths[0]
			form = yaml.safeLoad(fs.readFileSync(formFilePath, 'utf8'));
			formName = form['name'];
			// Add to list if it is not on the list already
			recentFiles.find({ path: formFilePath }, (err, forms) => {
				if (forms == undefined || forms.length == 0)
					recentFiles.insert({ name: formName, path: formFilePath });
			});
			event.sender.send('render: form', form);
		}
	}).catch(error => console.log(error));
});


ipcMain.on('submit: form', (event, values) => {
	// Render then save
	ejs.renderFile('forms/newUser.tex', values).then(result => {
		stream = temp.createWriteStream();
		stream.write(result);
		const output = fs.createWriteStream('output.pdf');
		const pdf = latex(fs.createReadStream(stream.path));
		pdf.pipe(output)
		pdf.on('finish', () => console.log('PDF generated'));
		pdf.on('error', (error) => console.log(error));
		event.sender.send('file-saved', event)
	});
});

ipcMain.on('remove: form', (event, id) => {
	recentFiles.remove({ _id: id });
});

// Repeated Code
ipcMain.on('open: form', (event, id) => {
	recentFiles.find({ _id: id }, (error, form) => {
		const path = form[0]['path']
		const fields = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
		recentFiles.insert({ name: form['name'], path: form['path'] });
		event.sender.send('render: form', fields);
	});
});