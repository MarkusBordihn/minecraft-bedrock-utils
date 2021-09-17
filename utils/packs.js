/**
 * @fileoverview Minecraft Bedrock Utils - Pack lib
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
const defaultPath = require('./path.js');
const files = require('./files.js');
const manifest = require('./manifest.js');
const path = require('path');

/**
 * @param {String} name
 * @param {Object} options
 * @return {Object} manifest.json
 */
const newBehaviorPack = (name, options = {}) => {
  const packPathName =
    defaultPath.normalizePathName(options.nameDir ? options.nameDir : name) +
    '_BehaviorPack';
  const manifestPathName = path.join(packPathName, 'manifest.json');
  console.log(
    'Creating new BehaviorPack',
    chalk.green(name),
    'under',
    packPathName,
    '...'
  );

  // Create project folder
  files.createFolderIfNotExists(packPathName);

  // Create additional files
  if (options.preCreateFiles) {
    files.createFolderIfNotExists(packPathName, 'items');
    files.createFolderIfNotExists(packPathName, 'recipes');
    files.copyFileIfNotExists(
      path.join(defaultPath.assetsPath, 'behavior_pack.png'),
      path.join(packPathName, 'pack_icon.png')
    );
  }

  // Autocomplete Options if needed
  if (!options.name) {
    options.name = name;
  }
  if (!options.type) {
    options.type = 'behavior';
  }

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
    defaultPath.normalizePathName(options.nameDir ? options.nameDir : name) +
    '_ResourcePack';
  const manifestPathName = path.join(packPathName, 'manifest.json');
  console.log(
    'Creating new ResourcePack',
    chalk.green(name),
    'under',
    packPathName,
    '...'
  );

  // Create project folder
  files.createFolderIfNotExists(packPathName);

  // Autocomplete Options if needed
  if (!options.name) {
    options.name = name;
  }
  if (!options.type) {
    options.type = 'resource';
  }

  // Create additional files
  if (options.preCreateFiles) {
    files.createFolderIfNotExists(packPathName, 'items');
    files.createFolderIfNotExists(packPathName, 'texts');
    files.createFileIfNotExists(path.join(packPathName, 'texts'), 'en_US.lang');
    files.createFileIfNotExists(
      path.join(packPathName, 'texts'),
      'languages.json',
      '[\n  "en_US"\n]\n'
    );
    files.createFileIfNotExists(
      path.join(packPathName, 'texts'),
      'language_names.json',
      '[\n  [ "en_US", "English (US)" ]\n]\n'
    );
    files.createFolderIfNotExists(packPathName, 'textures');
    files.createFileIfNotExists(
      path.join(packPathName, 'textures'),
      'item_texture.json',
      `{
  "resource_pack_name": "Texture pack for ${name}",
  "texture_name": "atlas.items",
  "texture_data": {}
}`
    );
    files.createFolderIfNotExists(path.join(packPathName, 'textures'), 'items');
    files.createFolderIfNotExists(
      path.join(packPathName, 'textures'),
      'models'
    );
    files.createFolderIfNotExists(
      path.join(packPathName, 'textures', 'models'),
      'armor'
    );
    files.copyFileIfNotExists(
      path.join(defaultPath.assetsPath, 'resource_pack.png'),
      path.join(packPathName, 'pack_icon.png')
    );
  }

  // Create and return manifest.json
  return manifest.createManifest(manifestPathName, options);
};

exports.newBehaviorPack = newBehaviorPack;
exports.newResourcePack = newResourcePack;
