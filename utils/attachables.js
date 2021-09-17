/**
 * @fileoverview Minecraft Bedrock Utils - Attachables lib
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
const defaultPath = require('../utils/path.js');
const files = require('./files.js');
const fs = require('fs');
const path = require('path');

const defaultNamespace = 'my_attachable';
const defaultFormatVersion = '1.16.1';

/**
 * @param {String} name
 * @param {Object} options
 */
const createAttachable = (name, options = {}) => {
  const resourcePackPath = defaultPath.possibleResourcePackInWorkingPath;
  const attachableName = normalizeName(name || 'my_attachable');

  // Make sure config includes name
  if (!options.name) {
    options.name = name;
  }

  // Create attachables config in behavior pack
  files.createFolderIfNotExists(resourcePackPath, 'attachables');
  const attachableConfig = createAttachableConfig(
    path.join(resourcePackPath, 'attachables', `${attachableName}.json`),
    options
  );

  // Create texture entry
  const texturePath = path.join(resourcePackPath, 'textures');
  files.createFolderIfNotExists(texturePath);

  // Create default texture entry for armor models
  const modelsTexturePath = path.join(texturePath, 'models');
  files.createFolderIfNotExists(modelsTexturePath);
  const armorModelsTexturePath = path.join(modelsTexturePath, 'armor');
  files.createFolderIfNotExists(armorModelsTexturePath);
  if (
    attachableConfig['minecraft:attachable'].description.textures &&
    attachableConfig[
      'minecraft:attachable'
    ].description.textures.default.includes('/')
  ) {
    const defaultTextureName = path.basename(
      attachableConfig['minecraft:attachable'].description.textures.default
    );
    if (defaultTextureName) {
      files.copyFileIfNotExists(
        path.join(
          defaultPath.assetsModelsArmorPath,
          defaultTextureName.endsWith('_2') ? 'armor_2.png' : 'armor_1.png'
        ),
        path.join(armorModelsTexturePath, `${defaultTextureName}.png`)
      );
    }
  }

  // Create enchanted texture entry for armor.
  const miscTexturePath = path.join(texturePath, 'misc');
  files.createFolderIfNotExists(miscTexturePath);
  if (
    attachableConfig['minecraft:attachable'].description.textures &&
    attachableConfig[
      'minecraft:attachable'
    ].description.textures.enchanted.includes('/')
  ) {
    const defaultTextureName = path.basename(
      attachableConfig['minecraft:attachable'].description.textures.enchanted
    );
    if (defaultTextureName) {
      files.copyFileIfNotExists(
        path.join(defaultPath.assetsMiscPath, 'enchanted_armor.png'),
        path.join(miscTexturePath, `${defaultTextureName}.png`)
      );
    }
  }
};

/**
 * @param {String} file
 * @param {Object} options
 * @return {Object} Attachable Definition
 */
const createAttachableConfig = (file, options = {}) => {
  if (fs.existsSync(file)) {
    if (!options.overwrite) {
      console.error(
        chalk.red('Attachable config file already exists under', file)
      );
      return;
    } else {
      console.warn(
        chalk.orange('Overwriting existing attachable config file', file)
      );
    }
  }
  const attachable = getAttachableConfig(options);
  fs.writeFileSync(file, JSON.stringify(attachable, null, 2));
  return attachable;
};

/**
 * @param {Object} options
 * @return {Object} Attachable Definition
 */
const getAttachableConfig = (options = {}) => {
  const type = options.armor_type || options.type || 'chestplate';
  const name = options.name || 'my_attachable';
  const attachableId = getId(name, options.namespace);
  const formatVersion = options.format_version || defaultFormatVersion;
  const result = {
    format_version: formatVersion,
    'minecraft:attachable': {
      description: {
        identifier: attachableId,
        materials: {
          default: 'armor',
          enchanted: 'armor_enchanted',
        },
        textures: {
          default: options.textures_default || '',
          enchanted: options.textures_enchanted || '',
        },
        geometry: {
          default: '',
        },
        scripts: {
          parent_setup: '',
        },
        render_controllers: options.render_controllers || [
          'controller.render.armor',
        ],
      },
    },
  };

  switch (type) {
    case 'boots':
      result['minecraft:attachable'].description.geometry.default =
        'geometry.humanoid.armor.boots';
      result['minecraft:attachable'].description.scripts.parent_setup =
        'variable.boot_layer_visible = 0.0;';
      break;
    case 'chestplate':
      result['minecraft:attachable'].description.geometry.default =
        'geometry.humanoid.armor.chestplate';
      result['minecraft:attachable'].description.scripts.parent_setup =
        'variable.chestplate_layer_visible = 0.0;';
      break;
    case 'helmet':
      result['minecraft:attachable'].description.geometry.default =
        'geometry.humanoid.armor.helmet';
      result['minecraft:attachable'].description.scripts.parent_setup =
        'variable.helmet_layer_visible = 0.0;';
      break;
    case 'leggings':
      result['minecraft:attachable'].description.geometry.default =
        'geometry.humanoid.armor.leggings';
      result['minecraft:attachable'].description.scripts.parent_setup =
        'variable.leg_layer_visible = 0.0;';
      break;
    case 'custom':
    default:
      if (options.geometry) {
        result['minecraft:attachable'].description.geometry.default =
          options.geometry.default;
      }
      if (options.scripts) {
        result['minecraft:attachable'].description.scripts.parent_setup =
          options.scripts.parent_setup;
      }
      break;
  }

  return result;
};

/**
 * @param {String} name
 * @param {String} namespace
 * @return {String}
 */
const getId = (name, namespace = defaultNamespace) => {
  return `${namespace}:${normalizeName(name)}`;
};

/**
 * @param {String} name
 * @return {String}
 */
const normalizeName = (name = '') => {
  return name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
};

exports.createAttachable = createAttachable;
exports.getId = getId;
exports.normalizeName = normalizeName;
