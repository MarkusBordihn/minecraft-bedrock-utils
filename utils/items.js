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
const defaultPath = require('../utils/path.js');
const files = require('./files.js');
const fs = require('fs');
const glob = require('glob');
const language = require('./language.js');
const path = require('path');

const defaultNamespace = 'my_items';

const createItem = (name, options = {}) => {
  const behaviorPackPath = defaultPath.possibleBehaviorPackInWorkingPath;
  const resourcePackPath = defaultPath.possibleResourcePackInWorkingPath;
  const itemName = normalizeItemName(options.name || 'my_item');
  const itemId = getItemId(options.name, options.namespace);

  // Creative Item Config in behavior pack
  files.createFolderIfNotExists(behaviorPackPath, 'items');
  options.context = 'behavior';
  const itemBehavior = createItemConfig(
    path.join(behaviorPackPath, 'items', `${itemName}.json`),
    options
  );

  // Creative Item Config in resource pack
  files.createFolderIfNotExists(resourcePackPath, 'items');
  options.context = 'resource';
  const itemResource = createItemConfig(
    path.join(resourcePackPath, 'items', `${itemName}.json`),
    options
  );

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

  console.log(itemBehavior, itemResource);
};

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

const getItemConfig = (options = {}) => {
  const name = options.name || 'my_item';
  const itemName = normalizeItemName(name);
  const itemId = getItemId(name, options.namespace);
  const result = {
    format_version: '1.16',
    'minecraft:item': {
      description: {
        identifier: itemId,
      },
      components: {},
    },
  };

  // Handles resource specific options
  if (options.context == 'resource') {
    result['minecraft:item'].components['minecraft:icon'] = itemName;
    switch (options.type) {
      case 'food':
        result['minecraft:item'].description.category = 'nature';
        result['minecraft:item'].components['minecraft:use_animation'] = 'eat';
        break;
      default:
        result['minecraft:item'].description.category = 'items';
    }
    return result;
  }

  // Handle behaviour specific options
  if (options.use_duration) {
    result['minecraft:item'].components['minecraft:use_duration'] = parseInt(
      options.use_duration
    );
  }
  switch (options.type) {
    case 'food':
      result['minecraft:item'].components['minecraft:food'] = {
        can_always_eat: options.can_always_eat || false,
        nutrition: parseInt(options.nutrition),
        saturation_modifier: options.saturation_modifier || 'normal',
        using_converts_to: options.using_converts_to || '',
      };
      break;
  }

  return result;
};

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

  // Search for items inside behaviour pack.
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
          category: itemData['minecraft:item'].description.category || 'Misc',
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
            category: itemData['minecraft:item'].description.category || 'Misc',
            behavior: false,
            resource: true,
          };
        }
      }
    });

  return items;
};

const getItemId = (name, namespace = defaultNamespace) => {
  return `${namespace}:${normalizeItemName(name)}`;
};

const existingItem = (name, namespace = defaultNamespace) => {
  const possibleItems = getItems();
  const itemId = getItemId(name, namespace);
  if (possibleItems[itemId]) {
    console.error(chalk.red(`Item ${itemId} already exists ...`));
    return true;
  }
  return false;
};

const normalizeItemName = (name = '') => {
  return name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toLowerCase();
};

exports.createItem = createItem;
exports.existingItem = existingItem;
exports.getItemId = getItemId;
exports.getItems = getItems;
exports.normalizeItemName = normalizeItemName;