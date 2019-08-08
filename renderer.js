const {ipcRenderer} = require('electron')

const loadBtn = document.getElementById('loadBtn')

loadBtn.addEventListener('click', () => {
	ipcRenderer.send('load-fields', 'path/to/form.yml')
})

ipcRenderer.on('render-fields', (event, arg) => {
	document.getElementById('fields').innerHTML = arg
})