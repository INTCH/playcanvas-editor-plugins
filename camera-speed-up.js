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

(function() {
const flySpeed = 70;
const flySpeedFast = 250;
let flying=!1;const flyEasing=.5,flyVec=new pc.Vec3,direction=new pc.Vec3;let flyCamera=null,firstUpdate=!1,shiftKey=!1;const vecA=new pc.Vec3,keys={forward:!1,left:!1,back:!1,right:!1,up:!1,down:!1},keyMappings=new Map([["arrowup","forward"],["w","forward"],["arrowleft","left"],["a","left"],["arrowdown","back"],["s","back"],["arrowright","right"],["d","right"],["e","up"],["pageup","up"],["q","down"],["pagedown","down"]]),isInputOrTextarea=e=>/input|textarea/i.test(e.tagName),setKeyState=(e,t)=>{let a=keyMappings.get(e.toLowerCase());a&&(keys[a]=t)},updateDirection=()=>{let e=Number(keys.right)-Number(keys.left),t=Number(keys.up)-Number(keys.down),a=Number(keys.back)-Number(keys.forward);direction.set(e,t,a).normalize()},endFly=()=>{flying&&(Object.keys(keys).forEach(e=>{keys[e]=!1}),flying=!1,editor.call("camera:history:stop",flyCamera),editor.call("viewport:render"))};window.addEventListener("keydown",e=>{!isInputOrTextarea(e.target)&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&keyMappings.has(e.key.toLowerCase())&&(setKeyState(e.key,!0),updateDirection(),flying||(flyCamera=editor.call("camera:current"),editor.call("camera:history:start",flyCamera)),flying=!0,firstUpdate=!0,editor.call("camera:focus:stop"),editor.call("viewport:render"))},!1),window.addEventListener("keyup",e=>{!flying||isInputOrTextarea(e.target)||e.ctrlKey||e.metaKey||e.altKey||(setKeyState(e.key,!1),updateDirection(),Object.values(keys).every(e=>!e)&&endFly())},!1),window.addEventListener("blur",endFly),document.addEventListener("visibilitychange",endFly),editor.on("viewport:update",e=>{let t,a=0;flying&&(a=shiftKey?250:70,a*=firstUpdate?1/60:e,t=editor.call("camera:current"),vecA.copy(direction).scale(a),t.camera.projection===pc.PROJECTION_ORTHOGRAPHIC&&(vecA.y=-vecA.z,vecA.z=0),vecA.length()?(t.getRotation().transformVector(vecA,vecA),flyVec.lerp(flyVec,vecA,Math.min(1,.5*((firstUpdate?1/60:e)/(1/60))))):a=0,editor.call("viewport:render")),flyVec.length()>.01&&(0===a&&flyVec.lerp(flyVec,vecA.set(0,0,0),Math.min(1,.5*((firstUpdate?1/60:e)/(1/60)))),flyVec.length()&&(t=t||editor.call("camera:current")).setPosition(t.getPosition().add(flyVec)),firstUpdate=!1,editor.call("viewport:render"))}),editor.on("hotkey:shift",e=>{shiftKey=e});
})();
