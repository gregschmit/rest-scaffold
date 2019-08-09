/**
 * This module implements scaffold helpers to render info/status/error messages.
 */

import U from '../utils.js';


function addMessageHelpers(rsDiv, scaffold) {
  /* interface for pushing messages (error and info) */
  scaffold.pushMessage = function(args) {
    var r = this.messages.insertRow(-1);
    r.className = "rest-scaffold-" + args.type;
    var c = r.insertCell(0);
    var h = this.getHeaderElements();
    var x = '<a href="#" data-rest-scaffold-close-message> X </a>';
    c.innerHTML = x;
    if (args.text) {
      c.appendChild(document.createTextNode(args.text));
    } else if (args.element) {
      c.appendChild(args.element);
    }
  };

  /* helper for throwing errors */
  scaffold.throwError = function(args) {
    $(this.messages).empty();
    if (!this.debug) {
      this.pushMessage({"type": "error", "text": args.msg});
      return;
    }
    var p = document.createElement("pre");
    if (args.msg) {
      p.insertAdjacentHTML("afterbegin", args.msg);
    }
    if (args.e) {
      var nl;
      if (args.msg) { nl = "\n\n"; } else { nl = ''; }
      p.insertAdjacentHTML("beforeend", nl + "ERROR: " + args.e.toString()
        + "\n\nSTACK: " + args.e.stack
      );
    }
    if (args.dump) {
      p.insertAdjacentHTML("beforeend", "\n\nDUMP:\n");
      if (args.dump instanceof Object) {
        args.dump = JSON.stringify(args.dump);
      }
      var lines = args.dump.split("\n");
      var i;
      for (i=0; i<lines.length; i++) {
        p.appendChild(document.createTextNode(lines[i]));
        p.insertAdjacentHTML("beforeend", "\n");
      }
    }
    this.pushMessage({"type": "error", "element": p});
  };
}


export default addMessageHelpers;
