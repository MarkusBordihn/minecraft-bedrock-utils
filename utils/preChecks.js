/**
 * @file Minecraft Bedrock Utils - Pre-checks lib
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const compareVersions = require('compare-versions');
const { fileFinderUtils } = require('minecraft-utils-shared');

/**
 * @return {boolean}
 */
const errorExistingBehaviorPack = () => {
  const behaviorPackPath = fileFinderUtils.getBehaviorPackInSearchPath();
  if (behaviorPackPath) {
    console.error(
      chalk.red('Found already existing behavior pack under', behaviorPackPath)
    );
    return true;
  }
  return false;
};

/**
 * @return {boolean}
 */
const errorExistingResourcePack = () => {
  const resourcePackPath = fileFinderUtils.getResourcePackInSearchPath();
  if (resourcePackPath) {
    console.error(
      chalk.red('Found already existing resource pack under', resourcePackPath)
    );
    return true;
  }
  return false;
};

/**
 * @return {boolean}
 */
const errorExistingPack = () => {
  const hasExistingBehaviorPack = errorExistingBehaviorPack();
  const hasExistingResourcePack = errorExistingResourcePack();

  if (hasExistingBehaviorPack || hasExistingResourcePack) {
    return true;
  }
  return false;
};

/**
 * @return {boolean}
 */
const errorNonExistingBehaviorPack = () => {
  const behaviorPackPath = fileFinderUtils.getBehaviorPackInSearchPath();
  if (!behaviorPackPath) {
    console.error(chalk.red('Found no existing behavior pack!'));
    return true;
  }
  return false;
};

/**
 * @return {boolean}
 */
const errorNonExistingResourcePack = () => {
  const resourcePackPath = fileFinderUtils.getResourcePackInSearchPath();
  if (!resourcePackPath) {
    console.error(chalk.red('Found no existing resource pack!'));
    return true;
  }
  return false;
};

/**
 * @return {boolean}
 */
const errorNonExistingPack = () => {
  const hasExistingBehaviorPack = errorNonExistingBehaviorPack();
  const hasExistingResourcePack = errorNonExistingResourcePack();

  if (hasExistingBehaviorPack || hasExistingResourcePack) {
    return true;
  }
  return false;
};

/**
 * @param {String} version
 * @return {boolean}
 */
const warnExperimentalVersion = (version) => {
  if (compareVersions.compare(version, '1.16.100', '>=')) {
    console.warn(`\n⚠️ Note: The format version ${version} requires to enable the "Holiday Creator Features" under Experiments!
See: https://feedback.minecraft.net/hc/en-us/articles/4403610710797\n`);
    return true;
  }
  return false;
};

exports.errorExistingPack = errorExistingPack;
exports.errorNonExistingBehaviorPack = errorNonExistingBehaviorPack;
exports.errorNonExistingPack = errorNonExistingPack;
exports.warnExperimentalVersion = warnExperimentalVersion;
