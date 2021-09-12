/**
 * @fileoverview Minecraft Bedrock Utils - Recipe command prompts
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
const fs = require('fs');
const path = require('path');
const recipes = require('../utils/recipes.js');
const { Form, Snippet } = require('enquirer');

const defaultFormatVersion = '1.16.1';

exports.newRecipePrompt = new Form({
  name: 'recipe',
  message: 'Please provide the following information for the recipe:',
  choices: [
    {
      name: 'name',
      message: 'Recipe Name (e.g. result name)',
      initial: 'New recipe',
      validate(value) {
        if (
          value &&
          fs.existsSync(
            path.join(
              defaultPath.possibleBehaviorPackInWorkingPath,
              'recipes',
              `${recipes.normalizeName(value)}.json`
            )
          )
        ) {
          return exports.newRecipePrompt.styles.red(
            `Recipe ${value} already exists!`
          );
        }
        return true;
      },
    },
    {
      name: 'namespace',
      message: 'Namespace',
      initial: process.env.npm_package_config_project_namespace || 'my_recipe',
    },
    {
      name: 'format_version',
      message: 'Format version',
      initial: defaultFormatVersion,
    },
    {
      name: 'result_item',
      message: 'Result item (e.g. minecraft:crossbow)',
      initial: '',
    },
    {
      name: 'result_amount',
      message: 'Amount',
      initial: '1',
    },
  ],
});

exports.recipeItemListPrompt = new Form({
  name: 'recipeList',
  message:
    'Please provide items (e.g. minecraft:stick) which are required for this recipe (min. 1 / max. 9):',
  choices: [
    {
      name: 'item_#',
      message: 'Item [#]',
      initial: '',
    },
    {
      name: 'item_-',
      message: 'Item [-]',
      initial: '',
    },
    {
      name: 'item_x',
      message: 'Item [X]',
      initial: '',
    },
    {
      name: 'item_|',
      message: 'Item [|]',
      initial: '',
    },
    {
      name: 'item_a',
      message: 'Item [A]',
      initial: '',
    },
    {
      name: 'item_b',
      message: 'Item [B]',
      initial: '',
    },
    {
      name: 'item_c',
      message: 'Item [C]',
      initial: '',
    },
    {
      name: 'item_d',
      message: 'Item [D]',
      initial: '',
    },
    {
      name: 'item_E',
      message: 'Item [E]',
      initial: '',
    },
  ],
});

exports.recipeGridPrompt = new Snippet({
  name: 'itemGrid',
  message: 'Define the position of the items inside the grid',
  fields: [
    {
      name: 'field_a_1',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_a_2',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_a_3',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_b_1',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_b_2',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_b_3',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_c_1',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_c_2',
      message: '',
      initial: ' ',
    },
    {
      name: 'field_c_3',
      message: '',
      initial: ' ',
    },
  ],
  template: `
    ╔═══════════╗
    ║ \${field_a_1} ║ \${field_a_2} ║ \${field_a_3} ║
    ╠═══╬═══╬═══╣
    ║ \${field_b_1} ║ \${field_b_2} ║ \${field_b_3} ║
    ╠═══╬═══╬═══╣
    ║ \${field_c_1} ║ \${field_c_2} ║ \${field_c_3} ║
    ╚═══════════╝
Use the cursor keys (down and up) to navigate inside the grid.

Please use only the previous defined placeholders like: #, -, X, |, A, B, ...
`,
});
