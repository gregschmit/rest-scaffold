"use strict";
/*
 * restScaffold: A library for rendering tables from REST APIs and providing
 *  the basic CRUD operations.
 * Copyright 2018, Gregory N. Schmit
 * MIT Licensed
 */


(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function (jquery) {
      return (root.restScaffold = factory(jquery));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    root.restScaffold = factory(root.$);
  }
}(typeof self !== 'undefined' ? self : this, function ($) {

  /*****************************************
   * Environment Init and Helper Functions *
   *****************************************/

  var scaffolds = [];
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
  function getScaffold(e) {
    while (!e.dataset.restScaffold) { e = e.parentElement; }
    var i;
    for (i=0; i<scaffolds.length; i++) {
      if (scaffolds[i].rsDiv === e) { return scaffolds[i]; }
    }
  }

  /**********************************************
   * Scaffold Initialization and Object Methods *
   **********************************************/

  function initScaffold(rsDiv, index, args) {
    /* build scaffold object and try to populate */

    /* build scaffold object */
    var scaffold = {};
    scaffold.index = index;
    scaffold.state = 0;
    scaffold.rsDiv = rsDiv;
    scaffold.pag = {
      "count": undefined,
      "displayCount": 1,
      "pageSize": 1,
      "currentPage": 1,
      "getTotal": function() { return this.count || this.displayCount; },
      "getOffset": function(page) { return this.pageSize*(page-1); },
      "getMaxPage": function() { return (~~((this.getTotal()-1)/this.pageSize) + 1) || 1; }
    };
    rsDiv = $(rsDiv);

    /* load args into scaffold with sensible defaults */
    scaffold.csrfToken = args.csrfToken || '';
    scaffold.debug = args.debug || true;
    scaffold.fields = args.fields || null;
    scaffold.pkField = args.pkField || 'id';
    scaffold.rawCreateForm = args.createForm || args.addForm || null;
    scaffold.rawUpdateForm = args.updateForm || args.editForm || null;
    scaffold.recordTitle = args.recordTitle || 'Record';

    /* build data cache */
    scaffold.cache = {
      'records': {},
      'lastListing': null
    };
    console.log(scaffold.cache.records);

    /* fill scaffold */
    rsDiv.empty();
    rsDiv.html('<div class="rest-scaffold-topbar"> \
        <span class="rest-scaffold-head"></span> \
        <sub class="rest-scaffold-secondary"></sub> \
        <ul class="rest-scaffold-menu"> \
          <li><span class="rest-scaffold-spinner"></span></li>\
        </ul> \
      </div> \
      <table> \
        <tbody class="rest-scaffold-messages"></tbody> \
      </table> \
      <table> \
        <thead class="rest-scaffold-headers"></thead> \
        <tbody class="rest-scaffold-records"></tbody> \
        <tfoot class="rest-scaffold-footer"><tr><td> \
          <span class="rest-scaffold-count"></span> \
          <span class="rest-scaffold-pages"></span> \
        </td></tr></tbody> \
      </table>');

    /* helpers for getting elements */
    scaffold.headers = rsDiv.find('.rest-scaffold-headers')[0];
    scaffold.menu = rsDiv.find('.rest-scaffold-menu')[0];
    scaffold.spinner = $(scaffold.menu).find('.rest-scaffold-spinner')[0];
    scaffold.topbar = rsDiv.find('.rest-scaffold-topbar')[0];
    scaffold.messages = rsDiv.find('.rest-scaffold-messages')[0];
    scaffold.records = rsDiv.find('.rest-scaffold-records')[0];
    scaffold.footer = rsDiv.find('.rest-scaffold-footer')[0];
    scaffold.footer_count = rsDiv.find('.rest-scaffold-count')[0];
    scaffold.footer_pages = rsDiv.find('.rest-scaffold-pages')[0];
    scaffold.getRecordRows = function() {
      return scaffold.records.getElementsByTagName('tr');
    };
    scaffold.getHeaderElements = function() {
      return scaffold.headers.getElementsByTagName('th');
    };
    scaffold.getNumberOfHeaders = function() {
      return scaffold.getHeaderElements().length;
    };

    /* helper for disabling/enabling links */
    scaffold.changeLinkState = function(linkName, state) {
      var cls;
      if (linkName == 'update') {
        cls = '[data-rest-scaffold-render-update]';
      } else { /* create */
        cls = '[data-rest-scaffold-render-create]';
      }
      if (state == 'disable') {
        $(scaffold.menu).find(cls)[0].classList.add('rest-scaffold-link-disabled');
      } else { /* enable */
        $(scaffold.menu).find(cls)[0].classList.remove('rest-scaffold-link-disabled');
      }
    }

    /* helper for getting a row by the Pk */
    scaffold.getRowByPk = function(pk) {
      var i;
      var rows = scaffold.getRecordRows();
      for (i=0; i<rows.length; i++) {
        if (rows[i].dataset.restScaffoldPk == pk) {
          return rows[i];
        }
      }
      return null;
    }

    /* interface for pushing messages (error and info) */
    scaffold.pushMessage = function(args) {
      var r = scaffold.messages.insertRow(-1);
      r.className = "rest-scaffold-" + args.type;
      var c = r.insertCell(0);
      var h = scaffold.getHeaderElements();
      /*if (h) {
        c.colSpan = h.length || 1;
      } else {
        c.colSpan = 1;
      }*/
      var x = '<a href="#" data-rest-scaffold-close-message> X </a>';
      c.innerHTML = x;
      if (args.text) {
        c.appendChild(document.createTextNode(args.text));
      } else if (args.element) {
        c.appendChild(args.element);
      }
    };

    /* helper for throwing errors */
    scaffold.throwError = function(args) {
      $(scaffold.messages).empty();
      if (!scaffold.debug) {
        scaffold.pushMessage({"type": "error", "text": args.msg});
        return;
      }
      var p = document.createElement("pre");
      if (args.msg) {
        p.insertAdjacentHTML("afterbegin", args.msg);
      }
      if (args.e) {
        var nl;
        if (args.msg) { nl = "\n\n"; } else { nl = ''; }
        p.insertAdjacentHTML("beforeend", nl + "ERROR: " + args.e.toString()
          + "\n\nSTACK: " + args.e.stack
        );
      }
      if (args.dump) {
        p.insertAdjacentHTML("beforeend", "\n\nDUMP:\n");
        if (args.dump instanceof Object) {
          args.dump = JSON.stringify(args.dump);
        }
        var lines = args.dump.split("\n");
        var i;
        for (i=0; i<lines.length; i++) {
          p.appendChild(document.createTextNode(lines[i]));
          p.insertAdjacentHTML("beforeend", "\n");
        }
      }
      scaffold.pushMessage({"type": "error", "element": p});
    };

    /* if args is bad, throw error and exit */
    if (args.e) {
      scaffold.throwError({
        "msg": "Scaffold configuration is not valid JSON",
        "e": args.e,
        "dump": args.badargs
      });
      $(scaffold.spinner).hide();
      return scaffold;
    }

    /* show that we're loading things */
    $(scaffold.spinner).show();

    /* inject title/subtitle */
    rsDiv.find('.rest-scaffold-head').text(args.title);
    rsDiv.find('.rest-scaffold-secondary').text(args.subtitle);

    /* parse url */
    if (args.url) {
      scaffold.url = args.url;
    } else {
      scaffold.url = '/';
    }
    if (scaffold.url.slice(-1) !== '/') {
      scaffold.url = scaffold.url + '/';
    }

    /* inject scaffold refresh url */
    addListLink(scaffold.menu, 'refresh', 'Refresh');

    /* interface for AJAX */
    scaffold.ajax = function(args) {
      var target = scaffold.url;
      if (args.hasOwnProperty('pk')) {
        target += args.pk + '/';
      }
      if (args.page && args.page > 1) {
        var p = scaffold.pag.getOffset(args.page);
        target += '?offset=' + p;
      }
      var method = args.method || 'GET';
      if (args.useCache && scaffold.cache.lastListing) {
        args.success(scaffold.cache.lastListing, 0, 0);
        return;
      }
      var opts = {
        "method": method,
        "contentType": 'application/json',
        "headers": {
          "X-CSRFToken": scaffold.csrfToken
        },
        "success": [function(data, status, xhr) {
          /* if it's a listing, cache it */
          var pkField = scaffold.pkField;
          if (!args.hasOwnProperty('pk') && method == 'GET') {
            scaffold.cache.lastListing = data;
            var i;
            for (i=0; i<data.results.length; i++) {
              scaffold.cache.records[data.results[i][pkField]] = {
                record: data.results[i],
                detail: false
              };
            }
          } else if (args.hasOwnProperty('pk') && method == 'GET') {
            scaffold.cache.records[data[pkField]] = {
              record: data,
              detail: true
            }
          }
        }, args.success],
        "complete": [function() {
          $(scaffold.spinner).hide();
        }, args.complete],
        "error": [function(xhr, status, error) {
          scaffold.throwError({
            "msg": "Request failed; status " + xhr.status + '(' + status + ')',
            "dump": xhr.responseText
          });
        }, args.error]
      };
      if (args.payload) {
        if (!args.method) { opts.method = 'POST'; }
        opts.data = JSON.stringify(args.payload);
      }
      $.ajax(target, opts);
    }

    /* interface for pushing a record to the table */
    scaffold.pushRecord = function(content) {
      var r = scaffold.records.insertRow(-1);
      var i;
      var h = scaffold.getHeaderElements();
      for (i=0; i<h.length-1; i++) { /* for each header */
        /* get the name of the field */
        if (h[i].hasAttribute("data-rest-scaffold-field-name")) {
          var name = h[i].dataset.restScaffoldFieldName;
        } else {
          var name = h[i].textContent;
        }
        /* then get the value from content, if it exists */
        var v = content[name];
        if (typeof v === 'undefined') { v = ''; }
        /* push the cell */
        var c = r.insertCell(i);
        c.innerHTML = v;
      }
      /* store meta-data for actions, such as the id of the resource */
      if (content[scaffold.pkField]) {
        r.dataset.restScaffoldPk = content[scaffold.pkField];
        /* TODO: then push actions */
        var c = r.insertCell(h.length-1);
        var a = '<ul class="rest-scaffold-menu">';
        a += '<li><span class="rest-scaffold-spinner" style="display: none"></span></li>';
        if (scaffold.updateForm) {
          a += '<li><a href="#" data-rest-scaffold-render-update>Update</a></li>';
        }
        a += '<li><a href="#" data-rest-scaffold-delete>Delete</a></li>';
        a += '</ul>';
        c.innerHTML = a;
      }
    };

    /* interface for updating a row on the table */
    scaffold.updateRow = function(content, row) {
      var i;
      var h = scaffold.getHeaderElements();
      var c = row.cells;
      for (i=0; i<h.length-1; i++) { /* for each header */
        /* get the name of the field */
        if (h[i].hasAttribute("data-rest-scaffold-field-name")) {
          var name = h[i].dataset.restScaffoldFieldName;
        } else {
          var name = h[i].textContent;
        }
        /* then get the value from content, if it exists */
        var v = content[name];
        if (typeof v === 'undefined') { v = ''; }
        /* push the cell */
        c[i].innerHTML = v;
      }
    };

    /* interface for updating the footer */
    scaffold.updateFooter = function() {
      var p = scaffold.pag;
      /* render record count */
      var count_txt = p.displayCount + " records";
      if (p.count) {
        count_txt += " / " + p.count + " total";
      }
      scaffold.footer_count.innerHTML = count_txt;
      /* render page links, if needed */
      if (p.count && p.displayCount < p.count) {
        /* need pagination */
        var i;
        var pg = p.currentPage;
        var max = p.getMaxPage();
        var pageLinks = '';
        for (i=1; i<=max; i++) {
          if (pg == i) {
            pageLinks += ' ' +  i + ' ';
          } else {
            pageLinks += ' <a href="#" data-rest-scaffold-page="' + i + '">' + i + '</a> ';
          }
        }
        if (pg > 1) {
          /* render "previous" link */
          pageLinks = ' <a href="#" data-rest-scaffold-page="' + (pg-1) + '">Previous</a> | ' + pageLinks;
        }
        if (pg != p.getMaxPage()) {
          /* render "next" link */
          pageLinks = pageLinks + ' | <a href="#" data-rest-scaffold-page="' + (pg+1) + '">Next</a>';
        }
        scaffold.footer_pages.innerHTML = pageLinks;
      } else {
        /* don't need pagination */
        scaffold.footer_pages.innerHTML = '';
      }
    };

    /* interface for populating the table */
    scaffold.populate = function(args) {
      $(scaffold.spinner).show();

      /* convert page string to int if needed */
      if (typeof args.page === 'string') {
        args.page = parseInt(args.page, 10);
      }

      /* if we don't get the page in the args, set the page to currentPage */
      var p = scaffold.pag;
      if (args.page) {
        p.currentPage = parseInt(args.page, 10);
      } else if (p.currentPage) {
        args.page = p.currentPage;
      }

      /* execute the ajax request */
      scaffold.ajax({
        "useCache": args.useCache,
        "page": args.page || 1,
        "success": function(data, status, xhr) {
          if (typeof data == 'string') {
            try {
              var j = JSON.parse(data);
            } catch (e) {
              scaffold.throwError({"msg": "Couldn't parse JSON", "e": e, "dump": data});
              return;
            }
          } else {
            var j = data;
          }
          if (j.results) {
            var i;
            $(scaffold.records).empty();
            var count = j.results.length;
            /* store pagination meta-data */
            if (j.count && j.results.length )
            /* push record */
            for (i=0; i<j.results.length; i++) {
              scaffold.pushRecord(j.results[i]);
            }
            /* update footer */
            p.count = j.count;
            p.displayCount = j.results.length;
            if (p.currentPage == 1 || p.currentPage != p.getMaxPage()) {
              /* update page size (only allow growth of page size) */
              if (p.pageSize < j.results.length) {
                p.pageSize = j.results.length;
              }
            }
            scaffold.updateFooter();
          } else {
            /* if we requested a page and it's not there, try to go to page 1 */
            if (args.page && args.page > 1) {
              args.page = 1;
              args.useCache = false;
              scaffold.populate(args);
            } else {
              scaffold.pushMessage({"type": "info", "text": "no records"});
            }
          }
        }
      });
    };

    /* interface for deleting a record */
    scaffold.deleteRecord = function(deletingElement) {
      if (!confirm("Are you sure you want to delete this record?")) { return; }
      var tr = $(deletingElement).closest("tr")[0];
      changeSpinner(tr, 'show');
      scaffold.ajax({
        "method": "DELETE",
        "pk": tr.dataset.restScaffoldPk,
        "error": function() { changeSpinner(tr, 'hide'); },
        "success": function(data, status, xhr) {
          /* delete row */
          tr.parentElement.removeChild(tr);
          /* update footer */
          scaffold.pag.count -= 1;
          scaffold.pag.displayCount -= 1;
          scaffold.updateFooter();
          /* go to previous page if this one is empty now */
          if (!scaffold.pag.displayCount && scaffold.pag.currentPage > 1) {
            scaffold.pag.currentPage -= 1;
            scaffold.populate({});
          }
          /* refresh the page if we are on page 1 and count is <= page size */
          if (scaffold.pag.currentPage == 1 && scaffold.pag.count <= scaffold.pag.pageSize) {
            scaffold.populate({})
          }
        }
      });
    }

    /* interface for generating fields from a record */
    scaffold.interpolateFields = function(record) {
      scaffold.fields = [];
      for (var key in record) {
        var id = 'rest-scaffold-field-' + getUniqueId();
        var fieldProps = {
          name: key,
          id: id,
          html: getField(typeof record[key], key, id)
        };

        /* exclude id on form since that is usually generated by the backend */
        if (key == "id") {
            fieldProps.on_form = false;
        }

        scaffold.fields.push(fieldProps);
      }
    }

    /* if we don't have fields, get them from an AJAX request */
    if (!args.fields) {
      scaffold.ajax({
        "success": function(data, status, xhr) {
          /* parse fields or throw error */
          if (typeof data == 'string') {
            try {
              var j = JSON.parse(data);
            } catch (e) {
              scaffold.throwError({"msg": "Couldn't parse JSON", "e": e, "dump": data});
              return;
            }
          } else {
            var j = data;
          }
          if (j.results) {
            if (j.results[0]) {
              scaffold.interpolateFields(j.results[0]);
              postInitScaffold(scaffold);
              return scaffold;
            }
          }
          scaffold.pushMessage({
            "type": "info",
            "text": "no results, no fields provided"
          });
        }
      });
      return scaffold;
    }
    scaffold.fields = args.fields;
    postInitScaffold(scaffold);
    return scaffold;
  }

  /****************************************
   * Scaffold Post-Initialization Routine *
   ****************************************/

  function postInitScaffold(scaffold) {
    /* set state to indicate postInit has started */
    scaffold.state = 1;

    /* should have scaffold.fields, so first apply defaults */
    applyFieldDefaults(scaffold.fields);

    /* build the headers (+ actions) */
    var i;
    var tr = document.createElement('tr');
    for (i=0; i<scaffold.fields.length; i++) {
      if (scaffold.fields[i].on_table) {
        var h = document.createElement('th');
        h.innerHTML = scaffold.fields[i].title || scaffold.fields[i].name;
        h.dataset.restScaffoldFieldName = scaffold.fields[i].name;
        tr.appendChild(h);
      }
    }
    var h = document.createElement('th');
    h.innerHTML = '.';
    tr.appendChild(h);
    $(scaffold.headers).empty();
    scaffold.headers.appendChild(tr);

    /* set the column width of the footer row */
    var h = scaffold.getHeaderElements();
    scaffold.footer_count.parentElement.colSpan = h.length || 1;

    /* forms */
    scaffold.genericFormBody = buildGenericFormBody(scaffold.fields);

    /* interface to build a form */
    scaffold.buildForm = function(args) {
      if (args.type == 'edit' || args.type == 'update') {
        args.type = 'update';
        var submitText = 'Update';
      } else {
        args.type = 'create';
        var submitText = 'Create';
      }
      var formBody = '';
      /* build form if we didn't find one */
      if (args.body) {
        var formBody = args.body;
      } else {
        var formBody = scaffold.genericFormBody;
      }
      /* add form header */
      var t = scaffold.recordTitle;
      var f = '<span class="rest-scaffold-form-head">' + submitText;
      f += ' ' + t + '</span>\n';
      formBody = f + formBody;
      /* inject submit and close button */
      formBody += '<div><br><span><input type="submit" value="' + submitText + '"> ';
      formBody += '<input type="reset" value="Reset"></span></div>';
      /* ok, have body, now render form */
      if (args.type == 'update') {
        return "<form data-rest-scaffold-update-record>" + formBody + "</form>";
      }
      return "<form data-rest-scaffold-create-record>" + formBody + "</form>";
    };

    /* if we were given a createForm, use it, otherwise build one */
    scaffold.createForm = scaffold.buildForm({
      'type': 'create',
      'body': scaffold.rawCreateForm
    });
    scaffold.updateForm = scaffold.buildForm({
      'type': 'update',
      'body': scaffold.rawUpdateForm
    });

    /* render create link if we have a form */
    if (scaffold.createForm) {
      addListLink(scaffold.menu, 'render-create', 'Create');
    }

    /* populate table, using the cache if we have cached values */
    scaffold.populate({"useCache": true});

    return scaffold;
  }

  /***********************************************
   * Global Initialization, Dynamic Link Actions *
   ***********************************************/

  function init() {
    var s = document.querySelectorAll("[data-rest-scaffold]");
    $('[data-rest-scaffold]').each(function(i) {
      try {
        var args = JSON.parse(this.dataset.restScaffold);
      } catch (e) {
        var args = {"badargs": this.dataset.restScaffold, "e": e};
      }
      var rs = initScaffold(this, i, args);
      scaffolds.push(rs);
    });

    /* close nth parent container (n>1) */
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

    /* close button on messages */
    $(document).on("click", "[data-rest-scaffold-close-message]", function() {
      closeNthParent(this, 3);
      return false;
    });

    /* delete record */
    $(document).on("click", "[data-rest-scaffold-delete]", function() {
      var s = getScaffold(this);
      s.deleteRecord(this);
      return false;
    });

    /* refresh the scaffold */
    $(document).on("click", "[data-rest-scaffold-refresh]", function() {
      var s = getScaffold(this);
      s.populate({});
      return false;
    });

    /* render the create form */
    $(document).on("click", "[data-rest-scaffold-render-create]", function() {
      var s = getScaffold(this);
      s.changeLinkState('create', 'disable');

      /* build form */
      var form = s.createForm;
      form = '<a href="#" data-rest-scaffold-close-create> X </a>\n' + form;
      form = '<div class="rest-scaffold-create-form">' + form + "</div>";

      /* insert the form */
      s.topbar.insertAdjacentHTML('afterend', form);

      /* put focus on form */
      $(s.rsDiv).find('.rest-scaffold-create-form :input:enabled:visible:first')[0].focus();

      return false;
    });

    /* close button on create forms */
    $(document).on("click", "[data-rest-scaffold-close-create]", function() {
      var s = getScaffold(this);
      closeNthParent(this, 2);

      /* re-enable create button */
      s.changeLinkState('create', 'enable');

      return false;
    });

    /* create record */
    $(document).on("submit", "[data-rest-scaffold-create-record]", function() {
      changeButtonState(this, 'disable');
      var s = getScaffold(this);

      /* show the spinner for status */
      $(s.spinner).show();

      /* create the record */
      var formContents = serializeForm(this);
      var elem = this;
      s.ajax({
        "method": "POST",
        "payload": formContents,
        "error": function() {
          console.log("DEBUG");
          changeButtonState(elem, 'enable');
        },
        "success": function(data, status, xhr) {
          /* check if this was an empty table and now needs to do postInit */
          if (!s.state) {
            /* get fields from data */
            s.interpolateFields(data);

            postInitScaffold(s);
          } else {
            /* add row */
            s.pushRecord(data);

            /* delete form */
            $(elem.parentElement).remove();

            /* update footer */
            s.pag.count += 1;
            s.pag.displayCount += 1;
            s.updateFooter();
          }

          /* remove messages */
          $(s.messages).empty();

          /* re-enable create button */
          s.changeLinkState('create', 'enable');
        }
      });

      return false;
    });

    /* render the update form */
    $(document).on("click", "[data-rest-scaffold-render-update]", function() {
      var s = getScaffold(this);

      /* get record row */
      var tr = this.closest('tr');
      var pk = tr.dataset.restScaffoldPk;

      /* build form */
      var form = s.updateForm;
      form = '<a href="#" data-rest-scaffold-close-update> X </a>\n' + form;
      form = '<div class="rest-scaffold-update-form">' + form + "</div>";
      form = "<td colspan=" + s.getNumberOfHeaders() + ">" + form + "</td>";

      /* wrap in row with reference to record row */
      form = '<tr data-rest-scaffold-ref-pk="' + pk + '">' + form + '</tr>';

      /* insert form above rendering element tr */
      var tr = this.closest('tr');
      tr.insertAdjacentHTML('beforebegin', form);

      /* fill out form */
      form = tr.previousSibling;
      var fields = Array.from(form.getElementsByTagName('input')).concat(
        Array.from(form.getElementsByTagName('select')),
        Array.from(form.getElementsByTagName('textarea'))
      );
      var i;
      var rc = s.cache.records[pk];
      for (i=0; i<fields.length; i++) {
        if (rc.record[fields[i].name]) {
          if (fields[i].type && fields[i].type == 'checkbox') {
            if (rc.record[fields[i].name] === true) {
              fields[i].checked = true;
            } else {
              fields[i].checked = false;
            }
          } else if (fields[i].multiple) {
            console.log(rc.record[fields[i].name]);
            setSelected(fields[i], rc.record[fields[i].name]);
          } else {
            fields[i].value = rc.record[fields[i].name];
          }
        }
      }

      /* hide the original record */
      $(tr).hide();

      /* put focus on form */
      $(s.rsDiv).find('.rest-scaffold-update-form :input:enabled:visible:first')[0].focus();

      return false;
    });

    /* close button on update forms */
    $(document).on("click", "[data-rest-scaffold-close-update]", function() {
      var s = getScaffold(this);
      closeNthParent(this, 4);

      /* show the record row */
      $(s.getRowByPk(this.closest('tr').dataset.restScaffoldRefPk)).show();

      return false;
    });

    /* update record */
    $(document).on("submit", "[data-rest-scaffold-update-record]", function() {
      changeButtonState(this, 'disable');
      var s = getScaffold(this);

      $(s.spinner).show();
      var formContents = serializeForm(this);
      var elem = this;
      var tr = this.closest('tr');
      var pk = tr.dataset.restScaffoldRefPk;
      var recordElement = s.getRowByPk(pk);
      s.ajax({
        "method": "PUT",
        "pk": pk,
        "payload": formContents,
        "error": function() {
          changeButtonState(elem, 'enable');
        },
        "success": function(data, status, xhr) {
          /* update row */
          s.updateRow(data, recordElement);
          /* delete form */
          $(tr).remove();
          /* show row */
          $(recordElement).show();
        }
      });

      return false;
    });

    /* register scaffold page jump event */
    $(document).on("click", "[data-rest-scaffold-page]", function() {
      var s = getScaffold(this);
      s.populate({"page": this.dataset.restScaffoldPage});
      return false;
    });
  }

  return {"init": init};

}));

/*******************************************
 * Call init() when the document is loaded *
 *******************************************/

if (typeof document === 'object') {
  $(function() {
    restScaffold.init();
  });
}
