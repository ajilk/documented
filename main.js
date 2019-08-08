const { app, BrowserWindow, ipcMain } = require('electron');

// Create the browser window
function createWindow() {
	let win = new BrowserWindow({
		width: 500,
		height: 800,
		resizable: false,
		webPreferences: { nodeIntegration: true }
	})

	win.loadFile('index.html')

	win.on('closed', () => {
		console.log('[CLOSED]')
	})
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit())

ipcMain.on('load-fields', (event, arg) => {
	event.sender.send('render-fields', `fields from ${arg}`)
})