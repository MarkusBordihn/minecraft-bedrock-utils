/**
 * @file Minecraft Bedrock Utils - Items lib
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const compareVersions = require('compare-versions');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const {
  configurationUtils,
  defaultConfig,
  defaultPath,
  fileFinderUtils,
  fileUtils,
  generators,
  normalizeHelper,
} = require('minecraft-utils-shared');

const attachable = require('./attachables.js');
const language = require('./language.js');

const defaultNamespace = 'my_items';

/**
 * @param {String} name
 * @param {Object} itemOptions
 */
const createItem = (name, itemOptions = {}) => {
  const behaviorPackPath = defaultPath.bedrock.behaviorPack;
  const resourcePackPath = defaultPath.bedrock.resourcePack;

  // Normalized options
  const options = defaultConfig.item.normalize(itemOptions, name);

  console.log(options);

  // Create item config in behavior pack
  fileUtils.createFolderIfNotExists(behaviorPackPath, 'items');
  createItemConfig(
    path.join(behaviorPackPath, 'items', `${options.itemName}.json`),
    options
  );

  // Create item config in resource pack, if needed
  if (compareVersions.compare(options.bedrock.formatVersion, '1.16.100', '<')) {
    fileUtils.createFolderIfNotExists(resourcePackPath, 'items');
    createResourceConfig(
      path.join(resourcePackPath, 'items', `${options.itemName}.json`),
      options
    );
  }

  // Create texture entry
  let textureExampleAssets = options.type || 'custom';
  if (options.armor_type) {
    textureExampleAssets = `${textureExampleAssets}_${options.armor_type}`;
  }
  const texturePath = path.join(resourcePackPath, 'textures');
  fileUtils.createFolderIfNotExists(texturePath);
  fileUtils.createFolderIfNotExists(texturePath, 'items');
  fileUtils.copyFileIfNotExists(
    path.join(defaultPath.assets.items, `${textureExampleAssets}.png`),
    path.join(texturePath, 'items', `${options.itemName}.png`)
  );
  createItemTextureConfig(
    path.join(texturePath, 'item_texture.json'),
    options.itemName
  );

  // Create attachable entry, if needed
  if (options.type == 'armor') {
    attachable.createAttachable(name, options);
  }

  // Create texts and language entry
  const textsPath = path.join(resourcePackPath, 'texts');
  fileUtils.createFolderIfNotExists(textsPath);
  fileUtils.createFileIfNotExists(textsPath, 'en_US.lang');
  language.addLanguageText(
    path.join(textsPath, 'en_US.lang'),
    `item.${options.id}.name`,
    name
  );

  // Store item configuration, if needed
  configurationUtils.saveDefaultConfig(`item_${options.id}.mbu`, options);
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
  const item = generators.item.getItemConfig(options);
  fs.writeFileSync(file, JSON.stringify(item, null, 2));
  return item;
};

/**
 * @param {String} file
 * @param {Object} options
 * @return {Object} Item Definition
 */
const createResourceConfig = (file, options = {}) => {
  if (fs.existsSync(file)) {
    if (!options.overwrite) {
      console.error(
        chalk.red('Resource config file already exists under', file)
      );
      return;
    } else {
      console.warn(
        chalk.orange('Overwriting existing resource config file', file)
      );
    }
  }
  const item = generators.item.getResourceConfig(options);
  fs.writeFileSync(file, JSON.stringify(item, null, 2));
  return item;
};

/**
 * @param {string} search_path
 * @return {Object}
 */
const getItems = (search_path = defaultPath.project.path) => {
  let behaviorPackPath = defaultPath.bedrock.behaviorPack;
  let resourcePackPath = defaultPath.bedrock.resourcePack;
  if (search_path != defaultPath.project.path) {
    behaviorPackPath = fileFinderUtils.getBehaviorPackInSearchPath(search_path);
    resourcePackPath = fileFinderUtils.getResourcePackInSearchPath(search_path);
  }
  const items = {};

  // Search for items inside behavior pack.
  if (behaviorPackPath) {
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
  }

  // Search for items inside resource pack.
  if (resourcePackPath) {
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
              category:
                itemData['minecraft:item'].description.category || 'misc',
              behavior: false,
              resource: true,
            };
          }
        }
      });
  }

  return items;
};

/**
 * @param {String} name
 * @param {String} namespace
 * @return {String}
 */
const getId = (name, namespace = defaultNamespace) => {
  return `${namespace}:${normalizeHelper.normalizeName(name)}`;
};

/**
 * @param {String} name
 * @param {String} namespace
 * @return {Boolean}
 */
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
