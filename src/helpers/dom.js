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
    return this.records.getElementsByTagName('tr');
  };
  scaffold.getHeaderElements = function() {
    return this.headers.getElementsByTagName('th');
  };
  scaffold.getNumberOfHeaders = function() {
    return this.getHeaderElements().length;
  };

  /* helper for getting a row by the Pk (primary key) */
  scaffold.getRowByPk = function(pk) {
    var i;
    var rows = this.getRecordRows();
    for (i=0; i<rows.length; i++) {
      if (rows[i].dataset.restScaffoldPk == pk) {
        return rows[i];
      }
    }
    return null;
  }
}


export default addDOMHelpers
