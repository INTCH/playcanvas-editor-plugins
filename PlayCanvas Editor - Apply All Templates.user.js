// ==UserScript==
// @name         PlayCanvas Editor - Apply All Templates
// @namespace    http://playcanvas.com/
// @version      1.1
// @description  Adds "Apply All Templates" to the entity context menu for applying changes to multiple selected templates at once.
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PLUGIN_NAME = 'apply-all-templates';

    const waitForEditor = setInterval(() => {
        if (typeof editor !== 'undefined' && editor.call) {
            clearInterval(waitForEditor);
            initPlugin();
        }
    }, 100);

    function initPlugin() {
        editor.once('plugins:load:' + PLUGIN_NAME, () => {
             console.log(`[${PLUGIN_NAME}] Initializing...`);

             editor.call('entities:contextmenu:add', {
                text: 'Apply All Templates',
                icon: 'E133',

                onIsEnabled: (items) => {
                    return items.length > 0 && items.some(item => item.get('template_id'));
                },

                onSelect: (items) => {
                     let count = 0;
                     items.forEach((item) => {
                         if (item.get('template_id')) {
                             editor.call('templates:apply', item);
                             count++;
                         }
                     });

                     if (count > 0) {
                         editor.call('status:text', `Apply operation started for ${count} templates.`);
                     }
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