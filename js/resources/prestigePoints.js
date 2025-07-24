let prestigePoints = 0;

export function getPrestigePoints() {
    return prestigePoints;
}

export function setPrestigePoints(val) {
    prestigePoints = val;
}

export function addPrestigePoints(amount) {
    prestigePoints += amount;
}

export function spendPrestigePoints(amount) {
    if (prestigePoints >= amount && amount > 0) {
        prestigePoints -= amount;
        return true;
    }
    return false;
}