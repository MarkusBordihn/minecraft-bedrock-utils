/**
 * @fileoverview Minecraft Bedrock Utils - Item command prompts
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
const items = require('../utils/items.js');
const path = require('path');
const { Form, Select } = require('enquirer');

const stableVersion = '1.16.1';
const experimentalVersion = '1.16.100';

const getItemTypeIcon = (type) => {
  switch (type) {
    case 'armor':
      return '🛡️';
    case 'blockPlacer':
      return '🔲';
    case 'digger':
      return '⛏️';
    case 'food':
      return '🍎';
    case 'fuel':
      return '🛢️';
    case 'throwable':
      return '❄️';
    case 'weapon':
      return '⚔️';
    default:
      return '';
  }
};

const getItemTypeIconForSelection = (type) => {
  return `  ${getItemTypeIcon(type)}\t`;
};

const newItemTemplate = (
  name,
  type = 'other',
  version = stableVersion,
  choices = []
) => {
  const result = {
    name: type,
    message: `Please provide the following information for the ${name} ${getItemTypeIcon(
      type
    )}`,
    choices: [
      {
        name: 'type',
        message: `Item Type`,
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
                `${items.normalizeName(value)}.json`
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
        initial: version,
      },
      {
        name: 'foil',
        message: 'Foil 🧪',
        enabled: false,
        format(input, choice) {
          return enquirerHelper.formatBoolean(input, choice, this);
        },
        result(value, choice) {
          return choice.enabled;
        },
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
      message: `${getItemTypeIconForSelection(
        'armor'
      )}  Armor item (e.g. helmet, chestplate, ...)`,
      disabled: true,
    },
    {
      name: 'blockPlacer',
      message: `${getItemTypeIconForSelection(
        'blockPlacer'
      )} Planter item for blocks (e.g. seeds)`,
      disabled: true,
    },
    {
      name: 'digger',
      message: `${getItemTypeIconForSelection(
        'digger'
      )}  Digger item (e.g. pickaxe)`,
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
    {
      name: 'food',
      message: `${getItemTypeIconForSelection('food')} Food item (e.g. apple)`,
    },
    {
      name: 'fuel',
      message: `${getItemTypeIconForSelection('fuel')}  Fuel item (e.g. coal)`,
    },
    {
      name: 'projectile',
      message: '  🏹\t Projectile item (e.g. arrow)',
      disabled: true,
    },
    {
      name: 'throwable',
      message: '  ❄️\t  Throwable item (e.g. snowball)',
    },
    {
      name: 'weapon',
      message: '  ⚔️\t  Weapon item (e.g. axe, sword, ...)',
    },
    {
      name: 'wearable',
      message: '  👖\t Wearable item (e.g. cloth)',
      disabled: true,
    },
  ],
});

exports.newDiggerItem = new Form(
  newItemTemplate('digger item', 'digger', experimentalVersion, [
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
  newItemTemplate('food item', 'food', stableVersion, [
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
  newItemTemplate('fuel item', 'fuel', experimentalVersion, [
    {
      name: 'duration',
      message: 'Duration 🧪',
      initial: '3',
    },
  ])
);

exports.newThrowableItem = new Form(
  newItemTemplate('throwable item', 'throwable', experimentalVersion, [
    {
      name: 'do_swing_animation',
      message: 'Do swing animation 🧪',
      enabled: true,
      format(input, choice) {
        return enquirerHelper.formatBoolean(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
    },
    {
      name: 'launch_power_scale',
      message: 'Launch power scale 🧪',
      initial: '1.0',
    },
    {
      name: 'max_draw_duration',
      message: 'Max draw duration 🧪',
      initial: '0.0',
    },
    {
      name: 'max_launch_power',
      message: 'Max launch power 🧪',
      initial: '1.0',
    },
    {
      name: 'min_draw_duration',
      message: 'Min draw duration 🧪',
      initial: '0.0',
    },
    {
      name: 'scale_power_by_draw_duration',
      message: 'Scale power by draw duration 🧪',
      enabled: true,
      format(input, choice) {
        return enquirerHelper.formatBoolean(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
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
      name: 'use_duration',
      message: 'Use duration',
      initial: '3600',
    },
  ])
);

exports.newWeaponItem = new Form(
  newItemTemplate('weapon item', 'weapon', stableVersion, [
    {
      name: 'on_hit_block',
      message: 'On hit block 🧪',
      initial: '',
    },
    {
      name: 'on_hurt_entity',
      message: 'On hurt entity 🧪',
      initial: '',
    },
    {
      name: 'on_not_hurt_entity',
      message: 'On not hurt entity 🧪',
      initial: '',
    },
    {
      name: 'damage',
      message: 'Damage 🧪',
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

exports.newCustomItem = new Form(newItemTemplate('custom item', 'other'));
