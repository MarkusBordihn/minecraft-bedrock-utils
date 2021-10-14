/**
 * @file Minecraft Bedrock Utils - project command
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const { defaultConfig } = require('minecraft-utils-shared');

const project = require('../utils/project.js');
const preChecks = require('../utils/preChecks.js');
const prompts = require('./projectPrompts.js');

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
    prompts.projectTypePrompt
      .run()
      .then((projectType) => {
        console.log(projectType);
        switch (projectType) {
          case defaultConfig.project.type.ADD_ON:
            prompts.newAddOnPrompt
              .run()
              .then((value) => {
                newProject(value.name, { type: projectType, ...value });
              })
              .catch(console.error);
            break;
          default:
            console.log(
              'Project type',
              projectType,
              'is currently unsupported!'
            );
        }
      })
      .catch(console.error);
    return;
  }

  // Set Project details
  console.log(options);

  // Create new Project template based on the given information.
  project.newProjectTemplate(name, options);
};

exports.newProject = newProject;
