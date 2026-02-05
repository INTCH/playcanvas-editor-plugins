// ==UserScript==
// @name         PlayCanvas Editor - Copy Asset ID
// @namespace    http://playcanvas.com/
// @version      1.1
// @description  Adds "Copy ID" option to the asset context menu.
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const PLUGIN_NAME = 'copy-asset-id';

    const waitForEditor = setInterval(() => {
        if (typeof editor !== 'undefined' && editor.call) {
            clearInterval(waitForEditor);
            initPlugin();
        }
    }, 100);

    function initPlugin() {
        editor.once('plugins:load:' + PLUGIN_NAME, () => {
            console.log(`[${PLUGIN_NAME}] Initializing...`);

            editor.call('assets:contextmenu:add', {
                text: 'Copy ID',
                icon: 'E351',

                onIsEnabled: (current) => {
                    let items = [];
                    if (editor.call('selector:type') === 'asset' && editor.call('selector:items').indexOf(current) !== -1) {
                        items = editor.call('selector:items');
                    }
                    return items && items.length > 0;
                },

                onSelect: (current) => {
                    let items = [current];
                    if (editor.call('selector:type') === 'asset' && editor.call('selector:items').indexOf(current) !== -1) {
                        items = editor.call('selector:items');
                    }
                    const selectedAssetIds = items
                        .map(asset => asset.get('id'))
                        .join(', ');

                    if (selectedAssetIds) {
                        navigator.clipboard.writeText(selectedAssetIds)
                            .then(() => {
                                editor.call('status:text', `Copied: ${selectedAssetIds}`);
                            })
                            .catch(err => {
                                console.error("Copy error:", err);
                                editor.call('status:error', 'Failed to copy ID.');
                            });
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
