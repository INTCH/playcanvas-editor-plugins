// ==UserScript==
// @name         PlayCanvas Editor - Hide Unnecessary Buttons
// @namespace    http://playcanvas.com/
// @version      1.1
// @description  Hides some unnecessary buttons
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const classesToHide = [
        '.pc-icon.github',      // Github
        '.pc-icon.discord',     // Discord
        '.pc-icon.forum',       // Forum
        '.pc-icon.help-howdoi',  // "How do I...?"
        '.pc-icom.help-controls' // Controls
    ];

    classesToHide.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
            el.style.display = 'none';
        }
    });

    const settingsButton = document.querySelector('.pc-icon.editor-settings');

    settingsButton.classList.add('push-top');
})();