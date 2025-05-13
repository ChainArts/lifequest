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
    // old zero-based level
    const rawLevel = Math.floor((Math.sqrt(1 + xp) - 1) / 2);

    // expose a one-based level
    const level = rawLevel + 1;
    const nextRaw = rawLevel + 1;

    // XP thresholds for rawLevel and nextRaw
    const xpForCurrentLevel = (2 * rawLevel + 1) ** 2 - 1;
    const xpForNextLevel = (2 * nextRaw + 1) ** 2 - 1;

    return {
        level,
        goal: xpForNextLevel - xpForCurrentLevel,
        done: xp - xpForCurrentLevel,
    };
};