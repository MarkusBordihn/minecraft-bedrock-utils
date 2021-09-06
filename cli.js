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
const uuid = require('./commands/uuid.js');
const info = require('./commands/info.js');
const project = require('./commands/project.js');
const launch = require('./commands/launch.js');
const files = require('./commands/files.js');
const { version } = require('./package.json');

const showUsage = () => {
  const usage = `minecraft-bedrock-utils <command>
Usage:

minecraft-bedrock-utils debug\t\t\tshows debug information
minecraft-bedrock-utils info <path>\t\tshows info about specific project
minecraft-bedrock-utils info\t\t\tshows info about current project
minecraft-bedrock-utils run\t\t\tcopy behaviour and resource files
minecraft-bedrock-utils new\t\t\tcreates a new project (interactive)
minecraft-bedrock-utils new <name>\t\tcreates a new project with default options
minecraft-bedrock-utils uuid <name> <namespace>\treturns a v5 UUID string for the given name and namespace
minecraft-bedrock-utils uuid <name>\t\treturns a v5 UUID string for the given name with a default namespace
minecraft-bedrock-utils uuid\t\t\treturns a v4 UUID string
minecraft-bedrock-utils version\t\t\tshows current version number
\n`;
  console.log(usage);
};

switch (args[0]) {
  case 'debug':
    debug();
    break;
  case 'run':
    if (files.copyDevelopmentFiles()) {
      launch();
    }
    break;
  case 'info':
    info.showInfo(args[1]);
    break;
  case 'launch':
    launch();
    break;
  case 'copy':
    files.copyDevelopmentFiles();
    break;
  case 'new':
    project.newProject(args[1], args[2]);
    break;
  case 'uuid':
    console.log(uuid.getUUID(args[1], args[2]));
    break;
  case 'version':
  case '-v':
  case '-version':
    console.log(version);
    break;
  default:
    showUsage();
}
