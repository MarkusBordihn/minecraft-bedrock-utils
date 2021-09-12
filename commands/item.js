/**
 * @fileoverview Minecraft Bedrock Utils - Item commands
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
const items = require('../utils/items.js');
const preChecks = require('../utils/preChecks.js');
const prompts = require('./itemPrompts.js');

/**
 * @param {String} name
 * @param {Object} options
 */
const add = (name, options = {}) => {
  // Only add items if we found any existing projects.
  if (preChecks.errorNonExistingPack()) {
    console.info(
      '\nTip: Use "npx minecraft-bedrock-utils new" to create a new project.\n'
    );
    return;
  }

  // If no name was provided start interactive questions.
  if (!name) {
    prompts.newItem
      .run()
      .then((type) => {
        console.log(
          '🏷️  = placeholder\t🧪 = experimental (format version >= 1.16.100)'
        );
        switch (type) {
          case 'digger':
            prompts.newDiggerItem
              .run()
              .then((answers) => add(answers.name, answers))
              .catch(console.error);
            break;
          case 'food':
            prompts.newFoodItem
              .run()
              .then((answers) => add(answers.name, answers))
              .catch(console.error);
            break;
          case 'fuel':
            prompts.newFuelItem
              .run()
              .then((answers) => add(answers.name, answers))
              .catch(console.error);
            break;
          case 'throwable':
            prompts.newThrowableItem
              .run()
              .then((answers) => add(answers.name, answers))
              .catch(console.error);
            break;
          case 'weapon':
            prompts.newWeaponItem
              .run()
              .then((answers) => add(answers.name, answers))
              .catch(console.error);
            break;
          case 'other':
          default:
            prompts.newCustomItem
              .run()
              .then((answers) => add(answers.name, answers))
              .catch(console.error);
            break;
        }
      })
      .catch(console.error);
    return;
  }
  // Only create new item if we don't found any existing item.
  if (items.existingItem(name, options.namespace)) {
    console.error(
      chalk.red(`Item ${items.getId(name, options.namespace)} already exists!`)
    );
    return;
  }
  if (!options.name) {
    options.name = name;
  }

  // Warn user if this required an experimental flag
  preChecks.warnExperimentalVersion(options.format_version);

  items.createItem(name, options);
};

/**
 * @param {String} search_path
 */

const list = (search_path) => {
  const possibleItems = items.getItems(search_path);
  if (Object.keys(possibleItems).length > 0) {
    console.log('List of Items', possibleItems);
  } else {
    console.log(chalk.red('Found no items.'));
    console.info(
      '\nTip: Use "npx minecraft-bedrock-utils add item" to add a new item.\n'
    );
  }
};

exports.add = add;
exports.list = list;
