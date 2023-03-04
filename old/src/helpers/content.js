/**
 * This module implements scaffold helpers for the core content (AJAX, records,
 * rows, fields, etc.).
 */

import U from '../utils.js';


function addContentHelpers(rsDiv, scaffold) {
  /**
   * Attempt to ensure that the object is a JS object, not a string.
   */
  scaffold.ensureObject = function(data, throwError) {
    if (typeof data == 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (throwError) {
          this.throwError({"msg": "Couldn't parse JSON", "e": e, "dump": data});
        }
        return null;
      }
    }
    return data;
  }

  /**
   * If the scaffold `resultsName` is null, then data itself should be the
   * results, else we need to get the `resultsName` property.
   */
  scaffold.getResults = function(dataObject) {
    if (!dataObject) { return dataObject; }
    if (this.resultsName) {
      return dataObject[this.resultsName];
    } else {
      return dataObject;
    }
  };

  /* interface for AJAX */
  scaffold.ajax = function(args) {
    var target = this.url;
    if (args.hasOwnProperty('pk')) {
      target += args.pk + '/';
    }
    if (this.pag && args.page && args.page > 1) {
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
        if (method == 'GET') {
          /* try to cache, fail silently */
          var pkField = scaffold.pkField;
          var dataObject = scaffold.ensureObject(data, false);
          if (dataObject) {
            if (args.hasOwnProperty('pk')) {
              /* not listing */
              scaffold.cache.records[dataObject[pkField]] = {
                record: dataObject,
                detail: true
              };
            } else {
              /* listing */
              scaffold.cache.lastListing = dataObject;
              var results = scaffold.getResults(dataObject);
              for (var i=0; i<results.length; i++) {
                scaffold.cache.records[results[i][pkField]] = {
                  record: results[i],
                  detail: false
                };
              }
            }
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
    var h = this.getHeaderElements();
    for (var i=0; i<h.length-1; i++) { /* for each header */
      /* get the name of the field */
      if (h[i].hasAttribute("data-rest-scaffold-field-name")) {
        var name = h[i].dataset.restScaffoldFieldName;
      } else {
        var name = h[i].textContent;
      }
      /* then get the value from content, if it exists */
      var v = content[name];
      /* convert to choice display if needed */
      var fieldConfig = this.fields.find(e => e["name"] == name);
      if (fieldConfig && fieldConfig.hasOwnProperty('choices')) {
        v = fieldConfig.choices.find(e => e[0] == v)[1];
      }
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
      var actionLinks = this.renderActionLinks();
      for (var i=0; i<actionLinks.length; i++) {
        a += actionLinks[i];
      }
      a += '</ul>';
      c.innerHTML = a;
    }
  };

  /* interface for updating a row on the table */
  scaffold.updateRow = function(content, row) {
    var h = scaffold.getHeaderElements();
    var c = row.cells;
    for (var i=0; i<h.length-1; i++) { /* for each header */
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
    if (p) {
      var count_txt = this.displayCount + " records";
      if (this.count) {
        count_txt += " / " + this.count + " total";
      }
    } else {
      var count_txt = this.count + " total"
    }
    /* render record count */
    this.footer_count.innerHTML = count_txt;
    /* render page links, if needed */
    if (p && this.count && this.displayCount < this.count) {
      /* need pagination */
      var pg = p.currentPage;
      var max = p.getMaxPage();
      var pageLinks = '';
      for (var i=1; i<=max; i++) {
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
    if (this.pag) {
      if (args.page) {
        this.pag.currentPage = parseInt(args.page, 10);
      } else if (this.pag.currentPage) {
        args.page = this.pag.currentPage;
      }
    }

    /* execute the ajax request */
    var scaffold = this;
    this.ajax({
      "useCache": args.useCache,
      "page": args.page || 1,
      "success": function(data, status, xhr) {
        var dataObject = scaffold.ensureObject(data, true);
        var results = scaffold.getResults(dataObject);
        if (results) {
          $(scaffold.records).empty();
          /* push record */
          for (var i=0; i<results.length; i++) {
            scaffold.pushRecord(results[i]);
          }
          /* update pagination meta-data */
          var p = scaffold.pag;
          if (p) {
            scaffold.count = dataObject.count;
            scaffold.displayCount = results.length;
            if (p.currentPage == 1 || p.currentPage != p.getMaxPage()) {
              /* update page size */
              p.pageSize = results.length;
            }
          } else {
            scaffold.count = scaffold.displayCount = results.length;
          }
          /* update footer */
          scaffold.updateFooter();
        } else {
          /* if we requested a page and it's not there, try to go to page 1 */
          if (scaffold.pag && args.page && args.page > 1) {
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
        /* update counts */
        scaffold.count -= 1;
        scaffold.displayCount -= 1;
        /* go to previous page if this one is empty now */
        if (scaffold.pag) {
          if (!scaffold.pag.displayCount && scaffold.pag.currentPage > 1) {
            scaffold.pag.currentPage -= 1;
            scaffold.populate({});
          }
          /* refresh the page if we are on page 1 and count is <= page size */
          if (scaffold.pag.currentPage == 1 && scaffold.count <= scaffold.pag.pageSize) {
            scaffold.populate({})
          }
        }
        /* update footer */
        scaffold.updateFooter();
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
