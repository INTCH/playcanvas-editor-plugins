// ==UserScript==
// @name         PlayCanvas Editor - Viewport Entity Attribute Select
// @namespace    http://playcanvas.com/
// @version      1.1
// @description  Select entity attribute from viewport
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const PLUGIN_NAME = 'viewport-entity-select';

    const waitForEditor = setInterval(() => {
        if (typeof editor !== 'undefined' && editor.call) {
            clearInterval(waitForEditor);
            initPlugin();
        }
    }, 100);

    function initPlugin() {
        if (editor._pick_hooks_ready) return;
        editor._pick_hooks_ready = true;

        console.log(`[${PLUGIN_NAME}] Ready.`);

        let currentHoveredNode = null;
        let pickerShield = null;

        // --- SHIELD & UI OLUŞTURMA ---
        function createShield() {
            // Ana Kap (Shield) - Tam Ekran Kaplayıcı
            const div = document.createElement('div');
            Object.assign(div.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                zIndex: '999999',
                background: 'rgba(0, 100, 0, 0.05)', // Çok hafif bir yeşil ton
                cursor: 'crosshair', // + İmleci
                display: 'none'
            });
            div.id = 'picker-shield-click';

            // Kapat Butonu (X) - En Sağ Üstte
            const closeBtn = document.createElement('div');
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '32px',
                height: '32px',
                background: '#e53935', // Kırmızı
                color: 'white',
                borderRadius: '4px', // Yuvarlak değil de hafif kare daha profesyonel durur
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                userSelect: 'none',
                pointerEvents: 'auto',
                zIndex: '1000000'
            });
            closeBtn.innerHTML = '✕'; // Çarpı işareti
            closeBtn.title = 'Cancel Picker';

            // Hover efekti
            closeBtn.onmouseenter = () => closeBtn.style.background = '#ff5252';
            closeBtn.onmouseleave = () => closeBtn.style.background = '#e53935';

            closeBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.emit('picker:entity:close'); // Kapatma komutu
            });

            // Bilgi Kutucuğu (Butonun solunda)
            const infoText = document.createElement('div');
            Object.assign(infoText.style, {
                position: 'absolute',
                top: '10px',
                right: '50px', // Butonun solunda
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                background: 'rgba(0,0,0,0.6)',
                padding: '0 12px',
                borderRadius: '4px',
                pointerEvents: 'none',
                fontSize: '13px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                whiteSpace: 'nowrap'
            });
            infoText.innerText = 'Select Object...';

            // Shield Tıklaması (Seçim)
            div.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // Sadece sol tık

                e.preventDefault();
                e.stopPropagation();

                if (currentHoveredNode) {
                    const guid = currentHoveredNode.getGuid();
                    const editorEntity = editor.call('entities:get', guid);

                    if (editorEntity) {
                        editor.emit('picker:entity', editorEntity);
                    }
                }
            });

            // Mouse Hareketini Editöre İlet
            div.addEventListener('mousemove', (e) => {
                editor.emit('viewport:mouse:move', { x: e.clientX, y: e.clientY });
            });

            div.appendChild(infoText);
            div.appendChild(closeBtn);
            document.body.appendChild(div);
            return div;
        }

        pickerShield = createShield();

        // --- HOOKS ---

        const originalCall = editor.call;
        editor.call = function (name, ...args) {
            if (name === 'picker:entity') {
                isPickerActive(true);
            }
            return originalCall.apply(editor, [name, ...args]);
        };

        const originalEmit = editor.emit;
        editor.emit = function (name, ...args) {
            if (name === 'picker:entity' || name === 'picker:entity:close') {
                isPickerActive(false);
            }
            return originalEmit.apply(editor, [name, ...args]);
        };

        function isPickerActive(active) {
            if (active) {
                if (pickerShield) pickerShield.style.display = 'block';
                editor.call('status:text', 'PICKER MODE: Click to Select');
            } else {
                if (pickerShield) pickerShield.style.display = 'none';

                const txt = editor.call('status:text');
                if (txt && (txt.startsWith('PICKER MODE') || txt.startsWith('Pick Target'))) {
                    editor.call('status:text', '');
                }
                currentHoveredNode = null;
            }
        }

        // --- HOVER ---
        editor.on('viewport:pick:hover', (node) => {
            if (pickerShield.style.display === 'none') return;

            if (node && node instanceof pc.Entity) {
                currentHoveredNode = node;
                editor.call('status:text', `Pick Target: ${node.name}`);

                // İsteğe bağlı: Üzerine gelince imleç değişebilir,
                // ya da sabit crosshair kalabilir.
                // pickerShield.style.cursor = 'crosshair';
            } else {
                currentHoveredNode = null;
                editor.call('status:text', 'PICKER MODE: Click to Select');
            }
        });

        // Load
        setTimeout(() => { if (editor.emit) editor.emit('plugins:load:' + PLUGIN_NAME); }, 500);
    }
})();