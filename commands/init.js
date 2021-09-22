/**
 * @fileoverview Minecraft Bedrock Utils - Init command
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
const execa = require('execa');
const files = require('../utils/files.js');
const fs = require('fs');
const path = require('path');

const newWorkspace = () => {
  console.log(chalk.green('Preparing workspace ...'));

  // Make sure we have a existing package.json file
  if (!fs.existsSync('package.json')) {
    try {
      execa.commandSync('npm init -y private true');
    } catch (error) {
      console.error(chalk.red('Unable to create package.json file:', error));
      return;
    }
  }

  // Confirm the file exists before going to the next steps.
  if (!fs.existsSync('package.json')) {
    console.error(chalk.red('Unable to find package.json file, give up!'));
    return;
  }

  // Installing a local copy of the minecraft-bedrock-utils.
  try {
    execa.commandSync('npm install minecraft-bedrock-utils');
  } catch (error) {
    console.error(
      chalk.red(
        'Unable to install a local copy of minecraft-bedrock-utils:',
        error
      )
    );
    return;
  }

  // Add git related files if not exists.
  files.copyFileIfNotExists(
    path.join(defaultPath.assetsInitPath, '.gitignore'),
    '.gitignore'
  );
  files.copyFileIfNotExists(
    path.join(defaultPath.assetsInitPath, '.gitattributes'),
    '.gitattributes'
  );

  console.log(chalk.green('Done.'));
  console.info(
    `\nUse "${chalk.green(
      'npx minecraft-bedrock-utils new'
    )}" to create a new behavior and/or resource pack.\n`
  );
};

exports.newWorkspace = newWorkspace;
