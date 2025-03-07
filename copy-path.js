// ==UserScript==
// @name         Playcanvas Copy Path
// @namespace    http://tampermonkey.net/
// @version      2025-03-07
// @description  try to take over the world!
// @author       You
// @match        https://playcanvas.com/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(() => {
    const menuItemsDivs = document.querySelectorAll(".pcui-menu-items");

    if (menuItemsDivs.length > 0) {
      menuItemsDivs.forEach((menuItemsDiv, index) => {
        if (!(index == 29 || index == 1)) return;
        const newDiv = document.createElement("div");
        newDiv.className =
          "pcui-element font-regular pcui-container pcui-menu-item";

        newDiv.innerHTML = `
                    <div class="pcui-element font-regular pcui-menu-item-content pcui-container pcui-flex" style="flex-direction: row;">
                        <span class="pcui-element font-regular pcui-label pcui-disabled" data-icon="🛣️">Copy Path</span>
                    </div>
                    <div class="pcui-element font-regular pcui-menu-item-children pcui-container"></div>
                `;

        newDiv.addEventListener("click", () => {
            function getParentNames(item) {
                let names = [];
                names.push(item.viewportEntity.name);

                function a(item) {
                    if (item.parent) {
                        names.push(item.parent.viewportEntity.name);
                        a(item.parent);
                    }
                }

                a(item);
                return JSON.stringify(names.reverse());
            }

          navigator.clipboard.writeText(getParentNames(editor.selection.items[0]))
                .then(() => {
                  console.log("Asset IDs copied to clipboard:", selectedAssetIds);
                })
                .catch(err => {
                  console.error("Failed to copy Asset IDs:", err);
                });
          });

        menuItemsDiv.appendChild(newDiv);
      });
    }
  }, 5000);
})();
