
var uniqueId = 1000;

function getUniqueId() {
  return uniqueId++;
}

function addListLink(e, data, text) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  var t = document.createTextNode(text);
  a.href = '#';
  a.setAttribute('data-rest-scaffold-' + data, "");
  a.appendChild(t);
  li.appendChild(a);
  e.appendChild(li);
}

/* change the state of the first spinner element */
function changeSpinner(element, state) {
  if (state == 'show' || state == 'display') {
    $($(element).find('.rest-scaffold-spinner')[0]).show();
  } else {
    $($(element).find('.rest-scaffold-spinner')[0]).hide();
  }
}

/* change the state of button elements */
function changeButtonState(element, state) {
  if (state == 'disable') {
    $(element).find("input[type='submit']").prop('disabled', true);
    $(element).find("input[type='reset']").prop('disabled', true);
    $(element).find("button[type='submit']").prop('disabled', true);
    $(element).find("button[type='reset']").prop('disabled', true);
  } else {
    $(element).find("input[type='submit']").prop('disabled', false);
    $(element).find("input[type='reset']").prop('disabled', false);
    $(element).find("button[type='submit']").prop('disabled', false);
    $(element).find("button[type='reset']").prop('disabled', false);
  }
}

function getSelected(selectElement) {
  var options = selectElement.options;
  var r = [];
  var i;
  for (i=0; i<options.length; i++) {
    if (options[i].selected) {
      r.push(options[i].value);
    }
  }
  return r;
}

function setSelected(selectElement, selected) {
  var options = selectElement.options;
  var r = [];
  var i;
  var j;
  for (i=0; i<options.length; i++) {
    options[i].selected = false;
    for (j=0; j<selected.length; j++) {
      if (options[i].value == selected[j]) {
        options[i].selected = true;
      }
    }
  }
  return r;
}

function serializeForm(form) {
  var i;
  var j;
  var obj = {};
  var nodes = form.querySelectorAll('input,select,textarea');
  for (i=0; i<nodes.length; i++) {
    if (!nodes[i].tagName) { continue; }
    var tg = nodes[i].tagName.toLowerCase();
    if (nodes[i].name) {
      if (nodes[i].type == 'checkbox') {
        obj[nodes[i].name] = (nodes[i].checked ? nodes[i].value : false);
      } else if (tg == 'select' && nodes[i].multiple) {
        obj[nodes[i].name] = getSelected(nodes[i]);
      } else {
        obj[nodes[i].name] = nodes[i].value;
      }
    }
  }
  return obj;
}

function buildGenericFormBody(fields) {
  if (!fields) { return ''; }
  var form = '<table class="rest-scaffold-form-table">\n';
  var i;
  for (i=0; i<fields.length; i++) {
    if (fields[i].on_form && fields[i].html && fields[i].title && fields[i].id) {
      form += '<tr><td><label for="' + fields[i].id + '">' + fields[i].title
        + ': </label></td><td>' + fields[i].html + '</td></tr>\n';
    }
  }
  return form + '</table>\n';
}

function getField(type, name, id) {
  var t = "text";
  if (type === 'number') {
    t = "number";
  } else if (type === 'boolean') {
    t = "checkbox";
  }
  return '<input type="' + t + '" id="' + id + '" name="' + name + '">';
}

function applyFieldDefaults(fields) {
  var defaults = {
    "on_table": true,
    "on_form": true,
    "on_detail": true
  };
  var i;
  for (i=0; i<fields.length; i++) {
    if (!fields[i].hasOwnProperty("title")) {
      fields[i].title = fields[i].name;
    }
    for (var k in defaults) {
      if (!fields[i].hasOwnProperty(k)) {
        fields[i][k] = defaults[k];
      }
    }
  }
}

/* getting scaffold object from an element in a scaffold */
function getScaffold(e, scaffolds) {
  while (!e.dataset.restScaffold) { e = e.parentElement; }
  var i;
  for (i=0; i<scaffolds.length; i++) {
    if (scaffolds[i].rsDiv === e) { return scaffolds[i]; }
  }
  return null;
}

/* close nth parent container (n > 0) */
function closeNthParent(element, n) {
  if (!n) { n = 1; }
  var i;
  var p = element;
  var c;
  for (i=0; i<n; i++) {
    c = p;
    p = p.parentElement;
  }
  p.removeChild(c);
}


export default {
  'getUniqueId': getUniqueId,
  'addListLink': addListLink,
  'changeSpinner': changeSpinner,
  'changeButtonState': changeButtonState,
  'getSelected': getSelected,
  'setSelected': setSelected,
  'serializeForm': serializeForm,
  'buildGenericFormBody': buildGenericFormBody,
  'getField': getField,
  'applyFieldDefaults': applyFieldDefaults,
  'getScaffold': getScaffold,
  'closeNthParent': closeNthParent
};
