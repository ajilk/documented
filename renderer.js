const { ipcRenderer } = require('electron')

const loadBtn = document.getElementById('loadBtn')
const cancelBtn = document.getElementById('cancelBtn')
const formatSelect = document.getElementById('formatSelect')
const chooseTemplateBtn = document.getElementById('chooseTemplateBtn')
let FORM

ipcRenderer.send('load: recentFiles');

ipcRenderer.on('render: recentFiles', (event, files) => {
	const recentFiles = document.getElementById('recentFiles')
	// re-render recentFiles by cleaning up first
	while (recentFiles.firstChild) recentFiles.removeChild(recentFiles.firstChild);
	for (file of files) {
		// This is bad but what choice do I have?
		const _file =
			`<li class="list-group-item py-2 recentForm">
				<div class="row justify-content-between px-2 py-0">
					<div class="col p-0" onclick="_openForm('${file['_id']}')">
						<h6 style="display: inline;">${file['name']}</h6>
						<small class="text-muted"> &mdash; ${file['path'].substring(0, 20).concat('...')}</small>
					</div>
					<button type="button" class="btn p-0 m-0" onclick="_removeForm('${file['_id']}')">
						<i class="fas fa-times"></i>
					</button>
				</div>
			</li>`
		recentFiles.insertAdjacentHTML('afterbegin', _file);
	}
});

loadBtn.addEventListener('click', (event) => {
	ipcRenderer.send('load: form');
});

cancelBtn.addEventListener('click', toLandingPage);

chooseTemplateBtn.addEventListener('change', () => {
	fileName = chooseTemplateBtn.value
	document.getElementById('templateLabel').innerHTML = fileName.match(/\w+(?:\.\w+)*$/)[0];
});

formatSelect.addEventListener('change', () => {
	// If md or tex
	if (formatSelect.value > 2) {
		console.log(formatSelect.value)
		document.getElementById('templateOption').style.display = 'block';
	}
	else
		document.getElementById('templateOption').style.display = 'none';
});

ipcRenderer.on('file-saved', toLandingPage);

ipcRenderer.on('render: form', (event, _form) => {
	FORM = _form
	toFormPage()

	const form = document.getElementById('form');
	FORM["fields"].forEach(field => {
		const formGroup = document.createElement('div');
		formGroup.setAttribute('class', 'form-group')
		if (field['label']) {
			const label = document.createElement('label');
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
})

function _submit() {
	var values = {};
	FORM["fields"].forEach(field => {
		id = field['id'];
		values[id] = document.getElementById(id).value;
	})
	ipcRenderer.send('submit: form', values);
}


function _removeForm(id) {
	ipcRenderer.send('remove: form', id);
	ipcRenderer.send('load: recentFiles');
}

function _openForm(id) {
	ipcRenderer.send('open: form', id);
}

function toLandingPage() {
	document.getElementById('navbar').style.display = "none";
	document.getElementById('footer').style.display = "none";
	document.getElementById('exportOptionsWrapper').style.display = "none";

	document.getElementById('landingPage').style.display = "block";
	document.getElementById('formWrapper').style.display = "none";

	var form = document.getElementById('form')
	while (form.firstChild) form.removeChild(form.firstChild);
	ipcRenderer.send('load: recentFiles');
}

function toExportOptionsPage() {
	document.getElementById('navbar').style.display = "block";
	document.getElementById('footer').style.display = "block";
	document.getElementById('exportOptionsWrapper').style.display = "block";
	document.getElementById('toFormBtn').style.display = "block";
	document.getElementById('documentBtn').style.display = "block";

	document.getElementById('landingPage').style.display = "none";
	document.getElementById('formName').innerHTML = FORM["name"]
	document.getElementById('formWrapper').style.display = "none";
	document.getElementById('cancelBtn').style.display = "none";
	document.getElementById('toExportOptionsBtn').style.display = "none";
}

function toFormPage() {
	document.getElementById('formWrapper').style.display = "block";
	document.getElementById('cancelBtn').style.display = "block";
	document.getElementById('toExportOptionsBtn').style.display = "block";
	document.getElementById('navbar').style.display = "block";
	document.getElementById('footer').style.display = "block";

	document.getElementById('landingPage').style.display = "none";
	document.getElementById('formName').innerHTML = FORM["name"]
	document.getElementById('exportOptionsWrapper').style.display = "none";
	document.getElementById('toFormBtn').style.display = "none";
	document.getElementById('documentBtn').style.display = "none";
}