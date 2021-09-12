/**
 * @fileoverview Minecraft Bedrock Utils - Recipe commands
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
        prompts.recipeItemListPrompt
          .run()
          .then((item_list_answers) => {
            for (const [key, value] of Object.entries(item_list_answers)) {
              if (value) {
                console.log(`Field ${key.substr(5).toUpperCase()}: ${value}`);
              }
            }
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

  // Only create new recipe if we don't found any existing recipe.
  if (recipes.existingRecipe(name, options.namespace)) {
    console.error(
      chalk.red(
        `Recipe ${recipes.getId(name, options.namespace)} already exists!`
      )
    );
    return;
  }
  if (!options.name) {
    options.name = name;
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
