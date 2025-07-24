// Module: platformAdapter.js
// Purpose: Adapts game for different platforms (e.g., web, mobile). Basic stub for now.
// In future, handle touch vs click events or screen sizes here.
// Detailed comments: Currently detects if mobile for potential adjustments.
// Inexperienced users: To add mobile-specific code, expand the if (isMobile) block.
// Update: Added saveGame and loadGame using localStorage (web platform storage). This handles persistence locally.
// Imports getters for state collection. Key: Uses JSON to serialize/deserialize state for storage.
// New: Added multiplier to saved state (similar to producers) for persistence across sessions.
// Fix: Removed multiplier from save (now derived from points to prevent load overrides and inconsistencies).
// New Feature: Added units to saved state (similar to producers) for persistence across sessions.

import { getRecruits, getProducers, getSPS, getMultiplier, getUnits } from './resources/soldiers.js';
import { getPrestigePoints } from './prestigeModule.js';
import { getUnlockedTechs } from './techModule.js'; // Import the new getter

export function initPlatform() {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
        console.log('Mobile platform detected.');
    } else {
        console.log('Desktop platform detected.');
    }
}

// New: Save game state to localStorage.
// Collects current state and stores as JSON. Called auto every 30s or after prestige.
// Inexperienced users: Change 'armyIdleSave' to a different key if you want multiple save slots.
export function saveGame() {
    try {
        const state = {
            recruits: getRecruits(),
            producers: getProducers().map(prod => ({ ...prod })), // Copy each producer object to avoid reference issues.
            units: getUnits().map(unit => ({ ...unit })), // New: Copy units similarly for save.
            prestigePoints: getPrestigePoints(),
            unlockedTechs: getUnlockedTechs(), // Add this line
            lastSaveTime: Date.now() // Timestamp for offline calculation on next load.
            // Removed: multiplier (now computed from points on load/prestige).
        };
        
        localStorage.setItem('armyIdleSave', JSON.stringify(state)); // Serialize to string for storage.
        console.log('Game saved successfully.', {
            recruits: state.recruits,
            producers: state.producers.length,
            units: state.units.length
        }); // Optional log for debugging.
    } catch (error) {
        console.error('Failed to save game:', error);
    }
}

// New: Load game state from localStorage.
// Returns parsed state or null if no save. Setting happens in main.js.
// Inexperienced users: If storage fails (e.g., private mode), it gracefully returns null (new game).
export function loadGame() {
    try {
        const saved = localStorage.getItem('armyIdleSave');
        if (!saved) {
            console.log('No save data found, starting new game.');
            return null;
        }

        const state = JSON.parse(saved);
        
        // Validate loaded data
        if (!state || typeof state !== 'object') {
            console.error('Invalid save data format');
            return null;
        }

        console.log('Game loaded successfully.', {
            recruits: state.recruits,
            producers: state.producers?.length || 0,
            units: state.units?.length || 0
        });

        return state;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
}

export function wipeSave() {
    try {
        localStorage.removeItem('armyIdleSave');
        console.log('Save data wiped successfully.');
        return true;
    } catch (error) {
        console.error('Failed to wipe save:', error);
        return false;
    }
}

// New: Export a function to check if there's a save
export function hasSaveData() {
    return localStorage.getItem('armyIdleSave') !== null;
}