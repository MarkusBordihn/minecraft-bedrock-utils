#!/usr/bin/env node

/**
 * @file Minecraft Bedrock Utils - Debug
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const args = process.argv.slice(2);

const { utilsVersion } = require('minecraft-utils-shared');

const debug = require('./commands/debug.js');
const files = require('./commands/files.js');
const info = require('./commands/info.js');
const init = require('./commands/init.js');
const item = require('./commands/item.js');
const launch = require('./commands/launch.js');
const project = require('./commands/project.js');
const recipe = require('./commands/recipe.js');
const usage = require('./usage.js');
const uuid = require('./commands/uuid.js');
const { version } = require('./package.json');

switch (args[0]) {
  case 'add':
    switch (args[1]) {
      case 'item':
        item.add(args[2]);
        break;
      case 'recipe':
        recipe.add(args[2]);
        break;
      default:
        usage.showAddUsage();
    }
    break;
  case 'list':
    switch (args[1]) {
      case 'items':
        item.list(args[2]);
        break;
      case 'recipes':
        recipe.list(args[2]);
        break;
      default:
        usage.showListUsage();
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
  case 'init':
    init.newWorkspace();
    break;
  case 'launch':
    launch();
    break;
  case 'copy':
    files.copyDevelopmentFiles();
    break;
  case 'deploy':
    files.copyFiles();
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
    console.log('Shared utils version:', utilsVersion);
    console.log('Version:', version);
    break;
  default:
    usage.showUsage();
}
