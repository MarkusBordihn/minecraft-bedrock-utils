/**
 * @fileoverview Minecraft Bedrock Utils - Info command
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
const fs = require('fs');
const defaultPath = require('../utils/path.js');
const manifest = require('../utils/manifest.js');

/**
 * @param {String} search_path
 */
const showInfo = (search_path = defaultPath.workingPath) => {
  let behaviorPackPath = defaultPath.possibleBehaviorPackInWorkingPath;
  let resourcePackPath = defaultPath.possibleResourcePackInWorkingPath;
  if (search_path != defaultPath.workingPath) {
    behaviorPackPath =
      defaultPath.getPossibleBehaviorPackInSearchPath(search_path);
    resourcePackPath =
      defaultPath.getPossibleResourcePackPackInSearchPath(search_path);
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
