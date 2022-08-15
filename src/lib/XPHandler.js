/**
 * Calculate the totalXP given level
 * @param {number} level - level
 * @returns {number} - Total XP for a given level
 */
exports.calcXPFromLevel = function(level) {
  return Math.floor(-2550*(1 - Math.pow(1.02, level)));
};


/**
 * Calculate the level given totalXP
 * @param {number} xp - total XP
 * @returns {number} - Level given by totalXP
 */
exports.calcLevelFromXP = function(xp) {
  return Math.floor(Math.log(1/2550*xp + 1) / Math.log(1.02));
};

/**
 * Calculate difference in level of two XPs
 * @param {number} oldXP
 * @param {number} newXP
 * @return {number} levelDifference
 */
exports.levelDiff = function(oldXP, newXP) {
  return Math.max(exports.calcLevelFromXP(newXP) -
      exports.calcLevelFromXP(oldXP), 0);
};