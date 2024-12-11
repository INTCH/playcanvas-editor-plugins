// ==UserScript==
// @name         Copy Asset ID
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy selected asset IDs in PlayCanvas editor
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
        if (index === 1) {
          const newDiv = document.createElement("div");
          newDiv.className =
            "pcui-element font-regular pcui-container pcui-menu-item";
          newDiv.innerHTML = `
            <div class="pcui-element font-regular pcui-menu-item-content pcui-container pcui-flex" style="flex-direction: row;">
              <span class="pcui-element font-regular pcui-label">Copy ID</span>
            </div>
            <div class="pcui-element font-regular pcui-menu-item-children pcui-container"></div>
          `;
          newDiv.addEventListener("click", () => {
            const selectedAssetIds = editor.selection.items
              .map(v => v.get("id"))
              .join(", ");

            if (selectedAssetIds) {
              navigator.clipboard.writeText(selectedAssetIds)
                .then(() => {
                  console.log("Asset IDs copied to clipboard:", selectedAssetIds);
                })
                .catch(err => {
                  console.error("Failed to copy Asset IDs:", err);
                });
            } else {
              console.log("No assets selected.");
            }
          });
          menuItemsDiv.appendChild(newDiv);
        }
      });
    }
  }, 5000);
})();
