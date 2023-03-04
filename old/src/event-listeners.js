
import U from './utils.js';

function registerEventListeners(scaffolds) {
  /* close button on messages */
  $(document).on("click", "[data-rest-scaffold-close-message]", function() {
    U.closeNthParent(this, 3);
    return false;
  });

  /* delete record */
  $(document).on("click", "[data-rest-scaffold-delete]", function() {
    var s = U.getScaffold(this, scaffolds);
    s.deleteRecord(this);
    return false;
  });

  /* refresh the scaffold */
  $(document).on("click", "[data-rest-scaffold-refresh]", function() {
    var s = U.getScaffold(this, scaffolds);
    s.populate({});
    return false;
  });

  /* render the create form */
  $(document).on("click", "[data-rest-scaffold-render-create]", function() {
    var s = U.getScaffold(this, scaffolds);
    s.changeLinkState('create', 'disable');

    /* build form */
    var form = s.createForm;
    form = '<a href="#" data-rest-scaffold-close-create> X </a>\n' + form;
    form = '<div class="rest-scaffold-create-form rest-scaffold-page">' + form;
    form += "</div>";

    /* insert the form */
    s.topbar.insertAdjacentHTML('afterend', form);

    /* put focus on form */
    $(s.rsDiv).find('.rest-scaffold-create-form :input:enabled:visible:first')[0].focus();

    return false;
  });

  /* close button on detail view, and show original record */
  $(document).on("click", "[data-rest-scaffold-close-detail]", function() {
    var s = U.getScaffold(this, scaffolds);
    console.log(this.closest('tr'));
    $(s.getRowByPk(this.closest('tr').dataset.restScaffoldRefPk)).show();
    U.closeNthParent(this, 3);
    return false;
  });

  /* close button on create forms */
  $(document).on("click", "[data-rest-scaffold-close-create]", function() {
    var s = U.getScaffold(this, scaffolds);
    U.closeNthParent(this, 2);

    /* re-enable create button */
    s.changeLinkState('create', 'enable');

    return false;
  });

  /* create record */
  $(document).on("submit", "[data-rest-scaffold-create-form]", function() {
    U.changeButtonState(this, 'disable');
    var s = U.getScaffold(this, scaffolds);
    s.createRecord(this);
    return false;
  });

  /* render the update form */
  $(document).on("click", "[data-rest-scaffold-render-update]", function() {
    var s = U.getScaffold(this, scaffolds);
    s.renderUpdateForm(this);
    return false;
  });

  /* close button on update forms */
  $(document).on("click", "[data-rest-scaffold-close-update]", function() {
    var s = U.getScaffold(this, scaffolds);
    $(s.getRowByPk(this.closest('tr').dataset.restScaffoldRefPk)).show();
    U.closeNthParent(this, 4);
    return false;
  });

  /* update record */
  $(document).on("submit", "[data-rest-scaffold-update-form]", function() {
    U.changeButtonState(this, 'disable');
    var s = U.getScaffold(this, scaffolds);

    $(s.spinner).show();
    var formContents = U.serializeForm(this);
    var el = this;
    var tr = this.closest('tr');
    var pk = tr.dataset.restScaffoldRefPk;
    var recordElement = s.getRowByPk(pk);
    s.ajax({
      "method": "PUT",
      "pk": pk,
      "payload": formContents,
      "error": function() {
        U.changeButtonState(el, 'enable');
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

  /* render the detail view */
  $(document).on("click", "[data-rest-scaffold-render-detail]", function() {
    var s = U.getScaffold(this, scaffolds);
    s.renderDetailView(this);
    return false;
  });

  /* register scaffold page jump event */
  $(document).on("click", "[data-rest-scaffold-page]", function() {
    var s = U.getScaffold(this, scaffolds);
    s.populate({"page": this.dataset.restScaffoldPage});
    return false;
  });
}

export default registerEventListeners;
