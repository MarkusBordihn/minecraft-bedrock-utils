/**
 * @file Minecraft Bedrock Utils - project command prompts
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const { Form, Select } = require('enquirer');
const { defaultConfig, enquirerHelper } = require('minecraft-utils-shared');

const normalizePathName = (name = '') => {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
};

exports.projectTypePrompt = new Select({
  name: 'projectType',
  message: 'Please select the type of your project',
  choices: [
    {
      message: 'Add-On (Behavior Pack and Resource Pack)',
      value: defaultConfig.project.type.ADD_ON,
    },
    {
      message: 'Behavior Pack',
      value: defaultConfig.project.type.BEHAVIOR_PACK,
    },
    {
      message: 'Resource Pack',
      value: defaultConfig.project.type.RESOURCE_PACK,
    },
    {
      message: 'Skin Pack',
      value: defaultConfig.project.type.SKIN_PACK,
      disabled: true,
    },
  ],
});

exports.newAddOnPrompt = new Form({
  name: 'project',
  message: 'Please provide the following information for the Add-On project:',
  choices: [
    {
      name: 'name',
      message: 'Project Name',
      initial: defaultConfig.project.config.name,
    },
    {
      name: 'bedrock.folderName',
      message: 'Folder Name',
      initial: defaultConfig.project.config.bedrock.folderName,
    },
    {
      name: 'version',
      message: 'Version',
      initial: defaultConfig.project.config.version,
    },
    {
      name: 'bedrock.behaviorPack.description',
      message: 'Behavior Pack Description',
      initial: defaultConfig.project.config.bedrock.behaviorPack.description,
      onChoice(state, choice) {
        const { name } = this.values;
        choice.initial = `Behavior Pack for ${name}`;
      },
    },
    {
      name: 'bedrock.resourcePack.description',
      message: 'Resource Pack Description',
      initial: defaultConfig.project.config.bedrock.resourcePack.description,
      onChoice(state, choice) {
        const { name } = this.values;
        choice.initial = `Resource Pack for ${name}`;
      },
    },
    {
      name: 'minEngineVersion',
      message: 'Min Engine Version',
      initial: defaultConfig.project.config.minEngineVersion,
    },
    {
      name: 'misc.preCreateFiles',
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

exports.newProjectPrompt = new Form({
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
        normalizePathName(process.env.npm_package_config_project_folder_name) ||
        normalizePathName(process.env.npm_package_config_project_name) ||
        normalizePathName(process.env.npm_package_name) ||
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
