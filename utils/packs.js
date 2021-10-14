/**
 * @file Minecraft Bedrock Utils - Pack lib
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const path = require('path');
const {
  configurationUtils,
  defaultPath,
  fileUtils,
  normalizeHelper,
} = require('minecraft-utils-shared');

const manifest = require('./manifest.js');

/**
 * @param {String} name
 * @param {Object} options
 * @return {Object} manifest.json
 */
const newBehaviorPack = (name, options = {}) => {
  const packPathName =
    normalizeHelper.normalizePathName(
      options.folderName ? options.folderName : name
    ) + '_BehaviorPack';
  const manifestPathName = path.join(packPathName, 'manifest.json');
  console.log(
    'Creating new BehaviorPack',
    chalk.green(name),
    'under',
    packPathName,
    '...'
  );

  // Create project folder
  fileUtils.createFolderIfNotExists(packPathName);

  // Create additional files
  if (options.preCreateFiles) {
    fileUtils.createFolderIfNotExists(packPathName, 'items');
    fileUtils.createFolderIfNotExists(packPathName, 'recipes');
  }

  // Add  default package icon
  fileUtils.copyFileIfNotExists(
    path.join(defaultPath.assets.logos, 'behavior_pack.png'),
    path.join(packPathName, 'pack_icon.png')
  );

  // Autocomplete Options if needed
  if (!options.name) {
    options.name = name;
  }
  if (!options.type) {
    options.type = 'behavior';
  }

  // Store configuration
  configurationUtils.saveDefaultConfig(`behavior_pack.mbu`, options);

  // Create and return manifest.json
  return manifest.createManifest(manifestPathName, options);
};

/**
 * @param {String} name
 * @param {Object} options
 * @return {Object} manifest.json
 */
const newResourcePack = (name, options = {}) => {
  const packPathName =
    normalizeHelper.normalizePathName(
      options.folderName ? options.folderName : name
    ) + '_ResourcePack';
  const manifestPathName = path.join(packPathName, 'manifest.json');
  console.log(
    'Creating new ResourcePack',
    chalk.green(name),
    'under',
    packPathName,
    '...'
  );

  // Create project folder
  fileUtils.createFolderIfNotExists(packPathName);

  // Autocomplete Options if needed
  if (!options.name) {
    options.name = name;
  }
  if (!options.type) {
    options.type = 'resource';
  }

  // Create additional files
  if (options.preCreateFiles) {
    fileUtils.createFolderIfNotExists(packPathName, 'items');
    fileUtils.createFolderIfNotExists(packPathName, 'texts');
    fileUtils.createFileIfNotExists(
      path.join(packPathName, 'texts'),
      'en_US.lang'
    );
    fileUtils.createFileIfNotExists(
      path.join(packPathName, 'texts'),
      'languages.json',
      '[\n  "en_US"\n]\n'
    );
    fileUtils.createFileIfNotExists(
      path.join(packPathName, 'texts'),
      'language_names.json',
      '[\n  [ "en_US", "English (US)" ]\n]\n'
    );
    fileUtils.createFolderIfNotExists(packPathName, 'textures');
    fileUtils.createFileIfNotExists(
      path.join(packPathName, 'textures'),
      'item_texture.json',
      `{
  "resource_pack_name": "Texture pack for ${name}",
  "texture_name": "atlas.items",
  "texture_data": {}
}`
    );
    fileUtils.createFolderIfNotExists(
      path.join(packPathName, 'textures'),
      'items'
    );
    fileUtils.createFolderIfNotExists(
      path.join(packPathName, 'textures'),
      'models'
    );
    fileUtils.createFolderIfNotExists(
      path.join(packPathName, 'textures', 'models'),
      'armor'
    );
  }

  // Add  default package icon
  fileUtils.copyFileIfNotExists(
    path.join(defaultPath.assets.logos, 'resource_pack.png'),
    path.join(packPathName, 'pack_icon.png')
  );

  // Store configuration
  configurationUtils.saveDefaultConfig(`resource_pack.mbu`, options);

  // Create and return manifest.json
  return manifest.createManifest(manifestPathName, options);
};

exports.newBehaviorPack = newBehaviorPack;
exports.newResourcePack = newResourcePack;
