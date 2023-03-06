/**
 * This module covers the fields initialization process.
 */
import addRecordActionHelpers from "./helpers/actions/record.js"
import addScaffoldActionHelpers from "./helpers/actions/scaffold.js"
import addFormHelpers from "./helpers/forms.js"
import U from "./utils.js"

/**
 * The `postInitScaffold` function takes a scaffold element and applies the
 * initialization processes that require the fields to exist.
 *
 * @return a configured scaffold object
 */
function fieldsInitScaffold(scaffold) {
  /* set state to indicate fieldsInitScaffold has started */
  scaffold.state = 1

  /* should have scaffold.fields, so first apply defaults */
  U.applyFieldDefaults(scaffold.fields)

  /* build the headers (+ actions) */
  var tr = document.createElement("tr")
  for (var i = 0; i < scaffold.fields.length; i++) {
    if (scaffold.fields[i].on_table) {
      var h = document.createElement("th")
      h.innerHTML = scaffold.fields[i].title || scaffold.fields[i].name
      h.dataset.restScaffoldFieldName = scaffold.fields[i].name
      tr.appendChild(h)
    }
  }
  var h = document.createElement("th")
  h.innerHTML = scaffold.actionsLabel
  tr.appendChild(h)
  $(scaffold.headers).empty()
  scaffold.headers.appendChild(tr)

  /* set the column width of the footer row */
  var h = scaffold.getHeaderElements()
  scaffold.footer_count.parentElement.colSpan = h.length || 1

  addFormHelpers(scaffold)

  /* Build our forms. */
  scaffold.createForm = scaffold.buildForm({
    type: "create",
  })
  scaffold.updateForm = scaffold.buildForm({
    type: "update",
  })

  /* add action helpers */
  addRecordActionHelpers(scaffold)
  addScaffoldActionHelpers(scaffold)

  /* populate table, using the cache if we have cached values */
  scaffold.populate({ useCache: true })

  return scaffold
}

export default fieldsInitScaffold
