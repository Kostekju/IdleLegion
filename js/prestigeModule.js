// Module: prestigeModule.js
// Purpose: Handles prestige system (reset game for permanent bonuses).
// Now uses resources/prestigePoints.js for all PP state.

import { getRecruits, resetRecruits } from './resources/soldiers.js';
import { setMultiplier, updateSPS } from './resources/soldiers.js';
import { updateUI } from './uiModule.js';
import { saveGame } from './platformAdapter.js';

import {
    getPrestigePoints,
    setPrestigePoints,
    addPrestigePoints,
    spendPrestigePoints
} from './resources/prestigePoints.js';

export function initPrestige() {
    const prestigeButton = document.getElementById('prestige-button');
    prestigeButton.addEventListener('click', () => {
        if (confirm('Prestige? Reset progress for bonus?')) {
            const gained = Math.floor(Math.sqrt(getRecruits()));
            addPrestigePoints(gained); // Use resource module
            resetRecruits();
            applyPrestigeBonus();
            updateUI();
            updateTechTreeUI?.(); // If available, update tech tree UI
            saveGame();
        }
    });
    updatePrestigeButton();
}

function applyPrestigeBonus() {
    // Multiplier: 1 + 0.1 * prestige points
    const newMultiplier = 1 + getPrestigePoints() * 0.1;
    setMultiplier(newMultiplier);
    updateSPS();
    console.log(`Prestige bonus applied: ${newMultiplier}x production (based on ${getPrestigePoints()} points).`);
}

export function updatePrestigeButton() {
    const button = document.getElementById('prestige-button');
    button.disabled = getRecruits() < 100;
}

// For UI display
export function getPrestigePointsForDisplay() {
    return getPrestigePoints();
}

// For tech unlocks and spending
export function spendPrestigePointsAndApplyBonus(amount) {
    if (spendPrestigePoints(amount)) {
        applyPrestigeBonus();
        updateUI();
        saveGame();
        return true;
    }
    return false;
}

// For loading saves
export function setPrestigePointsAndApplyBonus(val) {
    setPrestigePoints(val);
    applyPrestigeBonus();
}