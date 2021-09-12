/**
 * @fileoverview Minecraft Bedrock Utils - Usage
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

const command = chalk.green('minecraft-bedrock-utils');

const showUsage = () => {
  const usage = `${command} <command>

Usage:

${command} add item\t\t${chalk.grey('add a new item (interactive)')}
${command} add item <name>\t\t${chalk.grey(
    'add a new item with the given name'
  )}
${command} add recipe\t\t${chalk.grey('add a new recipe (interactive)')}
${command} add recipe <name>\t\t${chalk.grey(
    'add a new recipe with the given name'
  )}
${command} list items\t\t${chalk.grey('list all items for the current project')}
${command} list items <path>\t${chalk.grey(
    'list all items for the specific project'
  )}
${command} list recipes\t\t${chalk.grey(
    'list all recipes for the current project'
  )}
${command} list recipes <path>\t${chalk.grey(
    'list all recipes for the specific project'
  )}
${command} debug\t\t\t${chalk.grey('shows debug information')}
${command} info <path>\t\t${chalk.grey('shows info about specific project')}
${command} info\t\t\t${chalk.grey('shows info about current project')}
${command} new <name>\t\t${chalk.grey(
    'creates a new project with default options'
  )}
${command} new\t\t\t${chalk.grey('creates a new project (interactive)')}
${command} run\t\t\t${chalk.grey(
    'copy behavior and resource development files and start client'
  )}
${command} uuid <name> <namespace>\t${chalk.grey(
    'returns a v5 UUID string for the given name and namespace'
  )}
${command} uuid <name>\t\t${chalk.grey(
    'returns a v5 UUID string for the given name with a default namespace'
  )}
${command} uuid\t\t\t${chalk.grey('returns a v4 UUID string')}
${command} deploy\t\t\t${chalk.grey('copy behavior and resource files')}
${command} version\t\t\t${chalk.grey('shows current version number')}
\n`;
  console.log(usage);
};

const showAddUsage = () => {
  const usage = `Please specify the add option.

Usage: add <type>
  
${command} add item\t\t${chalk.grey('add a new item (interactive)')}
${command} add item <name>\t\t${chalk.grey(
    'add a new item with the given name'
  )}
${command} add recipe\t\t${chalk.grey('add a new recipe (interactive)')}
${command} add recipe <name>\t\t${chalk.grey(
    'add a new recipe with the given name'
  )}
\n`;
  console.log(usage);
};

exports.command = command;
exports.showUsage = showUsage;
exports.showAddUsage = showAddUsage;
