const { ipcRenderer } = require('electron')

const loadBtn = document.getElementById('loadBtn')
const cancelBtn = document.getElementById('cancelBtn')
let FORM

loadBtn.addEventListener('click', (event) => {
	ipcRenderer.send('load-form');
});

cancelBtn.addEventListener('click', _cancel);

ipcRenderer.on('file-saved', (event) => {
	cancelBtn.click();
});

ipcRenderer.on('render-form', (event, _form) => {
	FORM = _form
	document.getElementById('landing').style.display = "none";
	document.getElementById('formWrapper').style.display = "block";
	document.getElementById('navbar').style.display = "block";
	document.getElementById('formTitle').innerHTML = FORM["title"]

	const form = document.getElementById('form');
	FORM["fields"].forEach(field => {
		const formGroup = document.createElement('div');
		formGroup.setAttribute('class', 'form-group')
		if (field['label']) {
			const label = document.createElement('label');
			console.log(field['label'])
			label.setAttribute('for', field['id'])
			label.innerHTML = field['label'];
			formGroup.appendChild(label);
		}
		const input = document.createElement('input');
		input.setAttribute('class', 'form-control');
		input.setAttribute('id', field['id']);
		input.setAttribute('type', field['type']);
		if (field['placeholder'])
			input.setAttribute('placeholder', field['placeholder']);

		formGroup.appendChild(input);
		form.appendChild(formGroup);
	});
	formWrapper.insertBefore(form, document.getElementById('cancelBtn'));
})

function _submit() {
	var formValues = {};
	FORM["fields"].forEach(field => {
		id = field['id'];
		formValues[id] = document.getElementById(id).value;
	})
	ipcRenderer.send('submit-form', formValues);
}

function _cancel() {
	document.getElementById('landing').style.display = "block";
	document.getElementById('formWrapper').style.display = "none";
	document.getElementById('navbar').style.display = "none";
	var form = document.getElementById('form')
	while (form.firstChild) form.removeChild(form.firstChild);
}