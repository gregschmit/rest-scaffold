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
    scaffold.throwError({
      "msg": "Scaffold configuration is not valid JSON",
      "e": args.e,
      "dump": args.badargs
    });
    $(scaffold.spinner).hide();
    return scaffold;
  }

  /* build pagination defaults */
  scaffold.pag = {
    "count": undefined,
    "displayCount": 1,
    "pageSize": 1,
    "currentPage": 1,
    "getTotal": function() { return this.count || this.displayCount; },
    "getOffset": function(page) { return this.pageSize*(page-1); },
    "getMaxPage": function() { return (~~((this.getTotal()-1)/this.pageSize) + 1) || 1; }
  };

  /* build data cache */
  scaffold.cache = {
    'records': {},
    'lastListing': null
  };

  /* load args into scaffold with sensible defaults */
  scaffold.csrfToken = args.csrfToken || '';
  scaffold.debug = args.debug || true;
  scaffold.fields = args.fields || null;
  scaffold.pkField = args.pkField || 'id';
  scaffold.rawCreateForm = args.createForm || args.addForm || null;
  scaffold.rawUpdateForm = args.updateForm || args.editForm || null;
  scaffold.recordTitle = args.recordTitle || 'Record';
  scaffold.fields = args.fields || [];
  scaffold.actionsLabel = args.actionsLabel || '.';

  /* inject title/subtitle */
  rsDiv.find('.rest-scaffold-head').text(args.title);
  rsDiv.find('.rest-scaffold-secondary').text(args.subtitle);

  /* parse url */
  if (args.url) {
    scaffold.url = args.url;
  } else {
    scaffold.url = '/';
  }
  if (scaffold.url.slice(-1) !== '/') {
    scaffold.url = scaffold.url + '/';
  }

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
        /* parse fields or throw error */
        if (typeof data == 'string') {
          try {
            var j = JSON.parse(data);
          } catch (e) {
            scaffold.throwError({"msg": "Couldn't parse JSON", "e": e, "dump": data});
            return;
          }
        } else {
          var j = data;
        }
        if (j.results) {
          if (j.results[0]) {
            scaffold.interpolateFields(j.results[0]);
            fieldsInitScaffold(scaffold);
            return scaffold;
          }
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
