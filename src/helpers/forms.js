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
}


export default addFormHelpers;
