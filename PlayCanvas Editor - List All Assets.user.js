// ==UserScript==
// @name         PlayCanvas Editor - List All Assets
// @namespace    http://playcanvas.com/
// @version      1.0
// @description  List all assets
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const assetPanel = editor.call('layout.assets');
    const searchInput = assetPanel._searchInput;

    if (!assetPanel || !searchInput) return;

    const BUTTON_ID = 'list-all-assets-btn';
    if (document.getElementById(BUTTON_ID)) {
        document.getElementById(BUTTON_ID).remove();
    }

    const btnListAll = new pcui.Button({
        id: BUTTON_ID,
        text: 'List All',
        class: ['pcui-asset-panel-btn-large'],
    });

    let isListingAll = false;

    btnListAll.on('click', () => {
        isListingAll = !isListingAll;

        if (isListingAll) {
            btnListAll.dom.style.backgroundColor = '#20292b';
            searchInput.value = '*.*';
            searchInput.emit('change', '*.*');
            editor.call('status:text', 'Listing all assets');
        } else {
            btnListAll.dom.style.backgroundColor = '';
            searchInput.value = '';
            searchInput.emit('change', '');
            editor.call('status:text', 'Returned to folder view');
        }
    });

    searchInput.dom.parentNode.insertBefore(btnListAll.dom, searchInput.dom.nextSibling);
})();