/**
 * @fileoverview Minecraft Bedrock Utils - project command
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
const packs = require('../utils/packs.js');
const preChecks = require('../utils/preChecks.js');
const { Form } = require('enquirer');

const newProjectPrompt = new Form({
  name: 'project',
  message: 'Please provide the following information for the project:',
  choices: [
    {
      name: 'name',
      message: 'Project Name',
      initial:
        process.env.npm_package_config_project_name ||
        process.env.npm_package_name ||
        'New cool project',
    },
    {
      name: 'nameDir',
      message: 'Folder Name',
      initial:
        process.env.npm_package_config_project_folder_name ||
        defaultPath.normalizePathName(
          process.env.npm_package_config_project_name
        ) ||
        defaultPath.normalizePathName(process.env.npm_package_name) ||
        'New_cool_items',
    },
    {
      name: 'version',
      message: 'Version',
      initial: process.env.npm_package_version || '1.0.0',
    },
    {
      name: 'behaviorPackDescription',
      message: 'Behavior Pack Description',
      initial:
        'Behavior Pack for ' +
        (process.env.npm_package_config_project_name ||
          process.env.npm_package_name ||
          'New cool items'),
    },
    {
      name: 'resourcePackDescription',
      message: 'Resource Pack Description',
      initial:
        'Resource Pack for ' +
        (process.env.npm_package_config_project_name ||
          process.env.npm_package_name ||
          'New cool items'),
    },
    {
      name: 'minEngineVersion',
      message: 'Min Engine Version',
      initial: '1.17.0',
    },
    {
      name: 'preCreateFiles',
      message: 'Pre-create folders and files like items, texts, ...',
      enabled: false,
      format(input, choice) {
        return enquirerHelper.formatBoolean(input, choice, this);
      },
      result(value, choice) {
        return choice.enabled;
      },
    },
  ],
});

/**
 * @param {String} name
 * @param {Object} options
 */
const newProject = (name, options = {}) => {
  // Only create new projects if we don't found any existing projects.
  if (preChecks.errorExistingPack()) {
    console.error('Please fix the above issues to create a new project!');
    return;
  }

  // If no name was provided start interactive questions.
  if (!name) {
    newProjectPrompt
      .run()
      .then((value) => {
        newProject(value.name, value);
      })
      .catch(console.error);
    return;
  }

  // Set Project details
  const version = options.version
    ? options.version.split('.').map((part) => {
        return Number(part);
      })
    : [1, 0, 0];
  const minEngineVersion = options.min_engine_version
    ? options.min_engine_version.split('.').map((part) => {
        return Number(part);
      })
    : [1, 17, 0];
  const nameDir = defaultPath.normalizePathName(
    options.nameDir ? options.nameDir : name
  );

  // 1.) Create resource pack
  const resourcePackManifest = packs.newResourcePack(name, {
    description: options.resourcePackDescription,
    minEngineVersion: minEngineVersion,
    nameDir: nameDir,
    preCreateFiles: options.preCreateFiles,
    version: version,
  });

  // 2.) Create behavior pack with reference to resource pack
  packs.newBehaviorPack(name, {
    description: options.behaviorPackDescription,
    dependencies: [
      {
        uuid: resourcePackManifest.header.uuid,
        version: resourcePackManifest.header.version,
      },
    ],
    minEngineVersion: minEngineVersion,
    nameDir: nameDir,
    preCreateFiles: options.preCreateFiles,
    version: version,
  });
};

exports.newProject = newProject;
