// Module: soldiers.js
// Purpose: Manages the recruit resource, including count, production rates, and costs.

let recruits = 0;
let sps = 0; // Soldiers per second (recruits per second)
let multiplier = 1;

// Producers (auto-generators)
let producers = [
    { name: 'Barracks', cost: 10, production: 0.2, owned: 0 },
    { name: 'Training Camp', cost: 100, production: 2, owned: 0 },
    { name: 'Fortress', cost: 1000, production: 12, owned: 0 }
];

// Specialized units
let units = [
    { name: 'Archer', cost: 50, bonus: 0.5, owned: 0, power: 2 },
    { name: 'Knight', cost: 150, bonus: 2, owned: 0, power: 5 },
    { name: 'Mage', cost: 300, bonus: 4, owned: 0, power: 8 }
];

// --- Core Resource Functions ---

export function getRecruits() {
    return recruits;
}

export function addRecruits(amount) {
    recruits += amount;
}

export function spendRecruits(amount) {
    if (recruits >= amount) {
        recruits -= amount;
        return true;
    }
    return false;
}

export function setRecruits(amount) {
    recruits = amount;
}

// --- Producer Functions ---

export function getProducers() {
    return producers;
}

export function buyProducer(index) {
    const prod = producers[index];
    if (spendRecruits(prod.cost)) {
        prod.owned += 1;
        prod.cost = Math.floor(prod.cost * 1.15);
        updateSPS();
        return true;
    }
    return false;
}

export function setProducers(newProds) {
    producers = newProds;
}

// --- Unit Functions ---

export function getUnits() {
    return units;
}

export function buyUnit(index) {
    const unit = units[index];
    if (spendRecruits(unit.cost)) {
        unit.owned += 1;
        unit.cost = Math.floor(unit.cost * 1.2);
        updateSPS();
        return true;
    }
    return false;
}

export function setUnits(newUnits) {
    // Update existing units in place to preserve reference
    for (let i = 0; i < units.length; i++) {
        if (newUnits[i]) {
            units[i].cost = newUnits[i].cost;
            units[i].owned = newUnits[i].owned;
        }
    }
}

// --- SPS and Multiplier ---

export function getSPS() {
    return sps;
}

export function updateSPS() {
    // Producers
    let total = 0;
    producers.forEach(prod => {
        total += prod.production * prod.owned;
    });
    // Units
    units.forEach(unit => {
        total += unit.bonus * unit.owned;
    });
    sps = total * multiplier;
}

export function getMultiplier() {
    return multiplier;
}

export function setMultiplier(val) {
    multiplier = val;
    updateSPS();
}

// --- Reset/Prestige ---

export function resetRecruits() {
    recruits = 0;
    sps = 0;
    producers.forEach(prod => {
        prod.owned = 0;
        prod.cost = prod.name === 'Barracks' ? 10 : prod.name === 'Training Camp' ? 100 : 1000;
    });
    units.forEach(unit => {
        unit.owned = 0;
        unit.cost = unit.name === 'Archer' ? 50 : unit.name === 'Knight' ? 150 : 300;
    });
    updateSPS();
}

// --- Army Stats ---

export function getTotalUnits() {
    return units.reduce((sum, unit) => sum + unit.owned, 0);
}

export function getArmyPower() {
    return units.reduce((sum, unit) => sum + unit.owned * unit.power, 0);
}