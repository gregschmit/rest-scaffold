/**
 * This module implements scaffold helpers to render forms.
 */

import U from '../utils.js';


function addFormHelpers(scaffold) {
  scaffold.genericFormBody = U.buildGenericFormBody(scaffold.fields);

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
      var formBody = this.genericFormBody;
    }
    /* add form header */
    var t = this.recordTitle;
    var f = '<span class="rest-scaffold-page-head">' + submitText;
    f += ' ' + t + '</span>\n';
    formBody = f + formBody;
    /* inject submit and close button */
    formBody += '<div><br><span><input type="submit" value="' + submitText + '"> ';
    formBody += '<input type="reset" value="Reset"></span></div>';
    /* ok, have body, now render form */
    if (args.type == 'update') {
      return "<form data-rest-scaffold-update-form>" + formBody + "</form>";
    }
    return "<form data-rest-scaffold-create-form>" + formBody + "</form>";
  };

  /* render update form helper */
  scaffold.renderUpdateForm = function(renderUpdateElement) {
    /* get record row */
    var tr = renderUpdateElement.closest('tr');
    var pk = tr.dataset.restScaffoldPk;

    /* build form */
    var form = this.updateForm;
    form = '<a href="#" data-rest-scaffold-close-update> X </a>\n' + form;
    form = '<div class="rest-scaffold-page">' + form + "</div>";
    form = "<td colspan=" + scaffold.getNumberOfHeaders() + ">" + form;
    form += "</td>";

    /* wrap in row with reference to record row */
    form = '<tr data-rest-scaffold-ref-pk="' + pk + '">' + form + '</tr>';

    /* insert form above rendering element tr */
    var tr = renderUpdateElement.closest('tr');
    tr.insertAdjacentHTML('beforebegin', form);

    /* fill out form */
    form = tr.previousSibling;
    var fields = Array.from(form.getElementsByTagName('input')).concat(
      Array.from(form.getElementsByTagName('select')),
      Array.from(form.getElementsByTagName('textarea'))
    );
    var rc = scaffold.cache.records[pk];
    for (var i=0; i<fields.length; i++) {
      if (rc.record[fields[i].name]) {
        if (fields[i].type && fields[i].type == 'checkbox') {
          if (rc.record[fields[i].name] === true) {
            fields[i].checked = true;
          } else {
            fields[i].checked = false;
          }
        } else if (fields[i].multiple) {
          U.setSelected(fields[i], rc.record[fields[i].name]);
        } else {
          fields[i].value = rc.record[fields[i].name];
        }
      }
    }

    /* hide the original record */
    $(tr).hide();

    /* put focus on form */
    $(scaffold.rsDiv).find(
      '[data-rest-scaffold-update-form] :input:enabled:visible:first'
    )[0].focus();
  }
}


export default addFormHelpers;
