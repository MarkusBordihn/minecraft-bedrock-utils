/**
 * @fileoverview Minecraft Bedrock Utils - Pre-checks lib
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
const defaultPath = require('../utils/path.js');

const errorExistingBehaviorPack = () => {
  const behaviorPackPath = defaultPath.getPossibleBehaviorPackInSearchPath();
  if (behaviorPackPath) {
    console.error(
      chalk.red('Found already existing behavior pack under', behaviorPackPath)
    );
    return true;
  }
  return false;
};

const errorExistingResourcePack = () => {
  const resourcePackPath =
    defaultPath.getPossibleResourcePackPackInSearchPath();
  if (resourcePackPath) {
    console.error(
      chalk.red('Found already existing resource pack under', resourcePackPath)
    );
    return true;
  }
  return false;
};

const errorExistingPack = () => {
  const hasExistingBehaviorPack = errorExistingBehaviorPack();
  const hasExistingResourcePack = errorExistingResourcePack();

  if (hasExistingBehaviorPack || hasExistingResourcePack) {
    return true;
  }
  return false;
};

const errorNonExistingBehaviorPack = () => {
  const behaviorPackPath = defaultPath.getPossibleBehaviorPackInSearchPath();
  if (!behaviorPackPath) {
    console.error(chalk.red('Found no existing behavior pack!'));
    return true;
  }
  return false;
};

const errorNonExistingResourcePack = () => {
  const resourcePackPath =
    defaultPath.getPossibleResourcePackPackInSearchPath();
  if (!resourcePackPath) {
    console.error(chalk.red('Found no existing resource pack!'));
    return true;
  }
  return false;
};

const errorNonExistingPack = () => {
  const hasExistingBehaviorPack = errorNonExistingBehaviorPack();
  const hasExistingResourcePack = errorNonExistingResourcePack();

  if (hasExistingBehaviorPack || hasExistingResourcePack) {
    return true;
  }
  return false;
};

exports.errorExistingPack = errorExistingPack;
exports.errorNonExistingPack = errorNonExistingPack;