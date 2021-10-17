/**
 * @file Minecraft Bedrock Utils - Init command
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const { initUtils } = require('minecraft-utils-shared');

const newWorkspace = () => {
  initUtils.createWorkspace('minecraft-bedrock-utils');
};

exports.newWorkspace = newWorkspace;
