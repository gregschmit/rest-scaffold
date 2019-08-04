/**
 * This module implements scaffold helpers for DOM manipulation.
 */

import U from '../utils.js';


function addDOMHelpers(rsDiv, scaffold) {
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

  /* helper for getting a row by the Pk (primary key) */
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
}


export default addDOMHelpers