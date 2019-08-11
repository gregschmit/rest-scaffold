/**
 * This module implements action links.
 */

import U from '../../utils.js';

/*
 * Add actions and return HTML list items for each.
 */
function addRecordActionHelpers(scaffold) {

  /* create record helper */
  scaffold.createRecord = function(formElement) {
    /* show the spinner for status */
    $(this.spinner).show();

    /* create the record */
    var formContents = U.serializeForm(formElement);
    var scaffold = this;
    this.ajax({
      "method": "POST",
      "payload": formContents,
      "error": function() {
        U.changeButtonState(formElement, 'enable');
      },
      "success": function(data, status, xhr) {
        /* check if this was an empty table and now needs to do postInit */
        if (!scaffold.state) {
          /* get fields from data */
          scaffold.interpolateFields(data);

          postInitScaffold(scaffold);
        } else {
          /* add row */
          scaffold.pushRecord(data);

          /* delete form */
          $(formElement.parentElement).remove();

          /* update counts */
          scaffold.count += 1;
          scaffold.displayCount += 1;

          /* update footer */
          scaffold.updateFooter();
        }

        /* remove messages */
        $(scaffold.messages).empty();

        /* re-enable create button */
        scaffold.changeLinkState('create', 'enable');
      }
    });
  };

  /* update record helper */
  scaffold.updateRecord = function(formElement) {

      $(this.spinner).show();
      var formContents = U.serializeForm(formElement);
      var tr = formElement.closest('tr');
      var pk = tr.dataset.restScaffoldRefPk;
      var recordElement = scaffold.getRowByPk(pk);
      s.ajax({
        "method": "PUT",
        "pk": pk,
        "payload": formContents,
        "error": function() {
          U.changeButtonState(formElement, 'enable');
        },
        "success": function(data, status, xhr) {
          /* update row */
          var h = scaffold.getHeaderElements();
          /* for each header */
          for (var i=0; i<h.length-1; i++) {
            /* get the name of the field */
            if (h[i].hasAttribute("data-rest-scaffold-field-name")) {
              var name = h[i].dataset.restScaffoldFieldName;
            } else {
              var name = h[i].textContent;
            }
            /* then get the value from data, if it exists */
            var v = data[name];
            if (typeof v === 'undefined') { v = ''; }
            /* push the cell */
            recordElement.cells[i].innerHTML = v;
          }
          /* delete form */
          $(tr).remove();
          /* show row */
          $(recordElement).show();
        }
      });

  };

  /* render detail view */
  scaffold.renderDetailView = function(renderDetailElement) {
    /* get record row */
    var tr = renderDetailElement.closest('tr');
    var pk = tr.dataset.restScaffoldPk;

    /* setup table */
    var table = '';

    /* get and inject data */
    var rc = scaffold.cache.records[pk].record;
    /* TODO: check if this is detail, if not then get detail! */
    for (var i=0; i<scaffold.fields.length; i++) {
      var title = scaffold.fields[i].title || scaffold.fields[i].name;
      table += '<tr><td>' + title + '</td><td>';
      table += rc[scaffold.fields[i].name] + '</td></tr>';
    }

    /* wrap rows in a table */
    table = '<table>' + table + '</table>';

    /* add header */
    table = '<span class="rest-scaffold-page-head">Update ' + this.recordTitle +
      '</span>' + table;

    /* add close cutton */
    table = '<a href="#" data-rest-scaffold-close-detail> X </a>\n' + table;

    /* wrap in a div, then td */
    table = '<td colspan="' + scaffold.getNumberOfHeaders() + '">' + table;
    table += "</td>";

    /* wrap in row with reference to record row */
    table = '<tr class="rest-scaffold-page" data-rest-scaffold-ref-pk="' + pk +
      '">' + table + '</tr>';

    /* insert table above rendering element tr */
    var tr = renderDetailElement.closest('tr');
    tr.insertAdjacentHTML('beforebegin', table);

    /* hide the original record */
    $(tr).hide();
  };

  scaffold.renderActionLinks = function() {
    var recordActions = [];
    /* render update action */
    if (scaffold.updateForm) {
      recordActions.push(
        '<li><a href="#" data-rest-scaffold-render-update>Update</a></li>'
      );
    }
    /* render detail action */
    recordActions.push(
      '<li><a href="#" data-rest-scaffold-render-detail>Detail</a></li>'
    );
    /* render delete action */
    recordActions.push(
      '<li><a href="#" data-rest-scaffold-delete>Delete</a></li>'
    );
    return recordActions;
  }

}


export default addRecordActionHelpers;
