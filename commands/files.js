/**
 * @file Minecraft Bedrock Utils - Files command
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { defaultPath } = require('minecraft-utils-shared');

const copyBehaviorFiles = () => {
  if (
    defaultPath.bedrock.behaviorPack &&
    defaultPath.bedrock.client.behaviorPacks
  ) {
    const srcDir = defaultPath.bedrock.behaviorPack;
    const targetDir = path.join(
      defaultPath.bedrock.client.behaviorPacks,
      path.basename(srcDir)
    );
    if (fs.existsSync(targetDir)) {
      console.log('Cleaning existing directory before copy...');
      fs.emptyDirSync(targetDir);
    }
    console.log(
      chalk.green('Copy behavior pack from', srcDir, 'to', targetDir, '...')
    );
    fs.copySync(srcDir, targetDir);
    return true;
  } else {
    console.warn(
      chalk.yellow(
        'Unable to find behavior pack in working / development path !'
      )
    );
  }
  return false;
};

const copyResourceFiles = () => {
  if (
    defaultPath.bedrock.resourcePack &&
    defaultPath.bedrock.client.resourcePacks
  ) {
    const srcDir = defaultPath.bedrock.resourcePack;
    const targetDir = path.join(
      defaultPath.bedrock.client.resourcePacks,
      path.basename(srcDir)
    );
    if (fs.existsSync(targetDir)) {
      console.log('Cleaning existing directory before copy...');
      fs.emptyDirSync(targetDir);
    }
    console.log(
      chalk.green('Copy resource pack from', srcDir, 'to', targetDir, '...')
    );
    fs.copySync(srcDir, targetDir);
    return true;
  } else {
    console.warn(
      chalk.yellow(
        'Unable to find resource pack in working / development path !'
      )
    );
  }
  return false;
};

const copyFiles = () => {
  const resourcePackResult = copyResourceFiles();
  const behaviorPackResult = copyBehaviorFiles();
  return resourcePackResult || behaviorPackResult;
};

const copyBehaviorDevelopmentFiles = () => {
  if (
    defaultPath.bedrock.behaviorPack &&
    defaultPath.bedrock.client.developmentBehaviorPacks
  ) {
    const srcDir = defaultPath.bedrock.behaviorPack;
    const targetDir = path.join(
      defaultPath.bedrock.client.developmentBehaviorPacks,
      path.basename(srcDir)
    );
    if (fs.existsSync(targetDir)) {
      console.log('Cleaning existing directory before copy...');
      fs.emptyDirSync(targetDir);
    }
    console.log(
      chalk.green('Copy behavior pack from', srcDir, 'to', targetDir, '...')
    );
    fs.copySync(srcDir, targetDir);
    return true;
  } else {
    console.warn(
      chalk.yellow(
        'Unable to find behavior pack in working / development path !'
      )
    );
  }
  return false;
};

const copyResourceDevelopmentFiles = () => {
  if (
    defaultPath.bedrock.resourcePack &&
    defaultPath.bedrock.client.developmentResourcePacks
  ) {
    const srcDir = defaultPath.bedrock.resourcePack;
    const targetDir = path.join(
      defaultPath.bedrock.client.developmentResourcePacks,
      path.basename(srcDir)
    );
    if (fs.existsSync(targetDir)) {
      console.log('Cleaning existing directory before copy...');
      fs.emptyDirSync(targetDir);
    }
    console.log(
      chalk.green('Copy resource pack from', srcDir, 'to', targetDir, '...')
    );
    fs.copySync(srcDir, targetDir);
    return true;
  } else {
    console.warn(
      chalk.yellow(
        'Unable to find resource pack in working / development path !'
      )
    );
  }
  return false;
};

const copyDevelopmentFiles = () => {
  const resourcePackResult = copyResourceDevelopmentFiles();
  const behaviorPackResult = copyBehaviorDevelopmentFiles();
  return resourcePackResult || behaviorPackResult;
};

exports.copyFiles = copyFiles;
exports.copyBehaviorDevelopmentFiles = copyBehaviorDevelopmentFiles;
exports.copyDevelopmentFiles = copyDevelopmentFiles;
exports.copyResourceDevelopmentFiles = copyResourceDevelopmentFiles;
