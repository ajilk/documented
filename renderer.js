const { ipcRenderer } = require('electron')

const loadBtn = document.getElementById('loadBtn')
const cancelBtn = document.getElementById('cancelBtn')
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

cancelBtn.addEventListener('click', _close);

chooseTemplateBtn.addEventListener('change', () => {
	fileName = chooseTemplateBtn.value
	// extract filename from path
	document.getElementById('templateLabel').innerHTML = fileName.match(/\w+(?:\.\w+)*$/)[0];
});

ipcRenderer.on('file-saved', _close);

ipcRenderer.on('render: form', (event, _form) => {
	FORM = _form
	document.getElementById('landing').style.display = "none";
	document.getElementById('formWrapper').style.display = "block";
	document.getElementById('navbar').style.display = "block";
	document.getElementById('formName').innerHTML = FORM["name"]

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
	formWrapper.insertBefore(form, document.getElementById('cancelBtn'));
})

function _submit() {
	var values = {};
	FORM["fields"].forEach(field => {
		id = field['id'];
		values[id] = document.getElementById(id).value;
	})
	ipcRenderer.send('submit: form', values);
}

// to main page
function _close() {
	document.getElementById('landing').style.display = "block";
	document.getElementById('formWrapper').style.display = "none";
	document.getElementById('navbar').style.display = "none";
	var form = document.getElementById('form')
	while (form.firstChild) form.removeChild(form.firstChild);
	ipcRenderer.send('load: recentFiles');
}

function _removeForm(id) {
	ipcRenderer.send('remove: form', id);
	ipcRenderer.send('load: recentFiles');
}

function _openForm(id) {
	ipcRenderer.send('open: form', id);
}

function _viewExportOptions() {
	document.getElementById('landing').style.display = "none";
	document.getElementById('formWrapper').style.display = "none";
	document.getElementById('exportOptionsWrapper').style.display = "block";
	document.getElementById('toExportOptionsBtn').style.display = "none";
	document.getElementById('toFormBtn').style.display = "block";
}

function _viewForm() {
	document.getElementById('formWrapper').style.display = "block";
	document.getElementById('exportOptionsWrapper').style.display = "none";
	document.getElementById('toExportOptionsBtn').style.display = "block";
	document.getElementById('toFormBtn').style.display = "none";
}