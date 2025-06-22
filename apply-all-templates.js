// ==UserScript==
// @name         Apply All Templates
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply selected templates in PlayCanvas editor
// @author       You
// @match        *://playcanvas.com/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(() => {
    const menuItemsDivs = document.querySelectorAll(".pcui-menu-items");
    if (menuItemsDivs.length > 0) {
      menuItemsDivs.forEach((menuItemsDiv, index) => {
        if (index === 29) {
          const newDiv = document.createElement("div");
          newDiv.className =
            "pcui-element font-regular pcui-container pcui-menu-item";
          newDiv.innerHTML = `
            <div class="pcui-element font-regular pcui-menu-item-content pcui-container pcui-flex" style="flex-direction: row;">
              <span class="pcui-element font-regular pcui-label">Apply Templates</span>
            </div>
            <div class="pcui-element font-regular pcui-menu-item-children pcui-container"></div>
          `;
          newDiv.addEventListener("click", () => {
            editor.selection.items.forEach((e)=>{
                editor.call('templates:apply', e);
            });
          });
          menuItemsDiv.appendChild(newDiv);
        }
      });
    }
  }, 5000);
})();
