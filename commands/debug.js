/**
 * @file Minecraft Bedrock Utils - Debug command
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const args = process.argv.slice(2);
const {
  translationUtils,
  defaultPath,
  utilsVersion,
} = require('minecraft-utils-shared');

const debug = () => {
  console.log('minecraft-bedrock-utils:', args, '\n');
  console.log('Detected Language:', translationUtils.language);
  console.log('Detected paths:', defaultPath);
  console.log('Process Env:', process.env);
  console.log('Shared utils version:', utilsVersion);
  console.log('Version:', process.env.npm_package_version);
};

module.exports = debug;
