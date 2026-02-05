// ==UserScript==
// @name         PlayCanvas Editor - Copy Path
// @namespace    http://playcanvas.com/
// @version      1.1
// @description  Adds "Copy Path" option to Entity context menu.
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PLUGIN_NAME = 'copy-path-plugin';

    const waitForEditor = setInterval(() => {
        if (typeof editor !== 'undefined' && editor.call) {
            clearInterval(waitForEditor);
            initPlugin();
        }
    }, 100);

    function initPlugin() {
        editor.once('plugins:load:' + PLUGIN_NAME, () => {
             console.log(`[${PLUGIN_NAME}] Initializing...`);

             function getEntityPath(entity) {
                 const names = [];
                 let current = entity;
                 while (current) {
                     names.push(current.get('name'));
                     current = editor.call('entities:get', current.get('parent'));
                 }
                 return JSON.stringify(names.reverse());
             }

             function copyToClipboard(text) {
                 if (!text) return;
                 navigator.clipboard.writeText(text).then(() => {
                     editor.call('status:text', `Copied: ${text}`);
                 }).catch(err => {
                     console.error(err);
                     editor.call('status:error', 'Copy failed');
                 });
             }

             editor.call('entities:contextmenu:add', {
                text: 'Copy Path',
                icon: 'E128',

                onIsEnabled: (items) => items.length === 1,

                onSelect: (items) => {
                    const path = getEntityPath(items[0]);
                    copyToClipboard(path);
                }
            });

        });

        setTimeout(() => {
            if (editor.emit) {
                editor.emit('plugins:load:' + PLUGIN_NAME);
            }
        }, 1000);
    }
})();
