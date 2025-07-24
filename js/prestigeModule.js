// Module: prestigeModule.js
// Purpose: Handles prestige system (reset game for permanent bonuses). Basic stub.
// In idle games, prestige gives multipliers after reset.
// Detailed comments: Calculates bonus based on total soldiers earned (not implemented fully).
// Inexperienced users: To enable prestige earlier, change the condition in updatePrestigeButton.
// Update: Added get/setPrestigePoints for saving/loading, and call saveGame after reset to persist new points.
// New: Made applyPrestigeBonus() actually update the multiplier in soldiers.js (e.g., +10% per point). No browser refresh needed—UI updates automatically.
// Note: Multiplier is now always derived from points, ensuring consistent bonuses without save conflicts.

import { getRecruits, resetRecruits } from './resources/soldiers.js';
import { setMultiplier, getMultiplier, updateSPS } from './resources/soldiers.js';
import { updateUI } from './uiModule.js';
import { saveGame } from './platformAdapter.js';

let prestigePoints = 0; // Accumulated points for bonuses.

export function initPrestige() {
    const prestigeButton = document.getElementById('prestige-button');
    prestigeButton.addEventListener('click', () => {
        if (confirm('Prestige? Reset progress for bonus?')) {
            prestigePoints += Math.floor(Math.sqrt(getRecruits())); // Basic formula: sqrt of soldiers as points.
            resetRecruits(); // Reset resources.
            applyPrestigeBonus(); // Apply bonus (now real).
            updateUI(); // Refresh UI—no browser reload needed.
            saveGame(); // New: Save immediately after prestige to persist new points and multiplier.
        }
    });
    updatePrestigeButton(); // Initial check.
}

function applyPrestigeBonus() {
    // New: Actually calculate and set multiplier (1 + 0.1 * points). Inexperienced users: Change 0.1 to adjust bonus strength (e.g., 0.05 for weaker).
    const newMultiplier = 1 + prestigePoints * 0.1;
    setMultiplier(newMultiplier);
    updateSPS(); // Ensure SPS reflects new multiplier.
    console.log(`Prestige bonus applied: ${newMultiplier}x production (based on ${prestigePoints} points).`);
}

export function updatePrestigeButton() {
    const button = document.getElementById('prestige-button');
    button.disabled = getRecruits() < 100; // Enable only after 100 soldiers.
    // Call this in updateUI if needed for dynamic checks.
}

// New: Get current prestige points (for saving).
// Inexperienced users: Use this to access points outside this module.
export function getPrestigePoints() {
    return prestigePoints;
}

// New: Set prestige points (for loading saves).
// Inexperienced users: This overrides the value; use only during load.
export function setPrestigePoints(val) {
    prestigePoints = val;
    applyPrestigeBonus(); // New: Reapply bonus after setting points (for load consistency).
}

// New: Export for UI display.
// Inexperienced users: Call this to show points in custom UI elements.
export function getPrestigePointsForDisplay() {
    return prestigePoints;
}

export function spendPrestigePoints(amount) {
    if (prestigePoints >= amount) {
        prestigePoints -= amount;
        applyPrestigeBonus();
        return true;
    }
    return false;
}