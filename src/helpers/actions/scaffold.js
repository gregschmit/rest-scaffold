/**
 * This module implements action links.
 */

import U from '../../utils.js';


function addScaffoldActionHelpers(scaffold) {

  /* helper for disabling/enabling links */
  scaffold.changeLinkState = function(linkName, state) {
    var cls;
    if (linkName == 'update') {
      cls = '[data-rest-scaffold-render-update]';
    } else if (linkName == 'detail') {
      cls = '[data-rest-scaffold-render-create]';
    } else { /* create */
      cls = '[data-rest-scaffold-render-create]';
    }
    if (state == 'disable') {
      $(this.menu).find(cls)[0].classList.add('rest-scaffold-link-disabled');
    } else { /* enable */
      $(this.menu).find(cls)[0].classList.remove('rest-scaffold-link-disabled');
    }
  }

  /* render refresh action */
  U.addListLink(scaffold.menu, 'refresh', 'Refresh');

  /* render create action */
  if (scaffold.createForm) {
    U.addListLink(scaffold.menu, 'render-create', 'Create');
  }

}


export default addScaffoldActionHelpers;
