#!/usr/bin/env node

/**
 * @fileoverview Minecraft Bedrock Utils - Debug
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

const args = process.argv.slice(2);
const debug = require('./commands/debug.js');
const launch = require('./commands/launch.js');
const files = require('./commands/files.js');
const { version } = require('./package.json');

const showUsage = () => {
  console.log('minecraft-bedrock-utils <command>');
  console.log('\nUsage:\n');
  console.log('minecraft-bedrock-utils debug\t\tshows debug information');
  console.log(
    'minecraft-bedrock-utils run\t\tcopy behaviour and resource files'
  );
  console.log(
    'minecraft-bedrock-utils version\t\tshows current version number'
  );
  console.log('');
};

switch (args[0]) {
  case 'debug':
    debug();
    break;
  case 'run':
    files.copyDevelopmentFiles();
    launch();
    break;
  case 'launch':
    launch();
    break;
  case 'copy':
    files.copyDevelopmentFiles();
    break;
  case 'version':
  case '-v':
  case '-version':
    console.log(version);
    break;
  default:
    showUsage();
}
