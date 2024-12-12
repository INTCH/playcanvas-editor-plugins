// ==UserScript==
// @name         PlayCanvas Viewport Entity Select
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Select entity attribute from viewport
// @author       You
// @match        *://playcanvas.com/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

// NOTE:
//ACTIVATE THE SCRIPT ONLY WHEN YOU ARE GOING TO USE IT. SELECT AN ENTITY IN THE VIEWPORT BY PRESSING CTRL + Q WHILE IT IS IN HOVER STATE

(function () {
  "use strict";

  let lastHoveredEntity = null;

  editor.on("viewport:pick:hover", (hover) => {
    if (hover) {
      lastHoveredEntity = {
        ...hover,
        get: (key) => {
          if (key === "resource_id") {
            return hover._guid;
          }
          console.warn(`Key "${key}" not supported.`);
          return null;
        },
      };
    } else {
      lastHoveredEntity = null;
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "q") {
      event.preventDefault();

      if (lastHoveredEntity) {
        const resourceId = lastHoveredEntity.get("resource_id");
        if (resourceId) {
          editor.emit("picker:entity", lastHoveredEntity);
          console.log(`Entity selected: ${resourceId}`);
        }
      } else {
        console.log("No entity is hovered to select.");
      }
    }
  });
})();
