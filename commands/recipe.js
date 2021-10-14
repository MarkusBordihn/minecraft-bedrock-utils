/**
 * @file Minecraft Bedrock Utils - Recipe commands
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const recipes = require('../utils/recipes.js');
const preChecks = require('../utils/preChecks.js');
const prompts = require('./recipePrompts.js');

/**
 * @param {String} name
 * @param {Object} options
 */
const add = (name, options = {}) => {
  // Only add items if we found any existing projects.
  if (preChecks.errorNonExistingBehaviorPack()) {
    console.info(
      '\nTip: Use "npx minecraft-bedrock-utils new" to create a new project.\n'
    );
    return;
  }

  // If no name was provided start interactive questions.
  if (!name) {
    // Step 1: Ask for basic information.
    prompts.newRecipePrompt
      .run()
      .then((base_answers) => {
        // Early warning if recipe already exists!
        if (recipes.existingRecipe(base_answers.name, base_answers.namespace)) {
          console.error(
            chalk.red(
              `Recipe ${recipes.getId(
                base_answers.name,
                base_answers.namespace
              )} already exists!`
            )
          );
          return;
        }
        // Step 2: Ask for items which are part of the recipe.
        prompts.recipeItemListPrompt
          .run()
          .then((item_list_answers) => {
            for (const [key, value] of Object.entries(item_list_answers)) {
              if (value) {
                console.log(`Field ${key.substr(5).toUpperCase()}: ${value}`);
              }
            }
            // Step 3: Ask for position inside item grid.
            prompts.recipeGridPrompt
              .run()
              .then((item_grid_answers) => {
                add(base_answers.name, {
                  ...base_answers,
                  ...item_list_answers,
                  ...item_grid_answers,
                });
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
    return;
  }

  // Adding default options, if missing
  if (!options.namespace) {
    options.namespace =
      process.env.npm_package_config_project_namespace || 'my_item';
  }
  if (!options.format_version) {
    options.format_version = '1.16.1';
  }

  // Only create new recipe if we don't found any existing recipe.
  if (recipes.existingRecipe(name, options.namespace)) {
    console.error(
      chalk.red(
        `Recipe ${recipes.getId(name, options.namespace)} already exists!`
      )
    );
    return;
  }

  // Warn user if this required an experimental flag
  preChecks.warnExperimentalVersion(options.format_version);

  recipes.createRecipe(name, options);
};

/**
 * @param {String} search_path
 */
const list = (search_path) => {
  const possibleRecipes = recipes.getRecipes(search_path);
  if (Object.keys(possibleRecipes).length > 0) {
    console.log('List of recipes', possibleRecipes);
  } else {
    console.log(chalk.red('Found no recipes.'));
    console.info(
      '\nTip: Use "npx minecraft-bedrock-utils add recipe" to add a new recipe.\n'
    );
  }
};

exports.add = add;
exports.list = list;
