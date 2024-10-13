// ==UserScript==
// @name         PlayCanvas Better Rename
// @namespace    https://github.com/INTCH/playcanvas-better-rename
// @version      1.0
// @description  PlayCanvas Better Rename
// @author       INTCH
// @match        *://playcanvas.com/editor/*
// @grant        none
// ==/UserScript==

// ==UserScript==
// @name         PlayCanvas Better Rename
// @namespace    https://github.com/INTCH/playcanvas-better-rename
// @version      1.0
// @description  PlayCanvas Better Rename
// @author       INTCH
// @match        *://playcanvas.com/editor/*
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
                        <span class="pcui-element font-regular pcui-label pcui-disabled" data-icon="R">Rename</span>
                    </div>
                    <div class="pcui-element font-regular pcui-menu-item-children pcui-container"></div>
                `;

        newDiv.addEventListener("click", () => {
          const searchPattern = prompt(
            "Search (regex or plain text, leave blank to change all):"
          );
          if (searchPattern === null) return;

          let newName = prompt("Change (e.g. Entity or Entity{i+1}):");
          if (newName === null) return;

          const regex = searchPattern ? new RegExp(searchPattern, "g") : null;
          let counter = 0;

          function processMathExpression(expression, index) {
            try {
              return eval(expression.replace("i", index));
            } catch (e) {
              console.error("Error:", expression);
              return index;
            }
          }

          editor.selection.items.forEach((v) => {
            let currentName = v.get("name");
            let modifiedName = newName;

            if (modifiedName.includes("{name}")) {
              modifiedName = modifiedName.replace(/{name}/g, currentName);
            }

            if (regex) {
              modifiedName = modifiedName.replace(regex, (match) => {
                return modifiedName.replace(
                  /\{([^\}]+)\}/g,
                  (_, expression) => {
                    return processMathExpression(expression, counter);
                  }
                );
              });
            } else {
              modifiedName = modifiedName.replace(
                /\{([^\}]+)\}/g,
                (_, expression) => {
                  return processMathExpression(expression, counter);
                }
              );
            }

            counter++;
            v.set("name", modifiedName);
          });
        });

        menuItemsDiv.appendChild(newDiv);
      });
    }
  }, 5000);
})();
