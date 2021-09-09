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
const files = require('./commands/files.js');
const info = require('./commands/info.js');
const item = require('./commands/item.js');
const launch = require('./commands/launch.js');
const project = require('./commands/project.js');
const usage = require('./usage.js');
const uuid = require('./commands/uuid.js');
const { version } = require('./package.json');

switch (args[0]) {
  case 'add':
    if (args[1] == 'item') {
      item.add(args[2]);
    } else {
      usage.showAddUsage();
    }
    break;
  case 'list':
    if (args[1] == 'items') {
      item.list(args[2]);
    }
    break;
  case 'debug':
    debug();
    break;
  case 'run':
    if (files.copyDevelopmentFiles()) {
      console.info('Please re-join the currently loaded world, if any!');
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
    usage.showUsage();
}
