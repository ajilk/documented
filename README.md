# documented

document custom documents using custom fields

---

## Idea

Main process opens the form.yaml that specifies which fields to render.
Takes the form fields and sends it to the render to render the specified fields.

## Features

- [x] listView of imported forms
- [x] navbar for form title and actions - ex. load, submit, close form - fixed navbar - (load only form at a time, load -> close) - submit = enter (no submit button) -> opens dialog to ask save location
- [x] render obtained data in markdown
- [ ] md->pdf, tex->pdf render support
- [ ] export values/results to json, yaml
- [ ] create logo/icon
- [ ] implement recently opened files
- [ ] change close button to back button
- [ ] (longterm) use React Framework for routing and forms
- [ ] support for input validation
- [ ] optional labels
- [ ] support for form creation (from within the app rather than from a file)
- [ ] (longterm) modify form input locations (drag+drop style)
- [ ] (longterm) indicate that there is more to the form (ex. 2/10 fields completed) (green slim bar on top indicating how much more to go)
- [ ] 