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

/**
 * @param {String} type
 * @return {String}
 */
const getItemTypeIcon = (type) => {
  switch (type) {
    case 'armor':
      return '🛡️';
    case 'boots':
      return '🥾';
    case 'blockPlacer':
      return '🔲';
    case 'chestplate':
      return '👕';
    case 'digger':
      return '⛏️';
    case 'dyePowder':
      return '✨';
    case 'entityPlacer':
      return '🕷️';
    case 'food':
      return '🍎';
    case 'fuel':
      return '🛢️';
    case 'projectile':
      return '🏹';
    case 'throwable':
      return '❄️';
    case 'helmet':
      return '⛑';
    case 'weapon':
      return '⚔️';
    case 'leggings':
    case 'wearable':
      return '👖';
    case 'custom':
    default:
      return '✏️';
  }
};

/**
 * @param {String} type
 * @return {String}
 */
const getItemTypeIconForSelection = (type) => {
  return `  ${getItemTypeIcon(type)}\t`;
};

const newItemTemplate = (
  type = 'custom',
  version = stableVersion,
  choices = [],
  variation = ''
) => {
  const result = {
    name: type,
    message: `Please provide the following information for the ${type} item ${getItemTypeIcon(
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
        initial: `New ${type} ${variation ? variation + ' ' : ''}item`,
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

exports.newItemType = new Select({
  name: 'itemType',
  message: 'Select the item type you want to create',
  choices: [
    {
      name: 'custom',
      message: `${getItemTypeIconForSelection(
        'custom'
      )}  Custom item (e.g. custom items)`,
    },
    {
      name: 'armor',
      message: `${getItemTypeIconForSelection(
        'armor'
      )}  Armor item (e.g. helmet, chestplate, ...)`,
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
      message: `${getItemTypeIconForSelection(
        'dyePowder'
      )}Dye powder item (e.g. red, green, blue, ...)`,
      disabled: true,
    },
    {
      name: 'entityPlacer',
      message: `${getItemTypeIconForSelection(
        'entityPlacer'
      )}  Planter item for entities (e.g. spider on web)`,
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
      message: `${getItemTypeIconForSelection(
        'projectile'
      )} Projectile item (e.g. arrow)`,
      disabled: true,
    },
    {
      name: 'throwable',
      message: `${getItemTypeIconForSelection(
        'throwable'
      )}  Throwable item (e.g. snowball)`,
    },
    {
      name: 'weapon',
      message: `${getItemTypeIconForSelection(
        'weapon'
      )}  Weapon item (e.g. axe, sword, ...)`,
    },
    {
      name: 'wearable',
      message: `${getItemTypeIconForSelection(
        'wearable'
      )} Wearable item (e.g. cloth)`,
      disabled: true,
    },
  ],
});

exports.newArmorType = new Select({
  name: 'armorType',
  message: 'Select the armor type you want to create',
  choices: [
    {
      name: 'custom',
      message: `${getItemTypeIconForSelection('custom')}   Custom armor`,
    },
    {
      name: 'boots',
      message: `${getItemTypeIconForSelection('boots')} Boots`,
    },
    {
      name: 'chestplate',
      message: `${getItemTypeIconForSelection('chestplate')}  Chestplate`,
    },
    {
      name: 'helmet',
      message: `${getItemTypeIconForSelection('helmet')}  Helmet`,
    },
    {
      name: 'leggings',
      message: `${getItemTypeIconForSelection('leggings')}  Leggings`,
    },
  ],
});

exports.newArmorItem = (armor_type) => {
  const armorItemSelection = [
    {
      name: 'armor_type',
      message: 'Armor Type',
      initial: armor_type,
      hidden: true,
    },
    {
      name: 'protection',
      message: 'Protection 🧪',
      initial: '5',
    },
    {
      name: 'texture_type',
      message: 'Texture type (e.g. diamond, gold, ...) 🧪',
      initial: '',
    },
    {
      name: 'max_stack_size',
      message: 'Max stack size',
      initial: '1',
    },
  ];
  switch (armor_type) {
    case 'boots':
    case 'chestplate':
    case 'helmet':
      armorItemSelection.push({
        name: 'textures_default',
        message: 'Texture (default)',
        initial: 'textures/models/armor/armor_1',
      });
      break;
    case 'leggings':
      armorItemSelection.push({
        name: 'textures_default',
        message: 'Texture (default)',
        initial: 'textures/models/armor/armor_2',
      });
      break;
    case 'custom':
      armorItemSelection.push({
        name: 'render_offset',
        message: 'Render offset',
        initial: 'chestplates',
      });
      armorItemSelection.push({
        name: 'wearable_slot',
        message: 'Wearable slot',
        initial: 'slot.armor.chest',
      });
      armorItemSelection.push({
        name: 'textures_default',
        message: 'Texture (default)',
        initial: 'textures/models/armor/armor_custom',
      });
      break;
  }
  armorItemSelection.push({
    name: 'textures_enchanted',
    message: 'Texture (enchanted)',
    initial: 'textures/misc/enchanted_armor',
  });
  return new Form(
    newItemTemplate(
      `armor`,
      experimentalVersion,
      armorItemSelection,
      armor_type
    )
  );
};

exports.newDiggerItem = new Form(
  newItemTemplate('digger', experimentalVersion, [
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
  newItemTemplate('food', stableVersion, [
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
  newItemTemplate('fuel', experimentalVersion, [
    {
      name: 'duration',
      message: 'Duration 🧪',
      initial: '3',
    },
  ])
);

exports.newThrowableItem = new Form(
  newItemTemplate('throwable', experimentalVersion, [
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
  newItemTemplate('weapon', stableVersion, [
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

exports.newCustomItem = new Form(newItemTemplate('custom item', 'custom'));
