// Module: main.js
// Purpose: Entry point of the game. Initializes modules and starts everything.
// This ties all modules together. No game logic here— just orchestration.
// Detailed comments: Loads when DOM is ready. Imports from other modules.
// Inexperienced users: If adding new modules, import them here and call their init functions.
// Update: Added loadGame logic before init (restores state and calculates offline progress). Set up auto-save interval.
// New: Restore multiplier on load, import setMultiplier.
// Fix: Removed setMultiplier from load (now handled by setPrestigePoints). Adjusted order: Set producers before points for full SPS calc.
// New Feature: Added setUnits on load to restore specialized units.

import { startGameLoop, setLastUpdate } from './coreLogic.js'; // Updated: Added setLastUpdate import.
import { initUI, updateUI } from './uiModule.js';
import { initPrestige } from './prestigeModule.js';
import { initPlatform, loadGame, saveGame } from './platformAdapter.js'; // Updated: Added loadGame and saveGame imports.
import { setRecruits, setProducers, updateSPS, addRecruits, getSPS, setMultiplier, setUnits, getUnits } from './resources/soldiers.js'; // Add getUnits import
import { setPrestigePoints } from './prestigeModule.js'; // New: Import for setting prestige on load.
import { setUnlockedTechs } from './techModule.js'; // Add this import

// Wait for DOM to load before initializing.
document.addEventListener('DOMContentLoaded', () => {
    initPlatform(); // Setup platform-specific (stub for now).

    // New: Load saved state if exists.
    const state = loadGame();
    if (state) {
        setRecruits(state.recruits || 0);
        setProducers(state.producers || []);
        // Make sure we have units, or use defaults
        if (state.units && state.units.length > 0) {
            setUnits(state.units);
        }
        if (state.unlockedTechs) { // Add this block
            setUnlockedTechs(state.unlockedTechs);
        }
        setPrestigePoints(state.prestigePoints || 0); // Restore prestige (this applies bonus/multiplier). Fallback to 0 for old saves.
        updateSPS(); // Recalculate SPS after producers, units, and multiplier set.
        const now = Date.now();
        const delta = (now - state.lastSaveTime) / 1000; // Time offline in seconds.
        addRecruits(getSPS() * delta); // Add offline passive gains (uses boosted SPS).
        setLastUpdate(now); // Sync game clock.
        console.log(`Loaded save. Added ${Math.floor(getSPS() * delta)} offline recruits.`); // Debug log.
    }

    initUI(); // Setup buttons and displays.
    initPrestige(); // Setup prestige button.
    startGameLoop(updateUI); // Start loop, with UI update as callback.

    // New: Auto-save every 30 seconds.
    // Inexperienced users: Change 30000 to adjust interval (e.g., 60000 for 1 minute).
    setInterval(saveGame, 30000);
});