/**
 * @file Minecraft Bedrock Utils - Item commands
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const { configurationUtils } = require('minecraft-utils-shared');

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

  // Load options from config file for automated creation and tests.
  if (name && name.endsWith('.mbu')) {
    options = configurationUtils.loadConfig(name);
    name = options.name;
  }

  // If no name was provided start interactive questions.
  if (!name) {
    prompts.newItemType
      .run()
      .then((type) => {
        console.log(
          '🏷️  = placeholder\t🧪 = experimental (format version >= 1.16.100)'
        );
        switch (type) {
          case 'armor':
            prompts.newArmorType
              .run()
              .then((armorType) => {
                prompts
                  .newArmorItem(armorType)
                  .run()
                  .then((answers) => add(answers.name, answers))
                  .catch(console.error);
              })
              .catch(console.error);
            break;
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
          case 'custom':
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

  // Warn user if this required an experimental flag
  preChecks.warnExperimentalVersion(options['bedrock.formatVersion']);

  items.createItem(name, options);

  console.info(
    `\nTip: Use "${chalk.green(
      'npx minecraft-bedrock-utils run'
    )}" to copy your files and starting Minecraft.\n`
  );
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
