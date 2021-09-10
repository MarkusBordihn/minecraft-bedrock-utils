/**
 * @fileoverview Minecraft Bedrock Utils - Add item command prompts
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

const defaultPath = require('../utils/path.js');
const enquirerHelper = require('../utils/enquirer');
const fs = require('fs');
const path = require('path');
const { Form, Select } = require('enquirer');

const newItemTemplate = (name, type = 'other', choices = []) => {
  const result = {
    name: type,
    message: `Please provide the following information for the ${name}:`,
    choices: [
      {
        name: 'type',
        message: 'Item Type',
        initial: type,
        hidden: true,
      },
      {
        name: 'name',
        message: 'Item Name',
        initial: `New ${name}`,
        validate(value) {
          if (
            value &&
            fs.existsSync(
              path.join(
                defaultPath.possibleBehaviorPackInWorkingPath,
                'items',
                `${value}.json`
              )
            )
          ) {
            return exports.newCustomItem.styles.red(
              `Item ${value} already exists!`
            );
          }
          return true;
        },
      },
      {
        name: 'namespace',
        message: 'Namespace',
        initial: process.env.npm_package_config_project_namespace || 'my_item',
      },
      {
        name: 'format_version',
        message: 'Format Version',
        initial: '1.16.1',
      },
    ],
  };
  if (choices.length > 0) {
    result.choices = result.choices.concat(choices);
  }
  return result;
};

exports.newItem = new Select({
  name: 'itemType',
  message: 'Please select the item type you want to create',
  choices: [
    { name: 'other', message: '  ✏️\t  Custom item (e.g. custom items)' },
    {
      name: 'armor',
      message: '  🛡️\t  Armor item (e.g. helmet, chestplate, ...)',
      disabled: true,
    },
    {
      name: 'blockPlayer',
      message: '  🔲\t Planter item for blocks (e.g. seeds)',
      disabled: true,
    },
    {
      name: 'digger',
      message: '  ⛏️\t  Digger item (e.g. pickaxe)',
    },
    {
      name: 'dyePowder',
      message: '  ✨\tDye powder item (e.g. red, green, blue, ...)',
      disabled: true,
    },
    {
      name: 'entityPlacer',
      message: '  🕷️\t  Planter item for entities (e.g. spider on web)',
      disabled: true,
    },
    { name: 'food', message: '  🍎\t Food item (e.g. apple)' },
    { name: 'fuel', message: '  🛢️\t  Fuel item (e.g. coal)' },
    {
      name: 'projectile',
      message: '  🏹\t Projectile item (e.g. arrow)',
      disabled: true,
    },
    {
      name: 'throwable',
      message: '  ❄️\t  Throwable item (e.g. snowball)',
      disabled: true,
    },
    {
      name: 'weapon',
      message: '  ⚔️\t  Weapon item (e.g. axe, sword, ...)',
      disabled: true,
    },
    {
      name: 'wearable',
      message: '  👖\t Wearable item (e.g. cloth)',
      disabled: true,
    },
  ],
});

exports.newDiggerItem = new Form(
  newItemTemplate('digger item', 'digger', [
    {
      name: 'use_efficiency',
      message: 'Use Efficiency 🧪',
      enabled: false,
      format(input, choice) {
        return enquirerHelper.formatBoolean(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
    },
    {
      name: 'destroy_speeds',
      message: 'Destroy speed 🧪',
      enabled: false,
      format(input, choice) {
        return enquirerHelper.formatOptional(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
    },
    {
      name: 'on_dig',
      message: 'On Dig action (for unlisted blocks) 🧪',
      initial: '',
    },
    {
      name: 'hand_equipped',
      message: 'Hand equipped',
      enabled: true,
      format(input, choice) {
        return enquirerHelper.formatBoolean(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
    },
    {
      name: 'max_stack_size',
      message: 'Max stack size',
      initial: '1',
    },
  ])
);

exports.newFoodItem = new Form(
  newItemTemplate('food item', 'food', [
    {
      name: 'can_always_eat',
      message: 'Can always eat',
      initial: false,
      format(input, choice) {
        return enquirerHelper.formatBoolean(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
    },
    {
      name: 'nutrition',
      message: 'Nutrition (number)',
      initial: '4',
    },
    {
      name: 'effects',
      message: 'Effects',
      enabled: false,
      format(input, choice) {
        return enquirerHelper.formatOptional(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
    },
    {
      name: 'saturation_modifier',
      message: 'Saturation Modifier',
      initial: 'low',
    },
    {
      name: 'using_converts_to',
      message: 'Using Converts to	(e.g. bowl) 🧪',
      initial: '',
    },
    {
      name: 'use_duration',
      message: 'Use duration',
      initial: '8',
    },
    {
      name: 'use_animation',
      message: 'Use Animation',
      initial: 'eat',
    },
  ])
);

exports.newFuelItem = new Form(
  newItemTemplate('fuel item', 'fuel', [
    {
      name: 'duration',
      message: 'Duration 🧪',
      initial: '3',
    },
  ])
);

exports.newCustomItem = new Form(newItemTemplate('custom item', 'other'));
