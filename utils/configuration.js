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

const saveConfig = (file, options = {}) => {
  // Make sure file has an .mbu suffix and remove unsupported chars.
  if (!file.endsWith('.mbu')) {
    file = `${file}.mbu`;
  }

  if (fs.existsSync(file)) {
    console.log('Overwrite configuration for', options.name, 'in file', file);
  } else {
    console.log('Storing configuration for', options.name, 'in file', file);
  }

  // Remove context and save_config from options to avoid a endless loop.
  delete options.context;
  delete options.save_config;

  fs.writeFileSync(file, JSON.stringify(options, null, 2));
};

const loadConfig = (file) => {
  if (!fs.existsSync(file)) {
    console.Error('Unable to load configuration file', file);
    return {};
  }

  const configurationFile = fs.readFileSync(file);
  return JSON.parse(configurationFile);
};

exports.saveConfig = saveConfig;
exports.loadConfig = loadConfig;
