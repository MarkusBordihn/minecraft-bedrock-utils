/**
 * @fileoverview Minecraft Bedrock Utils - Config lib
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

const fs = require('fs');
const path = require('path');

const defaultPath = require('../utils/path.js');
const files = require('./files.js');

const extension = '.mbu';
const configPath = '.minecraft-bedrock-utils';

/**
 * @param {String} file
 * @return {Object}
 */
const loadConfig = (file) => {
  if (!fs.existsSync(file)) {
    console.error('Unable to load configuration file', file);
    return {};
  }

  if (!file.endsWith(extension)) {
    console.warn(
      `File is not ending with ${extension} suffix, but will try to load it!`
    );
  }

  const configurationFile = fs.readFileSync(file);
  return JSON.parse(configurationFile);
};

/**
 * @param {String} name
 * @return {Object}
 */
const loadDefaultConfig = (name) => {
  return loadConfig(path.join(defaultPath.configPath, name));
};

/**
 * @param {String} file
 * @param {Object} options
 */
const saveConfig = (file, options = {}) => {
  // Make sure file has an .mbu extension and remove unsupported chars.
  if (!file.endsWith(extension)) {
    file = `${file}${extension}`;
  }

  if (fs.existsSync(file)) {
    console.log('Overwrite configuration for', options.name, 'in file', file);
    files.createBackupFile(file);
  } else {
    console.log('Storing configuration for', options.name, 'in file', file);
  }

  // Remove context and other options to avoid a endless loop.
  delete options.context;
  delete options.save_config;

  fs.writeFileSync(file, JSON.stringify(options, null, 2));
};

/**
 * @param {String} name
 * @param {Object} options
 */
const saveDefaultConfig = (name, options = {}) => {
  files.createFolderIfNotExists(defaultPath.configPath);
  saveConfig(path.join(defaultPath.configPath, name), options);
};

exports.configPath = configPath;
exports.loadConfig = loadConfig;
exports.loadDefaultConfig = loadDefaultConfig;
exports.saveConfig = saveConfig;
exports.saveDefaultConfig = saveDefaultConfig;
