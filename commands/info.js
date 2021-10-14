/**
 * @file Minecraft Bedrock Utils - Info command
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const fs = require('fs');
const { defaultPath, fileFinderUtils } = require('minecraft-utils-shared');

const manifest = require('../utils/manifest.js');

/**
 * @param {String} search_path
 */
const showInfo = (search_path = defaultPath.project.path) => {
  let behaviorPackPath = defaultPath.bedrock.behaviorPack;
  let resourcePackPath = defaultPath.bedrock.resourcePack;
  if (search_path != defaultPath.project.path) {
    behaviorPackPath = fileFinderUtils.getBehaviorPackInSearchPath(search_path);
    resourcePackPath = fileFinderUtils.getResourcePackInSearchPath(search_path);
  }
  if (!fs.existsSync(behaviorPackPath) && !fs.existsSync(resourcePackPath)) {
    console.error(
      chalk.red(
        'Unable to find any valid behavior or resource pack at',
        search_path
      )
    );
    console.info(
      `\nTip: Use "${chalk.green(
        'npx minecraft-bedrock-utils new'
      )}" to create a new behavior and/or resource pack.\n`
    );
    return;
  }
  if (fs.existsSync(behaviorPackPath)) {
    const behaviorPackInfo = manifest.readManifest(behaviorPackPath);
    console.log(
      chalk.red('\n[Behavior Pack]', behaviorPackPath),
      behaviorPackInfo.header
    );
  }
  if (fs.existsSync(resourcePackPath)) {
    const resourcePackInfo = manifest.readManifest(resourcePackPath);
    console.log(
      chalk.green('\n[Resource Pack]', behaviorPackPath),
      resourcePackInfo.header
    );
  }
};

exports.showInfo = showInfo;
