// Module: uiModule.js
// Purpose: Handles all UI elements, rendering, and event listeners.

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
import { updatePrestigeButton, getPrestigePointsForDisplay, spendPrestigePointsAndApplyBonus } from './prestigeModule.js';
import { saveGame, wipeSave } from './platformAdapter.js';
import { TECHNOLOGIES, isTechUnlocked, canUnlockTech, unlockTech, getUnlockedTechs } from './techModule.js';
import { getPrestigePoints } from './resources/prestigePoints.js';

export function initUI() {
    // Manual recruit button
    const recruitButton = document.getElementById('recruit-button');
    if (recruitButton) {
        recruitButton.addEventListener('click', () => {
            manualRecruit();
            updateUI();
        });
    }

    // Save button
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            saveGame();
        });
    }

    // Wipe save button
    const wipeButton = document.getElementById('wipe-save-button');
    if (wipeButton) {
        wipeButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to wipe all save data and restart the game?')) {
                wipeSave();
                location.reload();
            }
        });
    }

    updateUI();
    updateTechTreeUI();
}

export function updateUI() {
    // Recruit count
    const recruitCount = document.getElementById('recruit-count');
    if (recruitCount) {
        recruitCount.textContent = `Recruits: ${getRecruits()} (+${getSPS()}/s, x${getMultiplier()} bonus)`;
    }

    // Army tracker
    const armyTracker = document.getElementById('army-tracker');
    if (armyTracker) {
        armyTracker.textContent = `Army Power: ${getArmyPower()} | Total Units: ${getTotalUnits()}`;
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
                if (buyUnit(index)) {
                    updateUI();
                }
            });
            unitsButtonContainer.appendChild(button);
        });
    }

    // Producers
    const producersContainer = document.getElementById('producers');
    if (producersContainer) {
        producersContainer.innerHTML = '<h2>Training Facilities</h2>';
        getProducers().forEach((prod, index) => {
            const button = document.createElement('button');
            button.textContent = `Buy ${prod.name} (Cost: ${prod.cost}, Owned: ${prod.owned})`;
            button.disabled = getRecruits() < prod.cost;
            button.addEventListener('click', () => {
                if (buyProducer(index)) {
                    updateUI();
                }
            });
            producersContainer.appendChild(button);
        });
    }

    // Prestige points display
    const prestigeDisplay = document.getElementById('prestige-points');
    if (prestigeDisplay) {
        prestigeDisplay.textContent = `Prestige Points: ${getPrestigePointsForDisplay()}`;
    }

    updatePrestigeButton();
}

export function updateTechTreeUI() {
    const tier1Div = document.getElementById('tier1-techs');
    if (!tier1Div) {
        console.error('Tech tree container not found!');
        return;
    }
    
    tier1Div.innerHTML = '';
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
            if (canUnlockTech(tech.id, getPrestigePoints())) {
                if (spendPrestigePointsAndApplyBonus(tech.cost)) {
                    if (unlockTech(tech.id)) {
                        updateTechTreeUI();
                        updateUI();
                        saveGame();
                    }
                } else {
                    alert('Not enough prestige points to unlock this technology.');
                }
            }
        });

        tier1Div.appendChild(btn);
    });
}