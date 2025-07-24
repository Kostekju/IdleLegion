// Module: coreLogic.js
// Purpose: Handles the game's core loop, timers, and logic updates (e.g., passive production).
// This runs the idle mechanics. Exports functions to start/update the game.
// Detailed comments: Uses timestamps for accurate delta-time calculations in idle games (handles tab inactivity).
// Inexperienced users: To change update frequency, modify the requestAnimationFrame call in startGameLoop.
// Update: Added setLastUpdate for resetting timestamp after loading and calculating offline progress.

import { addRecruits, getSPS } from './resources/soldiers.js';

let lastUpdate = Date.now();

export function updateGame() {
    const now = Date.now();
    const delta = (now - lastUpdate) / 1000;
    const passiveGain = getSPS() * delta;
    addRecruits(passiveGain);
    lastUpdate = now;
}

export function startGameLoop(callback) {
    function loop() {
        updateGame();
        callback();
        requestAnimationFrame(loop);
    }
    loop();
}

export function manualRecruit() {
    addRecruits(1);
}

export function setLastUpdate(val) {
    lastUpdate = val;
}