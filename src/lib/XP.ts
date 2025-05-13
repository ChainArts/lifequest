export const calulateStreakXP = (streak: number) => {
    const thresholds = [3, 7, 14, 21, 30, 45, 60, 100, 150];
    const baseXP = 10;
    let multiplier = 1;

    if (streak > thresholds[thresholds.length - 1]) return baseXP * thresholds.length;

    for (const threshold of thresholds) {
        if (streak > threshold) {
            multiplier++;
        } else {
            break;
        }
    }

    return baseXP * multiplier;
};

export const calculateLevel = (xp: number) => {
    const level = Math.floor((Math.sqrt(1 + xp) - 1) / 2);

    const nextLevel = level + 1;

    // XP thresholds for current and next level
    const xpForCurrentLevel = ((2 * level + 1) ** 2 - 1);
    const xpForNextLevel = ((2 * nextLevel + 1) ** 2 - 1);

    return {
        level,
        goal: xpForNextLevel - xpForCurrentLevel,
        done: xp - xpForCurrentLevel,
    };
};
