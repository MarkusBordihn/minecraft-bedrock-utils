/**
 * @fileoverview Minecraft Bedrock Utils - Items lib
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
const compareVersions = require('compare-versions');
const defaultPath = require('../utils/path.js');
const files = require('./files.js');
const fs = require('fs');
const glob = require('glob');
const language = require('./language.js');
const path = require('path');
const { config } = require('process');

const defaultNamespace = 'my_items';
const defaultFormatVersion = '1.16.1';

/**
 * @param {String} name
 * @param {Object} options
 */
const createItem = (name, options = {}) => {
  const behaviorPackPath = defaultPath.possibleBehaviorPackInWorkingPath;
  const resourcePackPath = defaultPath.possibleResourcePackInWorkingPath;
  const itemName = normalizeName(options.name || 'my_item');
  const itemId = getId(options.name, options.namespace);

  // Create Item Config in behavior pack
  files.createFolderIfNotExists(behaviorPackPath, 'items');
  options.context = 'behavior';
  createItemConfig(
    path.join(behaviorPackPath, 'items', `${itemName}.json`),
    options
  );

  // Create Item Config in resource pack, if needed
  if (compareVersions.compare(options.format_version, '1.16.100', '<')) {
    files.createFolderIfNotExists(resourcePackPath, 'items');
    options.context = 'resource';
    createItemConfig(
      path.join(resourcePackPath, 'items', `${itemName}.json`),
      options
    );
  }

  // Create Texture Entry
  const texturePath = path.join(resourcePackPath, 'textures');
  files.createFolderIfNotExists(texturePath);
  files.createFolderIfNotExists(texturePath, 'items');
  files.copyFileIfNotExists(
    path.join(defaultPath.assetsItemsPath, `${options.type || 'other'}.png`),
    path.join(texturePath, 'items', `${itemName}.png`)
  );
  createItemTextureConfig(
    path.join(texturePath, 'item_texture.json'),
    itemName
  );

  // Create texts and language entry
  const textsPath = path.join(resourcePackPath, 'texts');
  files.createFolderIfNotExists(textsPath);
  files.createFileIfNotExists(textsPath, 'en_US.lang');
  language.addLanguageText(
    path.join(textsPath, 'en_US.lang'),
    `item.${itemId}.name`,
    options.name
  );
};

/**
 * @param {String} file
 * @param {String} name
 */
const createItemTextureConfig = (file, name) => {
  let content = {
    resource_pack_name: 'Texture pack',
    texture_name: 'atlas.items',
    texture_data: {},
  };
  if (fs.existsSync(file)) {
    const itemTextureConfig = fs.readFileSync(file);
    content = JSON.parse(itemTextureConfig);
  }
  content.texture_data[name] = {
    textures: `textures/items/${name}`,
  };
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
};

/**
 * @param {String} file
 * @param {Object} options
 * @return {Object} Item Definition
 */
const createItemConfig = (file, options = {}) => {
  if (fs.existsSync(file)) {
    if (!options.overwrite) {
      console.error(chalk.red('Item config file already exists under', file));
      return;
    } else {
      console.warn(chalk.orange('Overwriting existing item config file', file));
    }
  }
  const item = getItemConfig(options);
  fs.writeFileSync(file, JSON.stringify(item, null, 2));
  return item;
};

/**
 * @param {Object} options
 * @return {Object} Item Definition
 */
const getItemConfig = (options = {}) => {
  const name = options.name || 'my_item';
  const itemName = normalizeName(name);
  const itemId = getId(name, options.namespace);
  const formatVersion = options.format_version || defaultFormatVersion;
  const legacyVersion = compareVersions.compare(formatVersion, '1.16.100', '<');
  const isResourceConfig = options.context == 'resource';
  const isBehaviorConfig = options.context == 'behavior';
  const result = {
    format_version: formatVersion,
    'minecraft:item': {
      description: {
        identifier: itemId,
      },
      components: {},
    },
  };

  // Handles shared legacy and upcoming specific options
  if (
    (legacyVersion && isResourceConfig) ||
    (!legacyVersion && isBehaviorConfig)
  ) {
    // Handles item descriptions based on format version
    switch (options.type) {
      case 'digger':
      case 'weapon':
      case 'throwable':
        result['minecraft:item'].description.category = 'equipment';
        break;
      case 'food':
        result['minecraft:item'].description.category = 'nature';
        break;
      case 'fuel':
      default:
        result['minecraft:item'].description.category = 'items';
    }

    // Handles icon and name specific options
    result['minecraft:item'].components['minecraft:icon'] = isResourceConfig
      ? itemName
      : {
          texture: itemName,
        };
    if (isBehaviorConfig) {
      result['minecraft:item'].components['minecraft:display_name'] = {
        value: `item.${itemId}.name`,
      };
    }

    // Handles general options
    if (options.render_offsets) {
      result['minecraft:item'].components['minecraft:render_offsets'] =
        isResourceConfig
          ? options.render_offsets
          : { main_hand: [0, 0, 0], off_hand: [0, 0, 0] };
    }
    if (options.use_animation) {
      result['minecraft:item'].components['minecraft:use_animation'] =
        options.use_animation;
    }
  }

  // Skip rest of config for resource config
  if (isResourceConfig) {
    return result;
  }

  // Handle behavior specific options
  if (options.use_duration) {
    result['minecraft:item'].components['minecraft:use_duration'] = parseInt(
      options.use_duration
    );
  }
  if (options.damage) {
    result['minecraft:item'].components['minecraft:damage'] = parseInt(
      options.damage
    );
  }
  if (options.foil) {
    result['minecraft:item'].components['minecraft:foil'] =
      options.foil || false;
  }
  if (options.hand_equipped) {
    result['minecraft:item'].components['minecraft:hand_equipped'] = true;
  }
  if (options.max_stack_size) {
    result['minecraft:item'].components['minecraft:max_stack_size'] = parseInt(
      options.max_stack_size
    );
  }

  // Type specific options
  switch (options.type) {
    case 'digger':
      result['minecraft:item'].components['minecraft:digger'] = {
        use_efficiency: options.use_efficiency || false,
      };
      if (options.destroy_speeds) {
        result['minecraft:item'].components['minecraft:digger'].destroy_speeds =
          [];
      }
      if (config.on_dig) {
        result['minecraft:item'].components['minecraft:digger'].on_dig = '';
      }
      break;
    case 'food':
      result['minecraft:item'].components['minecraft:food'] = {
        can_always_eat: options.can_always_eat || false,
        nutrition: parseInt(options.nutrition),
        saturation_modifier: options.saturation_modifier || 'normal',
        using_converts_to: options.using_converts_to || '',
      };
      if (options.effects) {
        result['minecraft:item'].components['minecraft:food'].effects = [];
      }
      break;
    case 'fuel':
      result['minecraft:item'].components['minecraft:fuel'] = {
        duration: parseInt(options.duration),
      };
      break;
    case 'throwable':
      result['minecraft:item'].components['minecraft:throwable'] = {
        do_swing_animation: options.do_swing_animation || false,
        launch_power_scale: parseFloat(options.launch_power_scale) || 1.0,
        max_draw_duration: parseFloat(options.max_draw_duration) || 0.0,
        max_launch_power: parseFloat(options.max_launch_power) || 1.0,
        min_draw_duration: parseFloat(options.min_draw_duration) || 0.0,
        scale_power_by_draw_duration:
          options.scale_power_by_draw_duration || false,
      };
      result['minecraft:item'].components['minecraft:projectile'] = {
        projectile_entity: 'minecraft:arrow',
        minimum_critical_power: 1,
      };
      break;
    case 'weapon':
      result['minecraft:item'].components['minecraft:weapon'] = {};
      if (options.on_hit_block) {
        result['minecraft:item'].components['minecraft:weapon'].on_hit_block =
          options.on_hit_block;
      }
      if (options.on_hurt_entity) {
        result['minecraft:item'].components['minecraft:weapon'].on_hurt_entity =
          options.on_hurt_entity;
      }
      if (options.on_not_hurt_entity) {
        result['minecraft:item'].components[
          'minecraft:weapon'
        ].on_not_hurt_entity = options.on_not_hurt_entity;
      }
      break;
  }

  return result;
};

/**
 * @param {string} search_path
 * @return {Object}
 */
const getItems = (search_path = defaultPath.workingPath) => {
  let behaviorPackPath = defaultPath.possibleBehaviorPackInWorkingPath;
  let resourcePackPath = defaultPath.possibleResourcePackInWorkingPath;
  if (search_path != defaultPath.workingPath) {
    behaviorPackPath =
      defaultPath.getPossibleBehaviorPackInSearchPath(search_path);
    resourcePackPath =
      defaultPath.getPossibleResourcePackPackInSearchPath(search_path);
  }
  const items = {};

  // Search for items inside behavior pack.
  glob
    .sync(path.join(behaviorPackPath, 'items/*.json'), {
      nodir: true,
    })
    .map((file) => {
      const itemFile = fs.readFileSync(file);
      const itemData = JSON.parse(itemFile);
      if (itemData['minecraft:item']) {
        const identifier = itemData['minecraft:item'].description.identifier;
        items[identifier] = {
          category: itemData['minecraft:item'].description.category || 'misc',
          behavior: true,
          resource: false,
        };
      }
    });

  // Search for items inside resource pack.
  glob
    .sync(path.join(resourcePackPath, 'items/*.json'), {
      nodir: true,
    })
    .map((file) => {
      const itemFile = fs.readFileSync(file);
      const itemData = JSON.parse(itemFile);
      if (itemData['minecraft:item']) {
        const identifier = itemData['minecraft:item'].description.identifier;
        if (items[identifier]) {
          items[identifier].resource = true;
          if (
            !items[identifier].category &&
            itemData['minecraft:item'].description.category
          ) {
            items[identifier].category =
              itemData['minecraft:item'].description.category;
          }
        } else {
          items[identifier] = {
            category: itemData['minecraft:item'].description.category || 'misc',
            behavior: false,
            resource: true,
          };
        }
      }
    });

  return items;
};

/**
 *
 * @param {String} name
 * @param {String} namespace
 * @return {String}
 */
const getId = (name, namespace = defaultNamespace) => {
  return `${namespace}:${normalizeName(name)}`;
};

const normalizeName = (name = '') => {
  return name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
};

const existingItem = (name, namespace = defaultNamespace) => {
  const possibleItems = getItems();
  const itemId = getId(name, namespace);
  if (possibleItems[itemId]) {
    return true;
  }
  return false;
};

exports.createItem = createItem;
exports.existingItem = existingItem;
exports.getId = getId;
exports.getItems = getItems;
exports.normalizeName = normalizeName;
