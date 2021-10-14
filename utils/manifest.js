/**
 * @file Minecraft Bedrock Utils - Manifest lib
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { uuidUtils } = require('minecraft-utils-shared');

/**
 * @param {String} file
 * @return {String}
 */
const readManifest = (file) => {
  if (!fs.existsSync(file)) {
    console.error(chalk.red('Unable to find manifest file at', file));
    return;
  }
  const manifestFilePath = file.endsWith('manifest.json')
    ? file
    : path.join(file, 'manifest.json');
  const manifestFile = fs.readFileSync(manifestFilePath);
  return JSON.parse(manifestFile);
};

/**
 * @param {String} file
 * @param {Object} options
 * @return {Object}
 */
const createManifest = (file, options = {}) => {
  if (fs.existsSync(file)) {
    if (!options.overwrite) {
      console.error(chalk.red('Manifest file already exists under', file));
      return {};
    } else {
      console.warn(chalk.orange('Overwriting existing manifest file', file));
    }
  }
  const manifest = getManifest(options);
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2));
  return manifest;
};

const getManifest = (options = {}) => {
  const result = {
    format_version: 2,
    header: {
      name: options.name,
      description: options.description || '',
      uuid: uuidUtils.getUUID(),
      version: options.version || [1, 0, 0],
      min_engine_version: options.minEngineVersion || [1, 17, 0],
    },
    modules: [],
    dependencies: [],
  };

  // Handle general options
  if (options.dependencies) {
    result.dependencies = options.dependencies;
  }

  // Handle different types of manifest
  if (options.type == 'behavior') {
    result.modules.push({
      type: 'data',
      uuid: uuidUtils.getUUID(),
      version: options.version || [1, 0, 0],
    });
    if (!result.header.description) {
      result.header.description = 'Behavior Pack for ' + options.name;
    }
  } else if (options.type == 'resource') {
    result.modules.push({
      type: 'resources',
      uuid: uuidUtils.getUUID(),
      version: options.version || [1, 0, 0],
    });
    if (!result.header.description) {
      result.header.description = 'Resource Pack for ' + options.name;
    }
  }

  return result;
};

exports.createManifest = createManifest;
exports.getManifest = getManifest;
exports.readManifest = readManifest;
