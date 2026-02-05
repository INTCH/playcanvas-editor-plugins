// ==UserScript==
// @name         PlayCanvas Editor - Better Rename
// @namespace    http://playcanvas.com/
// @version      1.1
// @description  Advanced renaming tool with Regex and variable support for Entities and Assets.
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const PLUGIN_NAME = 'better-rename-plugin';

    const waitForEditor = setInterval(() => {
        if (typeof editor !== 'undefined' && editor.call) {
            clearInterval(waitForEditor);
            initPlugin();
        }
    }, 100);

    function initPlugin() {
        editor.once('plugins:load:' + PLUGIN_NAME, () => {
            console.log(`[${PLUGIN_NAME}] Started.`);

            const performRename = (items) => {
                if (!items || items.length === 0) return;

                const searchPattern = prompt(
                    "Search (regex or plain text, leave blank to replace entire name):"
                );
                if (searchPattern === null) return;

                const newName = prompt("Replace with (e.g. Enemy_{i+1}, {name}_bak):");
                if (newName === null) return;

                const regex = searchPattern ? new RegExp(searchPattern, "g") : null;
                let counter = 1;

                function processMathExpression(expression, index) {
                    try {
                        return new Function('i', `return ${expression}`)(index);
                    } catch (e) {
                        console.error("Math Error:", expression);
                        return index;
                    }
                }

                if (editor.call('selector:type') === 'asset') {
                    items = editor.selection.items
                }

                items.forEach((item) => {
                    let currentName = item.get("name");
                    let modifiedName = "";

                    const replacer = (baseStr) => {
                        let result = newName;

                        if (result.includes("{name}")) {
                            result = result.replace(/{name}/g, baseStr);
                        }

                        result = result.replace(/\{([^\}]+)\}/g, (_, expression) => {
                            if (expression === 'name') return baseStr;
                            return processMathExpression(expression, counter);
                        });

                        return result;
                    };

                    if (regex) {
                        modifiedName = currentName.replace(regex, (match) => {
                            return replacer(match);
                        });
                    } else {
                        modifiedName = replacer(currentName);
                    }

                    item.set("name", modifiedName);
                    counter++;
                });
            };

            const menuOptions = {
                text: 'Better Rename',
                icon: 'E130',
                onIsEnabled: (items) => items && items.length > 0,
                onSelect: (items) => performRename(items)
            };

            editor.call('entities:contextmenu:add', menuOptions);
            editor.call('assets:contextmenu:add', menuOptions);
        });

        setTimeout(() => {
            if (editor.emit) editor.emit('plugins:load:' + PLUGIN_NAME);
        }, 1000);
    }
})();
