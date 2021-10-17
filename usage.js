/**
 * @file Minecraft Bedrock Utils - Usage
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');

const command = chalk.green('minecraft-bedrock-utils');

const mainCommands = `
${command} init\t\t\t${chalk.grey('prepares workspace')}
${command} new\t\t\t${chalk.grey('creates a new project (interactive)')}
${command} new <name>\t\t${chalk.grey(
  'creates a new project with default options'
)}
`.substr(1);

const addCommands = `
${command} add item\t\t${chalk.grey('add a new item (interactive)')}
${command} add item <name>\t\t${chalk.grey(
  'add a new item with the given name'
)}
${command} add item <config file>\t${chalk.grey(
  'add a new item based on the given config file'
)}
${command} add recipe\t\t${chalk.grey('add a new recipe (interactive)')}
${command} add recipe <name>\t${chalk.grey(
  'add a new recipe with the given name'
)}
`.substr(1);

const listCommands = `
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
`.substr(1);

const runCommands = `
${command} run\t\t\t${chalk.grey(
  'copy behavior and resource development files and start client'
)}
${command} deploy\t\t\t${chalk.grey('copy behavior and resource files')}
`.substr(1);

const miscCommands = `
${command} info <path>\t\t${chalk.grey('shows info about specific project')}
${command} info\t\t\t${chalk.grey('shows info about current project')}
${command} uuid <name> <namespace>\t${chalk.grey(
  'returns a v5 UUID string for the given name and namespace'
)}
${command} uuid <name>\t\t${chalk.grey(
  'returns a v5 UUID string for the given name with a default namespace'
)}
${command} uuid\t\t\t${chalk.grey('returns a v4 UUID string')}
`.substr(1);

const debugCommands = `
${command} debug\t\t\t${chalk.grey('shows debug information')}
${command} version\t\t\t${chalk.grey('shows current version number')}
`.substr(1);

exports.showUsage = () => {
  const usage = `${command} <command>

Usage:

${mainCommands}
${runCommands}
${addCommands}
${listCommands}
${miscCommands}
${debugCommands}`;
  console.log(usage);
};

exports.showAddUsage = () => {
  const usage = `Please specify the add option.

Usage: add <type>
  
${addCommands}`;
  console.log(usage);
};

exports.showListUsage = () => {
  const usage = `Please specify the list option.

Usage: list <type>
  
${listCommands}`;
  console.log(usage);
};
