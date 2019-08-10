
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
    form = '<div class="rest-scaffold-create-form">' + form + "</div>";

    /* insert the form */
    s.topbar.insertAdjacentHTML('afterend', form);

    /* put focus on form */
    $(s.rsDiv).find('.rest-scaffold-create-form :input:enabled:visible:first')[0].focus();

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
  $(document).on("submit", "[data-rest-scaffold-create-record]", function() {
    U.changeButtonState(this, 'disable');
    var s = U.getScaffold(this, scaffolds);

    /* show the spinner for status */
    $(s.spinner).show();

    /* create the record */
    var formContents = U.serializeForm(this);
    var elem = this;
    s.ajax({
      "method": "POST",
      "payload": formContents,
      "error": function() {
        U.changeButtonState(elem, 'enable');
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

          /* update counts */
          s.count += 1;
          s.displayCount += 1;

          /* update footer */
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
    var s = U.getScaffold(this, scaffolds);

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
          U.setSelected(fields[i], rc.record[fields[i].name]);
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
    var s = U.getScaffold(this, scaffolds);
    U.closeNthParent(this, 4);

    /* show the record row */
    $(s.getRowByPk(this.closest('tr').dataset.restScaffoldRefPk)).show();

    return false;
  });

  /* update record */
  $(document).on("submit", "[data-rest-scaffold-update-record]", function() {
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

  /* register scaffold page jump event */
  $(document).on("click", "[data-rest-scaffold-page]", function() {
    var s = U.getScaffold(this, scaffolds);
    s.populate({"page": this.dataset.restScaffoldPage});
    return false;
  });
}

export default registerEventListeners;
