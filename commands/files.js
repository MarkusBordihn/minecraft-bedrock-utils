/**
 * @fileoverview Minecraft Bedrock Utils - Files command
 *
 * @license Copyright 2021 Markus Bordihn
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const defaultPath = require('../utils/path.js');

const copyBehaviorFiles = () => {
  if (
    defaultPath.possibleBehaviorPackInWorkingPath &&
    defaultPath.behaviorPacksPath
  ) {
    const srcDir = defaultPath.possibleBehaviorPackInWorkingPath;
    const targetDir = path.join(
      defaultPath.behaviorPacksPath,
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
    defaultPath.possibleResourcePackInWorkingPath &&
    defaultPath.resourcePacksPath
  ) {
    const srcDir = defaultPath.possibleResourcePackInWorkingPath;
    const targetDir = path.join(
      defaultPath.resourcePacksPath,
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
    defaultPath.possibleBehaviorPackInWorkingPath &&
    defaultPath.developmentBehaviorPacksPath
  ) {
    const srcDir = defaultPath.possibleBehaviorPackInWorkingPath;
    const targetDir = path.join(
      defaultPath.developmentBehaviorPacksPath,
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
    defaultPath.possibleResourcePackInWorkingPath &&
    defaultPath.developmentResourcePacksPath
  ) {
    const srcDir = defaultPath.possibleResourcePackInWorkingPath;
    const targetDir = path.join(
      defaultPath.developmentResourcePacksPath,
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
