/**
 * This module implements helper utilities for the entire project. We should
 * not import anything here to prevent circular imports.
 */

var uniqueId = 1000

function getUniqueId() {
  return uniqueId++
}

function addListLink(e, data, text) {
  var li = document.createElement("li")
  var a = document.createElement("a")
  var t = document.createTextNode(text)
  a.href = "#"
  a.setAttribute("data-rest-scaffold-" + data, "")
  a.appendChild(t)
  li.appendChild(a)
  e.appendChild(li)
}

/* change the state of the first spinner element */
function changeSpinner(element, state) {
  if (state == "show" || state == "display") {
    $($(element).find(".rest-scaffold-spinner")[0]).show()
  } else {
    $($(element).find(".rest-scaffold-spinner")[0]).hide()
  }
}

/* change the state of button elements */
function changeButtonState(element, state) {
  if (state == "disable") {
    $(element).find("input[type='submit']").prop("disabled", true)
    $(element).find("input[type='reset']").prop("disabled", true)
    $(element).find("button[type='submit']").prop("disabled", true)
    $(element).find("button[type='reset']").prop("disabled", true)
  } else {
    $(element).find("input[type='submit']").prop("disabled", false)
    $(element).find("input[type='reset']").prop("disabled", false)
    $(element).find("button[type='submit']").prop("disabled", false)
    $(element).find("button[type='reset']").prop("disabled", false)
  }
}

function getSelected(selectElement) {
  var options = selectElement.options
  var r = []
  for (var i = 0; i < options.length; i++) {
    if (options[i].selected) {
      r.push(options[i].value)
    }
  }
  return r
}

function setSelected(selectElement, selected) {
  var options = selectElement.options
  var r = []
  var j
  for (var i = 0; i < options.length; i++) {
    options[i].selected = false
    for (j = 0; j < selected.length; j++) {
      if (options[i].value == selected[j]) {
        options[i].selected = true
      }
    }
  }
  return r
}

function serializeForm(form) {
  var obj = {}
  var nodes = form.querySelectorAll("input,select,textarea")
  for (var i = 0; i < nodes.length; i++) {
    if (!nodes[i].tagName) {
      continue
    }
    var tg = nodes[i].tagName.toLowerCase()
    if (nodes[i].name) {
      if (nodes[i].type == "checkbox") {
        obj[nodes[i].name] = nodes[i].checked ? nodes[i].value : false
      } else if (tg == "select" && nodes[i].multiple) {
        obj[nodes[i].name] = getSelected(nodes[i])
      } else {
        obj[nodes[i].name] = nodes[i].value
      }
    }
  }
  return obj
}

function buildGenericFormBody(fields) {
  if (!fields) {
    return ""
  }
  var form = '<table class="rest-scaffold-page-table">\n'
  for (var i = 0; i < fields.length; i++) {
    if (fields[i].on_form && fields[i].html && fields[i].title && fields[i].id) {
      form +=
        '<tr><td><label for="' +
        fields[i].id +
        '">' +
        fields[i].title +
        ": </label></td><td>" +
        fields[i].html +
        "</td></tr>\n"
    }
  }
  return form + "</table>\n"
}

/**
 * This function takes a `type`, `name`, and `id`, and returns an HTML input
 * element with appropriate properties.
 */
function getField(type, name, id) {
  var t = "text"
  if (type === "number") {
    t = "number"
  } else if (type === "boolean") {
    t = "checkbox"
  }
  return '<input type="' + t + '" id="' + id + '" name="' + name + '">'
}

function applyFieldDefaults(fields) {
  var defaults = {
    on_table: true,
    on_form: true,
    on_detail: true,
  }
  for (var i = 0; i < fields.length; i++) {
    if (!fields[i].hasOwnProperty("title")) {
      fields[i].title = fields[i].name
    }
    for (var k in defaults) {
      if (!fields[i].hasOwnProperty(k)) {
        fields[i][k] = defaults[k]
      }
    }
  }
}

/**
 * This function figured out which scaffold (if any) an element is in, and
 * returns that scaffold.
 */
function getScaffold(el, scaffolds) {
  while (!el.dataset.restScaffold) {
    el = el.parentElement
  }
  var i
  for (var i = 0; i < scaffolds.length; i++) {
    if (scaffolds[i].rsDiv === el) {
      return scaffolds[i]
    }
  }
  return null
}

/**
 * This is a helper that destroys the Nth parent of the calling object. This is
 * mainly used for 'X' buttons but they are sometimes nested at different
 * depths, so they rely on this method to keep their logic simple.
 */
function closeNthParent(element, n) {
  if (!n) {
    n = 1
  }
  var p = element
  var c
  for (var i = 0; i < n; i++) {
    c = p
    p = p.parentElement
  }
  p.removeChild(c)
}

export default {
  getUniqueId: getUniqueId,
  addListLink: addListLink,
  changeSpinner: changeSpinner,
  changeButtonState: changeButtonState,
  getSelected: getSelected,
  setSelected: setSelected,
  serializeForm: serializeForm,
  buildGenericFormBody: buildGenericFormBody,
  getField: getField,
  applyFieldDefaults: applyFieldDefaults,
  getScaffold: getScaffold,
  closeNthParent: closeNthParent,
}
