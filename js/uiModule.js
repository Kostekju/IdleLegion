// Module: uiModule.js
// Purpose: Handles all UI elements, rendering, and event listeners.
// This keeps UI separate from logic. Exports init and update functions.
// Updated: All references to "soldier" changed to "recruit".
// Handles dynamic creation and updating of producer and unit buttons, as well as UI displays.

import {
    getRecruits,
    getSPS,
    getProducers,
    buyProducer,
    getMultiplier,
    getUnits,
    buyUnit,
    getTotalUnits,
    getArmyPower
} from './resources/soldiers.js';
import { manualRecruit } from './coreLogic.js';
import { updatePrestigeButton, getPrestigePointsForDisplay } from './prestigeModule.js';
import { saveGame } from './platformAdapter.js';
import { TECHNOLOGIES, isTechUnlocked, canUnlockTech, unlockTech, getUnlockedTechs } from './techModule.js';
import { getPrestigePoints, setPrestigePoints, spendPrestigePoints } from './prestigeModule.js';

export function initUI() {
    // Manual recruit button
    const recruitButton = document.getElementById('recruit-button');
    if (recruitButton) {
        recruitButton.addEventListener('click', () => {
            console.log('Manual recruit button clicked. Current recruits:', getRecruits());
            manualRecruit();
            updateUI();
        });
    }

    // Producers
    const producersContainer = document.getElementById('producers');
    if (producersContainer) {
        producersContainer.innerHTML = '';
        getProducers().forEach((prod, index) => {
            const button = document.createElement('button');
            button.textContent = `Buy ${prod.name} (Cost: ${prod.cost}, Owned: ${prod.owned})`;
            button.addEventListener('click', () => {
                console.log(`Producer button clicked: ${prod.name}. Cost: ${prod.cost}, Current recruits: ${getRecruits()}`);
                if (buyProducer(index)) {
                    console.log(`Bought producer: ${prod.name}. New owned: ${prod.owned}`);
                    updateUI();
                } else {
                    console.log(`Failed to buy producer: ${prod.name} - Not enough recruits`);
                }
            });
            producersContainer.appendChild(button);
        });
    }

    // Units
    const unitsButtonContainer = document.querySelector('.unit-buttons');
    if (unitsButtonContainer) {
        unitsButtonContainer.innerHTML = '';
        getUnits().forEach((unit, index) => {
            const button = document.createElement('button');
            button.classList.add('unit-button');
            button.textContent = `Recruit ${unit.name} (Cost: ${unit.cost}, Owned: ${unit.owned}, Bonus: +${unit.bonus} SPS, Power: ${unit.power})`;
            button.disabled = getRecruits() < unit.cost;
            button.addEventListener('click', () => {
                // Only log when user actually clicks
                console.log(`Attempting to recruit ${unit.name}. Cost: ${unit.cost}, Current recruits: ${getRecruits()}`);
                if (buyUnit(index)) {
                    console.log(`Successfully recruited ${unit.name}. New owned: ${unit.owned}`);
                    updateUI();
                } else {
                    console.log(`Failed to recruit ${unit.name} - Not enough recruits`);
                }
            });
            unitsButtonContainer.appendChild(button);
        });
    }

    // Manual save button
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            console.log('Save button clicked.');
            saveGame();
        });
    }

    // Wipe save button
    const wipeButton = document.getElementById('wipe-save-button');
    if (wipeButton) {
        wipeButton.addEventListener('click', () => {
            console.log('Wipe save button clicked.');
            if (confirm('Are you sure you want to wipe all save data and restart the game?')) {
                localStorage.removeItem('armyIdleSave');
                location.reload();
            }
        });
    }

    updateTechTreeUI();
}

export function updateUI() {
    // Update recruit count and stats (no logging needed for regular updates)
    const recruitCount = document.getElementById('recruit-count');
    if (recruitCount) {
        recruitCount.textContent = 
            `Recruits: ${Math.floor(getRecruits())} (SPS: ${getSPS()}, Multiplier: ${getMultiplier().toFixed(2)}x, Prestige Points: ${getPrestigePointsForDisplay()})`;
    }

    // Update army tracker (no logging needed for regular updates)
    const armyTracker = document.getElementById('army-tracker');
    if (armyTracker) {
        armyTracker.textContent =
            `Army: ${getTotalUnits()} units | Total Power: ${getArmyPower()}`;
    }

    // Update units (only log on actual unit purchases)
    const unitsContainer = document.getElementById('units');
    if (unitsContainer) {
        const units = getUnits();
        
        // Update unit buttons
        Array.from(unitsContainer.querySelectorAll('.unit-button')).forEach((button, index) => {
            const unit = units[index];
            if (unit) {
                button.textContent = `Recruit ${unit.name} (Cost: ${unit.cost}, Owned: ${unit.owned}, Bonus: +${unit.bonus} SPS, Power: ${unit.power})`;
                button.disabled = getRecruits() < unit.cost;
            }
        });

        // Update unit stats
        units.forEach((unit, index) => {
            const statDiv = document.getElementById(`${unit.name.toLowerCase()}-stats`);
            if (statDiv) {
                statDiv.textContent = `${unit.name}s: ${unit.owned} (Power: ${unit.power})`;
            }
        });
    }

    // Update producer buttons (no logging needed for regular updates)
    const producerButtons = document.querySelectorAll('#producers button');
    const producers = getProducers();
    producerButtons.forEach((button, index) => {
        const prod = producers[index];
        button.textContent = `Buy ${prod.name} (Cost: ${prod.cost}, Owned: ${prod.owned})`;
        button.disabled = getRecruits() < prod.cost;
    });

    updatePrestigeButton();
}

export function updateTechTreeUI() {
    const tier1Div = document.getElementById('tier1-techs');
    if (!tier1Div) {
        console.error('Tech tree container not found!');
        return;
    }
    
    tier1Div.innerHTML = '';
    console.log('Current Prestige Points:', getPrestigePoints());

    Object.values(TECHNOLOGIES).forEach(tech => {
        if (tech.tier !== 'tier1') return;
        
        const btn = document.createElement('button');
        btn.className = 'tech-button';
        btn.textContent = `${tech.name} (${tech.cost} PP)`;
        btn.title = tech.description;
        
        const canUnlock = canUnlockTech(tech.id, getPrestigePoints());
        const isUnlocked = isTechUnlocked(tech.id);

        btn.disabled = isUnlocked || !canUnlock;
        if (isUnlocked) btn.classList.add('unlocked');

        btn.addEventListener('click', () => {
            console.log('Tech button clicked:', tech.name);
            if (canUnlockTech(tech.id, getPrestigePoints())) {
                if (spendPrestigePoints(tech.cost)) {
                    if (unlockTech(tech.id)) {
                        console.log('Tech unlocked successfully');
                        updateTechTreeUI();
                        updateUI();
                    }
                } else {
                    console.log('Not enough prestige points to unlock tech');
                }
            }
        });

        tier1Div.appendChild(btn);
    });
}