/**
 * This module handles the scaffold initialization and configuration.
 */

import U from './utils.js';

import addMessageHelpers from './helpers/messages.js';
import addDOMHelpers from './helpers/dom.js';
import addContentHelpers from './helpers/content.js';
import fieldsInitScaffold from './init-fields.js';


/**
 * The `initScaffold` function takes a scaffold element and:
 *  - processes the configuration
 *  - stores metadata
 *  - adds helper functions
 *
 * @return a configured scaffold object
 */
function initScaffold(rsDiv, index, args) {
  /* build scaffold object */
  var scaffold = {};
  scaffold.index = index;
  scaffold.state = 0;
  scaffold.rsDiv = rsDiv;
  rsDiv = $(rsDiv);

  /* fill scaffold div */
  rsDiv.empty();
  rsDiv.html(' \
    <div class="rest-scaffold-topbar"> \
      <span class="rest-scaffold-head"></span> \
      <sub class="rest-scaffold-secondary"></sub> \
      <ul class="rest-scaffold-menu"> \
        <li><span class="rest-scaffold-spinner"></span></li>\
      </ul> \
    </div> \
    <table> \
      <tbody class="rest-scaffold-messages"></tbody> \
    </table> \
    <table> \
      <thead class="rest-scaffold-headers"></thead> \
      <tbody class="rest-scaffold-records"></tbody> \
      <tfoot class="rest-scaffold-footer"><tr><td> \
        <span class="rest-scaffold-count"></span> \
        <span class="rest-scaffold-pages"></span> \
      </td></tr></tbody> \
    </table> \
  ');

  addMessageHelpers(rsDiv, scaffold);

  /* if args are bad, throw error and exit */
  if (args.e) {
    scaffold.state = -1;
    scaffold.throwError({
      "msg": "Scaffold configuration is not valid JSON",
      "e": args.e,
      "dump": args.badargs
    });
    $(scaffold.spinner).hide();
    return scaffold;
  }

  /* evaluate API type */
  scaffold.apiType = args.apiType || args.APIType || 'plain';
  var typeSettings = {};
  if (scaffold.apiType == 'django-paged') {
    typeSettings.resultsName = 'results';
    typeSettings.isPaged = true;
  } else {  /* plain */
    typeSettings.resultsName = null;
    typeSettings.isPaged = false;
  }

  /* load args into scaffold with sensible defaults */
  var defaultSettings = {
    'actionsLabel': '.',
    'csrfToken': '',
    'csrfTokenHeader': 'X-CSRFToken',
    'debug': true,
    'fields': [],
    'isPaged': false,
    'pkField': 'id',
    'rawCreateForm': null,
    'rawUpdateForm': null,
    'recordTitle': 'Record',
    'requestHeaders': {},
    'resultsName': null,
    'subtitle': '',
    'title': '',
    'url': '/'
  }
  function setScaffoldProperty(k) {
    var found = false;
    if (!(k instanceof Array)) {
      k = [k];
    }
    for (var i=0; i<k.length; i++) {
      var p = k[i];
      if (p && args.hasOwnProperty(p)) {
        scaffold[p] = args[p];
        found = true;
        break;
      }
    }
    if (!found) {
      k = k[0];
      if (typeSettings.hasOwnProperty(k)) {
        scaffold[k] = typeSettings[k];
      } else {
        scaffold[k] = defaultSettings[k];
      }
    }
  }
  for (var k in defaultSettings) {
    if (k == 'rawCreateForm') {
      setScaffoldProperty(['createForm', 'addForm']);
    } else if (k == 'rawUpdateForm') {
      setScaffoldProperty(['updateForm', 'editForm']);
    } else {
      setScaffoldProperty(k);
    }
  }

  /* ensure slash at end of url */
  if (scaffold.url.slice(-1) !== '/') {
    scaffold.url = scaffold.url + '/';
  }

  /* build count meta (these will be the same if no paging) */
  scaffold.count = 0;
  scaffold.displayCount = 0;

  /* build pagination meta */
  scaffold.pag = null;
  if (scaffold.isPaged) {
    scaffold.pag = {
      "schema": "normal",
      "pageSize": 1,
      "currentPage": 1,
      "getTotal": function() { return scaffold.count || scaffold.displayCount; },
      "getOffset": function(page) { return this.pageSize*(page-1); },
      "getMaxPage": function() {
        return (~~((this.getTotal()-1)/this.pageSize) + 1) || 1;
      }
    };
  }

  /* build data cache */
  scaffold.cache = {
    'records': {},
    'lastListing': null
  };

  /* inject title/subtitle */
  rsDiv.find('.rest-scaffold-head').text(scaffold.title);
  rsDiv.find('.rest-scaffold-secondary').text(scaffold.subtitle);

  addDOMHelpers(rsDiv, scaffold);

  /* show that we're loading things */
  $(scaffold.spinner).show();

  /* inject scaffold refresh url */
  U.addListLink(scaffold.menu, 'refresh', 'Refresh');

  addContentHelpers(rsDiv, scaffold);

  /* if we don't have fields, get them from an AJAX request */
  if (!scaffold.fields) {
    scaffold.ajax({
      "success": function(data, status, xhr) {
        var dataObject = scaffold.ensureObject(data, true);
        var results = scaffold.getResults(dataObject);
        var first_result = results[0];
        if (first_result) {
          scaffold.interpolateFields(first_result);
          fieldsInitScaffold(scaffold);
          return scaffold;
        }
        scaffold.pushMessage({
          "type": "info",
          "text": "no list results, no fields provided"
        });
      }
    });
    return scaffold;
  }
  fieldsInitScaffold(scaffold);
  return scaffold;
}


export default initScaffold;
