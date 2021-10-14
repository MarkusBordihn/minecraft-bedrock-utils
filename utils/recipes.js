/**
 * @file Minecraft Bedrock Utils - Recipes lib
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const {
  defaultPath,
  fileFinderUtils,
  fileUtils,
  normalizeHelper,
} = require('minecraft-utils-shared');

const defaultNamespace = 'my_recipes';
const defaultFormatVersion = '1.16.1';

/**
 * @param {String} name
 * @param {Object} options
 */
const createRecipe = (name, options = {}) => {
  const behaviorPackPath = defaultPath.bedrock.behaviorPack;
  const recipeName = normalizeHelper.normalizeName(name || 'my_recipe');

  // Make sure config includes name
  if (!options.name) {
    options.name = name;
  }

  // Create recipe config in behaviour pack
  fileUtils.createFolderIfNotExists(behaviorPackPath, 'recipes');
  createRecipeConfig(
    path.join(behaviorPackPath, 'recipes', `${recipeName}.json`),
    options
  );
};

/**
 * @param {string} search_path
 * @return {Object}
 */
const getRecipes = (search_path = defaultPath.project.path) => {
  const behaviorPackPath =
    search_path != defaultPath.project.path
      ? fileFinderUtils.getBehaviorPackInSearchPath(search_path)
      : defaultPath.bedrock.behaviorPack;
  const recipes = {};

  // Search for recipes inside behavior pack.
  if (behaviorPackPath) {
    glob
      .sync(path.join(behaviorPackPath, 'recipes/*.json'), {
        nodir: true,
      })
      .map((file) => {
        const itemFile = fs.readFileSync(file);
        const itemData = JSON.parse(itemFile);
        if (itemData['minecraft:recipe_shaped']) {
          const identifier =
            itemData['minecraft:recipe_shaped'].description.identifier;
          recipes[identifier] = {
            tags: itemData['minecraft:recipe_shaped'].tags || [],
            result: itemData['minecraft:recipe_shaped'].result || [],
          };
        }
      });
  }

  return recipes;
};

/**
 * @param {String} file
 * @param {Object} options
 * @return {Object} Recipe Definition
 */
const createRecipeConfig = (file, options = {}) => {
  if (fs.existsSync(file)) {
    if (!options.overwrite) {
      console.error(chalk.red('Recipe config file already exists under', file));
      return;
    } else {
      console.warn(
        chalk.orange('Overwriting existing recipe config file', file)
      );
    }
  }
  const item = getRecipeConfig(options);
  fs.writeFileSync(file, JSON.stringify(item, null, 2));
  return item;
};

/**
 * @param {Object} options
 * @return {Object} Recipe Definition
 */
const getRecipeConfig = (options = {}) => {
  const name = options.name || 'my_recipe';
  const recipeId = getId(name, options.namespace);
  const formatVersion = options.format_version || defaultFormatVersion;
  const result = {
    format_version: formatVersion,
    'minecraft:recipe_shaped': {
      description: {
        identifier: recipeId,
      },
      tags: ['crafting_table'],
      pattern: [],
      key: {},
      result: {
        item: options.result_item || '',
        count: options.result_amount ? parseInt(options.result_amount) : 1,
      },
    },
  };

  // Adding all required items to the config.
  // eslint-disable-next-line compat/compat
  for (const [key, value] of Object.entries(options)) {
    if (key.startsWith('item_') && options[key]) {
      result['minecraft:recipe_shaped'].key[key.substr(5).toUpperCase()] = {
        item: value,
        data: 0,
      };
    }
  }

  // Handle crafting grid pattern
  if (options.values) {
    const craftingGridValues = {};
    // eslint-disable-next-line compat/compat
    for (const [key, value] of Object.entries(options.values)) {
      craftingGridValues[key] = value && value != ' ' ? value : '';
    }
    result['minecraft:recipe_shaped'].pattern =
      getOptimizedCraftingGridPattern(craftingGridValues);
  } else {
    result['minecraft:recipe_shaped'].pattern = [];
  }

  return result;
};

/**
 * @param {Object} grid
 * @return {Array}
 */
const getOptimizedCraftingGridPattern = (grid = {}) => {
  const isRowAUsed = grid.field_a_1 || grid.field_a_2 || grid.field_a_3;
  const isRowBUsed = grid.field_b_1 || grid.field_b_2 || grid.field_b_3;
  const isRowCUsed = grid.field_c_1 || grid.field_c_2 || grid.field_c_3;
  const isColAUsed = grid.field_a_1 || grid.field_b_1 || grid.field_c_1;
  const isColBUsed = grid.field_a_2 || grid.field_b_2 || grid.field_c_2;
  const isColCUsed = grid.field_a_3 || grid.field_b_3 || grid.field_c_3;

  // Make sure we normalized values before using
  const value_1 = grid.field_a_1.toUpperCase() || ' ';
  const value_2 = grid.field_a_2.toUpperCase() || ' ';
  const value_3 = grid.field_a_3.toUpperCase() || ' ';
  const value_4 = grid.field_b_1.toUpperCase() || ' ';
  const value_5 = grid.field_b_2.toUpperCase() || ' ';
  const value_6 = grid.field_b_3.toUpperCase() || ' ';
  const value_7 = grid.field_c_1.toUpperCase() || ' ';
  const value_8 = grid.field_c_2.toUpperCase() || ' ';
  const value_9 = grid.field_c_3.toUpperCase() || ' ';

  // 1. Possibility all 3 rows and columns are used.
  if (
    isRowAUsed &&
    isRowBUsed &&
    isRowCUsed &&
    isColAUsed &&
    isColBUsed &&
    isColCUsed
  ) {
    return [
      `${value_1}${value_2}${value_3}`,
      `${value_4}${value_5}${value_6}`,
      `${value_7}${value_8}${value_9}`,
    ];
  }

  // 2. Possibility only one field is used.
  let numberOfEntries = 0;
  let lastValidEntry = '';
  // eslint-disable-next-line compat/compat
  for (const value of Object.values(grid)) {
    if (value) {
      lastValidEntry = value;
      numberOfEntries++;
    }
  }
  if (numberOfEntries == 1 && lastValidEntry) {
    console.log('Only 1 entry to process', lastValidEntry);
    return [lastValidEntry.toUpperCase()];
  }

  // 3. Possibility not all columns are used.
  if (isColAUsed && !isColBUsed && !isColCUsed) {
    return [`${value_1}`, `${value_4}`, `${value_7}`];
  } else if (!isColAUsed && isColBUsed && !isColCUsed) {
    return [`${value_2}`, `${value_5}`, `${value_8}`];
  } else if (!isColAUsed && !isColBUsed && isColCUsed) {
    return [`${value_3}`, `${value_6}`, `${value_9}`];
  } else if (isColAUsed && isColBUsed && !isColCUsed) {
    return [
      `${value_1}${value_2}`,
      `${value_4}${value_5}`,
      `${value_7}${value_8}`,
    ];
  } else if (!isColAUsed && isColBUsed && isColCUsed) {
    return [
      `${value_2}${value_3}`,
      `${value_5}${value_6}`,
      `${value_8}${value_9}`,
    ];
  } else if (isColAUsed && !isColBUsed && isColCUsed) {
    return [
      `${value_1}${value_3}`,
      `${value_4}${value_6}`,
      `${value_7}${value_9}`,
    ];
  }

  // Fallback return the whole grid
  return [
    `${value_1}${value_2}${value_3}`,
    `${value_4}${value_5}${value_6}`,
    `${value_7}${value_8}${value_9}`,
  ];
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
const existingRecipe = (name, namespace = defaultNamespace) => {
  const possibleItems = getRecipes();
  const itemId = getId(name, namespace);
  if (possibleItems[itemId]) {
    return true;
  }
  return false;
};

exports.createRecipe = createRecipe;
exports.existingRecipe = existingRecipe;
exports.getId = getId;
exports.getRecipes = getRecipes;
