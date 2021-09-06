/**
 * @fileoverview Minecraft Bedrock Utils - Manifest lib
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
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const readManifest = (file) => {
  if (!fs.existsSync(file)) {
    console.error(chalk.red('Unable to find manifest file at', file));
  }
  const manifestFilePath = file.endsWith('manifest.json')
    ? file
    : path.join(file, 'manifest.json');
  const manifestFile = fs.readFileSync(manifestFilePath);
  return JSON.parse(manifestFile);
};

const createManifest = (file, options = {}) => {
  if (fs.existsSync(file)) {
    if (!options.overwrite) {
      console.error(chalk.red('Manifest file already exists under', file));
      return;
    } else {
      console.warn(chalk.orange('Overwriting existing manifest file', file));
    }
  }
  const manifest = getManifest(options);
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2));
  return manifest;
};

const getManifest = (options = {}) => {
  const result = {
    format_version: 2,
    header: {
      name: options.name,
      description: options.description || '',
      uuid: uuidv4(),
      version: options.version || [1, 0, 0],
      min_engine_version: options.minEngineVersion || [1, 17, 0],
    },
    modules: [],
    dependencies: [],
  };

  // Handle general options
  if (options.dependencies) {
    result.dependencies = options.dependencies;
  }

  // Handle different types of manifest
  if (options.type == 'behaviour') {
    result.modules.push({
      type: 'data',
      uuid: uuidv4(),
      version: options.version || [1, 0, 0],
    });
    if (!result.header.description) {
      result.header.description = 'Behaviour Pack for ' + options.name;
    }
  } else if (options.type == 'resource') {
    result.modules.push({
      type: 'resources',
      uuid: uuidv4(),
      version: options.version || [1, 0, 0],
    });
    if (!result.header.description) {
      result.header.description = 'Resource Pack for ' + options.name;
    }
  }

  return result;
};

exports.readManifest = readManifest;
exports.createManifest = createManifest;
exports.getManifest = getManifest;
