const { ipcRenderer } = require('electron')

const loadBtn = document.getElementById('loadBtn')
const closeBtn = document.getElementById('closeBtn')
var form

loadBtn.addEventListener('click', (event) => {
	ipcRenderer.send('load-file');
});

closeBtn.addEventListener('click', (event) => {
	document.getElementById('landing').style.display = "block";
	document.getElementById('formWrapper').style.display = "none";
	document.getElementById('navbar').style.display = "none";
	var formWrapper = document.getElementById('formWrapper')
	while (formWrapper.firstChild) formWrapper.removeChild(formWrapper.firstChild);
});

ipcRenderer.on('close', (event) => {
	closeBtn.click();
});

ipcRenderer.on('render-form', (event, _form) => {
	form = _form
	document.getElementById('landing').style.display = "none";
	document.getElementById('formWrapper').style.display = "block";
	document.getElementById('navbar').style.display = "block";
	document.getElementById('formTitle').innerHTML = form["title"]

	const htmlForm = document.createElement('form');
	form["fields"].forEach(field => {
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
		htmlForm.append(div);
	});
	const submitBtn = document.createElement('input')
	submitBtn.setAttribute('type', 'button')
	submitBtn.setAttribute('value', 'Submit')
	submitBtn.setAttribute('class', 'btn btn-outline-dark float-right')
	submitBtn.setAttribute('onclick', '_submit()')
	htmlForm.append(submitBtn);
	formWrapper.append(htmlForm);
})

function _submit() {
	var formValues = {};
	form["fields"].forEach(field => {
		id = field['id'];
		formValues[id] = document.getElementById(id).value;
	})
	ipcRenderer.send('submit-form', formValues);
}