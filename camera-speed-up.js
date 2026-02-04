// ==UserScript==
// @name         Playcanvas Editor Camera Speed Up
// @namespace    http://tampermonkey.net/
// @version      2025-03-05
// @description  Playcanvas Editor Camera Speed Up
// @author       You
// @match        https://playcanvas.com/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    window.flyCamSpeedMultiplier = 1.0;

    if (window._flyCamBoosterFunc) {
        editor.off('viewport:update', window._flyCamBoosterFunc);
    }

    window._flyCamBoosterFunc = (dt) => {
        if (window.flyCamSpeedMultiplier <= 1.0) return;

        const pressedKeys = window._flyCamKeys || new Set();
        if (pressedKeys.size === 0) return;

        const camera = editor.call('camera:current');
        if (!camera) return;

        let extraSpeed = 7 * (window.flyCamSpeedMultiplier - 1) * dt;
        if (pressedKeys.has('shift')) extraSpeed *= 2.5;

        const flyVec = new pc.Vec3();
        if (pressedKeys.has('w')) flyVec.z -= extraSpeed;
        if (pressedKeys.has('s')) flyVec.z += extraSpeed;
        if (pressedKeys.has('a')) flyVec.x -= extraSpeed;
        if (pressedKeys.has('d')) flyVec.x += extraSpeed;
        if (pressedKeys.has('e')) flyVec.y += extraSpeed;
        if (pressedKeys.has('q')) flyVec.y -= extraSpeed;

        if (flyVec.lengthSq() > 0) {
            camera.translateLocal(flyVec);
            editor.call('viewport:render');
        }
    };

    window._flyCamKeys = new Set();
    const onKeyDown = (e) => { if (!/input|textarea/i.test(e.target.tagName)) window._flyCamKeys.add(e.key.toLowerCase()); };
    const onKeyUp = (e) => { window._flyCamKeys.delete(e.key.toLowerCase()); };

    window.removeEventListener('keydown', window._flyCamBoosterKeyDown);
    window.removeEventListener('keyup', window._flyCamBoosterKeyUp);
    window._flyCamBoosterKeyDown = onKeyDown;
    window._flyCamBoosterKeyUp = onKeyUp;
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    editor.on('viewport:update', window._flyCamBoosterFunc);




    setTimeout(() => {

        const panels = document.querySelectorAll(".settings-panel");
        const level1 = panels[1];
        if (!level1) return;
        const level2 = level1.children[1];
        if (!level2) return;
        const finalTarget = level2.children[0];
        if (!finalTarget) return;


        const oldSlider = document.getElementById("custom-cam-wrapper");
        if (oldSlider) oldSlider.remove();


        const wrapperDiv = document.createElement("div");
        wrapperDiv.id = "custom-cam-wrapper";


        wrapperDiv.style.cssText = `
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 12px;
            color: #b1b8ba;
            margin: 3px 10px;
        `;


        wrapperDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span id="cam-label" style="min-width: 120px; white-space: nowrap;">
                    Camera Speed (x${window.flyCamSpeedMultiplier})
                </span>

                <input type="range" id="cam-input"
                       min="1" max="100" step="1" value="${window.flyCamSpeedMultiplier}"
                       style="flex-grow: 1; cursor: pointer; height: 4px;">
            </div>
        `;


        finalTarget.appendChild(wrapperDiv);

        const input = wrapperDiv.querySelector("#cam-input");
        const label = wrapperDiv.querySelector("#cam-label");

        input.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            window.flyCamSpeedMultiplier = val;


            label.textContent = `Camera Speed (x${val})`;
        });

    }, 5000);
})();
