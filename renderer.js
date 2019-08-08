const { ipcRenderer } = require('electron')

const loadBtn = document.getElementById('loadBtn')

loadBtn.addEventListener('click', () => {
	ipcRenderer.send('load-fields', 'path/to/form.yml')
})

ipcRenderer.on('render-fields', (event, arg) => {
	const fields = arg;
	const body = document.querySelector('body');
	const form = document.createElement('form');
	form.setAttribute('class', 'p-5');
	fields.forEach(field => {
		const div = document.createElement('div');
		div.setAttribute('class', 'form-group')
		const label = document.createElement('label');
		label.setAttribute('for', field['id'])
		label.innerHTML = field['label'];
		const input = document.createElement('input');
		input.setAttribute('class', 'form-control');
		input.setAttribute('id', field['id']);
		input.setAttribute('type', field['type']);
		if (field['placeholder'])
			input.setAttribute('placeholder', field['placeholder']);
		div.append(label);
		div.append(input);
		form.append(div);
	});
	body.append(form);
})