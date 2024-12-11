// ==UserScript==
// @name         PlayCanvas Better Rename
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  PlayCanvas Better Rename
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

          let newName = prompt("Change (e.g. {name}{i+1}):");
          if (newName === null) return;

          const regex = searchPattern ? new RegExp(searchPattern, "g") : null;
          let counter = 1;

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
            let modifiedName = currentName;

            if (regex) {
              modifiedName = modifiedName.replace(regex, (match) => {
                let newReplacement = newName;

                if (newReplacement.includes("{name}")) {
                  newReplacement = newReplacement.replace(/{name}/g, currentName);
                }

                newReplacement = newReplacement.replace(/\{([^\}]+)\}/g, (_, expression) => {
                  return processMathExpression(expression, counter);
                });

                return newReplacement;
              });
            } else {
              modifiedName = newName.replace(/{name}/g, currentName).replace(/\{([^\}]+)\}/g, (_, expression) => {
                return processMathExpression(expression, counter);
              });
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
