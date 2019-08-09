/**
 * This module implements scaffold helpers for the core content (AJAX, records,
 * rows, fields, etc.).
 */

import U from '../utils.js';


function addContentHelpers(rsDiv, scaffold) {
  /* interface for AJAX */
  scaffold.ajax = function(args) {
    var target = this.url;
    if (args.hasOwnProperty('pk')) {
      target += args.pk + '/';
    }
    if (args.page && args.page > 1) {
      var p = this.pag.getOffset(args.page);
      target += '?offset=' + p;
    }
    var method = args.method;
    if (!method) {
      if (args.payload) {
        method = 'POST';
      } else {
        method = 'GET';
      }
    }
    if (args.useCache && this.cache.lastListing) {
      args.success(this.cache.lastListing, 0, 0);
      return;
    }
    var scaffold = this;
    var opts = {
      "method": method,
      "contentType": 'application/json',
      "headers": {},
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

    /* load CSRF token */
    opts.headers[this.csrfTokenHeader] = this.csrfToken;

    /* load misc headers */
    for (var k in this.requestHeaders) {
      opts.headers[k] = this.requestHeaders[k];
    }
    /* if we have a payload, stringify it and include it in data */
    if (args.payload) {
      opts.data = JSON.stringify(args.payload);
    }

    /* call the AJAX */
    $.ajax(target, opts);
  }

  /* interface for pushing a record to the table */
  scaffold.pushRecord = function(content) {
    var r = this.records.insertRow(-1);
    var i;
    var h = this.getHeaderElements();
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
    if (content[this.pkField]) {
      r.dataset.restScaffoldPk = content[this.pkField];
      /* TODO: then push actions */
      var c = r.insertCell(h.length-1);
      var a = '<ul class="rest-scaffold-menu">';
      a += '<li><span class="rest-scaffold-spinner" style="display: none"></span></li>';
      if (this.updateForm) {
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
    var h = this.getHeaderElements();
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
    var p = this.pag;
    /* render record count */
    var count_txt = p.displayCount + " records";
    if (p.count) {
      count_txt += " / " + p.count + " total";
    }
    this.footer_count.innerHTML = count_txt;
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
      this.footer_pages.innerHTML = pageLinks;
    } else {
      /* don't need pagination */
      this.footer_pages.innerHTML = '';
    }
  };

  /* interface for populating the table */
  scaffold.populate = function(args) {
    $(this.spinner).show();

    /* convert page string to int if needed */
    if (typeof args.page === 'string') {
      args.page = parseInt(args.page, 10);
    }

    /* if we don't get the page in the args, set the page to currentPage */
    var p = this.pag;
    if (args.page) {
      p.currentPage = parseInt(args.page, 10);
    } else if (p.currentPage) {
      args.page = p.currentPage;
    }

    /* execute the ajax request */
    var scaffold = this;
    this.ajax({
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
          /* push record */
          for (i=0; i<j.results.length; i++) {
            scaffold.pushRecord(j.results[i]);
          }
          /* update pagination meta-data */
          p.count = j.count;
          p.displayCount = j.results.length;
          if (p.currentPage == 1 || p.currentPage != p.getMaxPage()) {
            /* update page size */
            p.pageSize = j.results.length;
          }
          /* update footer */
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
    U.changeSpinner(tr, 'show');
    var scaffold = this;
    this.ajax({
      "method": "DELETE",
      "pk": tr.dataset.restScaffoldPk,
      "error": function() { U.changeSpinner(tr, 'hide'); },
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

      this.fields.push(fieldProps);
    }
  }
}


export default addContentHelpers;
