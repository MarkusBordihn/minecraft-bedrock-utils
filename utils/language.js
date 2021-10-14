/**
 * @file Minecraft Bedrock Utils -Language lib
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * @param {String} file
 * @param {String} name
 * @param {String} text
 */
const addLanguageText = (file, name, text) => {
  const languageFileContent = readLanguageFile(file);
  const formattedName = `${name}=`;
  if (languageFileContent.includes(formattedName)) {
    console.error(
      chalk.red('Entry', name, 'already exists in language file', file)
    );
    return;
  }
  fs.appendFileSync(file, `${formattedName}${text}\n`, (error) => {
    if (error) {
      console.error(chalk.red('Error append data to file', file, ':', error));
    }
  });
};

/**
 * @param {String} file
 * @return {String}
 */
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
