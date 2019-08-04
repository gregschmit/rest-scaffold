"use strict";
/*
 * rest-scaffold: A library for rendering tables from REST APIs and providing
 *  the basic CRUD actions and extensibility for more actions.
 * Copyright 2019, Gregory N. Schmit
 * MIT Licensed
 */

import initScaffold from './init.js';
import registerEventListeners from './event-listeners.js';

/**
 * This is the entry point, and we need to detect restScaffold elements and
 * process them. Afterwards, we need to ensure that the event listeners are
 * registered.
 */
document.addEventListener("DOMContentLoaded", function(event){
  /* get scaffold elements */
  var scaffoldElements = document.querySelectorAll("[data-rest-scaffold]");
  var scaffolds = [];

  /* iterate over elements, calling initScaffold */
  for (var i=0; i<scaffoldElements.length; i++) {
    var el = scaffoldElements[i];
    try {
      var args = JSON.parse(el.dataset.restScaffold);
    } catch (e) {
      var args = {"badargs": el.dataset.restScaffold, "e": e};
    }
    var rs = initScaffold(el, i, args);
    scaffolds.push(rs);
  }

  /* register event listeners for scaffold actions */
  registerEventListeners(scaffolds);
});
