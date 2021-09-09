/**
 * @fileoverview Minecraft Bedrock Utils -Language lib
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

const addLanguageText = (file, name, text) => {
  const languageFileContent = readLanguageFile(file);
  const formattedName = `${name}=`;
  if (languageFileContent.includes(formattedName)) {
    console.error(
      chalk.red('Entry "', name, '" already exists in language file', file)
    );
    return;
  }
  fs.appendFileSync(file, `${formattedName}${text}\n`, (error) => {
    if (error) {
      return console.error(
        chalk.red('Error append data to file', file, ':', error)
      );
    }
  });
};

const readLanguageFile = (file) => {
  if (!fs.existsSync(file)) {
    console.error(chalk.red('Unable to find language file at', file));
    return;
  }
  const languageFilePath = file.endsWith('.lang')
    ? file
    : path.join(file, 'en_US.lang');
  return fs.readFileSync(languageFilePath) || '';
};

exports.addLanguageText = addLanguageText;
exports.readLanguageFile = readLanguageFile;
