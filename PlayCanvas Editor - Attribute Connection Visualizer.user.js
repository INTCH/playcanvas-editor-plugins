// ==UserScript==
// @name         PlayCanvas Editor - Attribute Connection Visualizer
// @namespace    http://playcanvas.com/
// @version      1.1
// @description  Visualizes entity relationships defined in script attributes using color-coded connections.
// @author       You
// @match        https://playcanvas.com/editor/scene/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playcanvas.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const app = editor.call('viewport:app');
    if (!app) return;

    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        const hex = "00000".substring(0, 6 - c.length) + c;

        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        return new pc.Color(r, g, b, 1);
    };

    const drawConnections = () => {
        const selection = editor.selection.items;
        if (selection.length === 0) return;

        selection.forEach(item => {
            if (!item.get || !item.has('components.script.scripts')) return;

            const scripts = item.get('components.script.scripts');
            if (!scripts) return;

            const sourceGuid = item.get('resource_id');
            const sourceEntity = app.root.findByGuid(sourceGuid);
            if (!sourceEntity) return;

            const startPos = sourceEntity.getPosition();

            Object.keys(scripts).forEach(scriptName => {
                const scriptData = scripts[scriptName];
                if (!scriptData || !scriptData.attributes) return;

                Object.keys(scriptData.attributes).forEach(attrName => {
                    let attrValue = scriptData.attributes[attrName];

                    if (!Array.isArray(attrValue)) {
                        attrValue = [attrValue];
                    }

                    attrValue.forEach(potentialGuid => {
                        if (typeof potentialGuid !== 'string') return;

                        const targetEntity = app.root.findByGuid(potentialGuid);

                        if (targetEntity) {
                            const endPos = targetEntity.getPosition();

                            const connectionColor = stringToColor(attrName);
                            app.drawLine(startPos, endPos, connectionColor, false);

                            const targetMarkerColor = stringToColor(targetEntity.name);

                            const upOffset = new pc.Vec3(0, 2, 0);
                            const arrowTip = endPos.clone().add(upOffset);

                            app.drawLine(endPos, arrowTip, targetMarkerColor, false);
                        }
                    });
                });
            });
        });
    };

    if (window._attributeConnectionVisualizer) {
        app.off('postrender', window._attributeConnectionVisualizer);
    }

    window._attributeConnectionVisualizer = drawConnections;
    app.on('postrender', drawConnections);

})();