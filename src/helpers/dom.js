/**
 * This module implements scaffold helpers for DOM manipulation.
 */

import U from '../utils.js';


function addDOMHelpers(rsDiv, scaffold) {
  /* helpers for getting elements */
  scaffold.headers = rsDiv.querySelector('.rest-scaffold-headers');
  scaffold.menu = rsDiv.querySelector('.rest-scaffold-menu');
  scaffold.spinner = scaffold.menu.querySelector('.rest-scaffold-spinner');
  scaffold.topbar = rsDiv.querySelector('.rest-scaffold-topbar');
  scaffold.messages = rsDiv.querySelector('.rest-scaffold-messages');
  scaffold.records = rsDiv.querySelector('.rest-scaffold-records');
  scaffold.footer = rsDiv.querySelector('.rest-scaffold-footer');
  scaffold.footer_count = rsDiv.querySelector('.rest-scaffold-count');
  scaffold.footer_pages = rsDiv.querySelector('.rest-scaffold-pages');
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
    var rows = this.getRecordRows();
    for (var i=0; i<rows.length; i++) {
      if (rows[i].dataset.restScaffoldPk == pk) {
        return rows[i];
      }
    }
    return null;
  }
}


export default addDOMHelpers
