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

const fs = require('fs-extra');
const path = require('path');
const defaultPaths = require('../utils/path.js');

const copyBehaviourDevelopmentFiles = () => {
  if (
    defaultPaths.possibleBehaviorPackInWorkingPath &&
    defaultPaths.developmentBehaviorPacksPath
  ) {
    const srcDir = defaultPaths.possibleBehaviorPackInWorkingPath;
    const targetDir = path.join(
      defaultPaths.developmentBehaviorPacksPath,
      path.basename(srcDir)
    );
    console.log('Copy behavior pack from', srcDir, 'to', targetDir, '...');
    fs.copySync(srcDir, targetDir);
  } else {
    console.warn(
      'Unable to find behavior pack in working / development path !'
    );
  }
};

const copyResourceDevelopmentFiles = () => {
  if (
    defaultPaths.possibleResourcePackInWorkingPath &&
    defaultPaths.developmentResourcePacksPath
  ) {
    const srcDir = defaultPaths.possibleResourcePackInWorkingPath;
    const targetDir = path.join(
      defaultPaths.developmentResourcePacksPath,
      path.basename(srcDir)
    );
    console.log('Copy resource pack from', srcDir, 'to', targetDir, '...');
    fs.copySync(srcDir, targetDir);
  } else {
    console.warn(
      'Unable to find resource pack in working / development path !'
    );
  }
};

const copyDevelopmentFiles = () => {
  copyResourceDevelopmentFiles();
  copyBehaviourDevelopmentFiles();
};

exports.copyBehaviourDevelopmentFiles = copyBehaviourDevelopmentFiles;
exports.copyDevelopmentFiles = copyDevelopmentFiles;
exports.copyResourceDevelopmentFiles = copyResourceDevelopmentFiles;
