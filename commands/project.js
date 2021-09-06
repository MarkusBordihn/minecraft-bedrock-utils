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

const chalk = require('chalk');
const defaultPath = require('../utils/path.js');
const manifest = require('../utils/manifest.js');
const path = require('path');
const { Form } = require('enquirer');

const newProjectPrompt = new Form({
  name: 'user',
  message: 'Please provide the following information for the project:',
  choices: [
    {
      name: 'name',
      message: 'Project Name',
      initial: process.env.npm_package_name || 'New cool items',
    },
    {
      name: 'version',
      message: 'Version',
      initial: process.env.npm_package_version || '1.0.0',
    },
    {
      name: 'behaviourPackDescription',
      message: 'Behaviour Pack Description',
      initial: 'Behaviour Pack',
    },
    {
      name: 'resourcePackDescription',
      message: 'Resource Pack Description',
      initial: 'Resource Pack',
    },
    {
      name: 'minEngineVersion',
      message: 'Min Engine Version',
      initial: '1.17.0',
    },
    {
      name: 'preCreateFiles',
      message: 'Pre-create folders and files like items, texts, ...',
      initial: 'false',
    },
  ],
});

const newProject = (name, options = {}) => {
  // Only create new projects if we don't found any existing projects.
  const behaviorPackPath =
    defaultPath.getPossibleBehaviorPackInSearchPath(name);
  const resourcePackPath =
    defaultPath.getPossibleResourcePackPackInSearchPath(name);
  if (behaviorPackPath || resourcePackPath) {
    if (behaviorPackPath) {
      console.error(
        chalk.red(
          'Found already existing behavior pack under',
          behaviorPackPath
        )
      );
    }
    if (resourcePackPath) {
      console.error(
        chalk.red(
          'Found already existing resource pack under',
          resourcePackPath
        )
      );
    }
    console.error('Please fix the above issues to create a new project!');
    return;
  }

  // If no name was provided start interactive questions.
  if (!name) {
    newProjectPrompt
      .run()
      .then((value) => {
        console.log('Answer:', value);
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

  // Create new project with the provided information.

  // 1.) Create resource pack
  const resourcePackManifest = newResourcePack(name, {
    description: options.resourcePackDescription,
    minEngineVersion: minEngineVersion,
    preCreateFolders: options.preCreateFolders,
    version: version,
  });

  // 2.) Create behaviour pack with reference to resource pack
  newBehaviourPack(name, {
    description: options.behaviourPackDescription,
    dependencies: [
      {
        uuid: resourcePackManifest.header.uuid,
        version: resourcePackManifest.header.version,
      },
    ],
    minEngineVersion: minEngineVersion,
    preCreateFolders: options.preCreateFolders,
    version: version,
  });
};

const newBehaviourPack = (name, options = {}) => {
  const packPathName = defaultPath.normalizePathName(name) + '_BehaviourPack';
  const manifestPathName = path.join(packPathName, 'manifest.json');
  console.log(
    'Creating new BehaviourPack',
    chalk.green(name),
    'under',
    packPathName,
    '...'
  );

  // Create project folder
  defaultPath.createFolderIfNotExists(packPathName);

  // Create additional files
  if (options.preCreateFiles == 'true' || options.preCreateFiles == 'yes') {
    defaultPath.createFolderIfNotExists(packPathName, 'items');
  }

  // Autocomplete Options if needed
  if (!options.name) {
    options.name = name;
  }
  if (!options.type) {
    options.type = 'behaviour';
  }

  // Add default pack_icon.png

  // Create and return manifest.json
  return manifest.createManifest(manifestPathName, options);
};

const newResourcePack = (name, options = {}) => {
  const packPathName = defaultPath.normalizePathName(name) + '_ResourcePack';
  const manifestPathName = path.join(packPathName, 'manifest.json');
  console.log(
    'Creating new ResourcePack',
    chalk.green(name),
    'under',
    packPathName,
    '...'
  );

  // Create project folder
  defaultPath.createFolderIfNotExists(packPathName);

  // Create additional files
  if (options.preCreateFiles == 'true' || options.preCreateFiles == 'yes') {
    defaultPath.createFolderIfNotExists(packPathName, 'items');
    defaultPath.createFolderIfNotExists(packPathName, 'texts');
    defaultPath.createFolderIfNotExists(packPathName, 'textures');
  }

  // Autocomplete Options if needed
  if (!options.name) {
    options.name = name;
  }
  if (!options.type) {
    options.type = 'resource';
  }

  // Add default pack_icon.png

  // Create and return manifest.json
  return manifest.createManifest(manifestPathName, options);
};

exports.newProject = newProject;
