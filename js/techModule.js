export const TECH_TIERS = {
    TIER1: 'tier1'
};

export const TECHNOLOGIES = {
    EFFICIENT_RECRUITMENT: {
        id: 'efficient_recruitment',
        name: 'Efficient Recruitment',
        description: 'Reduces manual recruiting cost by 20%',
        tier: TECH_TIERS.TIER1,
        cost: 5,
        effect: 0.8,
        prerequisites: []
    },
    BASIC_TRAINING: {
        id: 'basic_training',
        name: 'Basic Training Drills',
        description: 'Increases base SPS by 10%',
        tier: TECH_TIERS.TIER1,
        cost: 5,
        effect: 1.1,
        prerequisites: []
    },
    IRON_RATIONS: {
        id: 'iron_rations',
        name: 'Iron Rations',
        description: 'Lowers producer cost scaling by 5%',
        tier: TECH_TIERS.TIER1,
        cost: 5,
        effect: 0.95,
        prerequisites: []
    }
};

let unlockedTechs = new Set();

export function isTechUnlocked(techId) {
    return unlockedTechs.has(techId);
}

export function canUnlockTech(techId, prestigePoints) {
    const tech = TECHNOLOGIES[techId];
    if (!tech || isTechUnlocked(techId)) return false;
    
    console.log('Checking tech:', tech.name, {
        hasPoints: prestigePoints >= tech.cost,
        currentPoints: prestigePoints,
        cost: tech.cost
    });
    
    return tech.prerequisites.every(prereq => isTechUnlocked(prereq)) 
        && prestigePoints >= tech.cost;
}

export function unlockTech(techId) {
    if (!TECHNOLOGIES[techId]) {
        console.error('Invalid tech ID:', techId);
        return false;
    }
    unlockedTechs.add(techId);
    console.log('Tech unlocked:', TECHNOLOGIES[techId].name);
    return true;
}

export function getUnlockedTechs() {
    return Array.from(unlockedTechs);
}

export function setUnlockedTechs(techs) {
    unlockedTechs = new Set(techs);
}