/**
 * @file Minecraft Bedrock Utils - Project lib
 * @license Apache-2.0
 * @author Markus@Bordihn.de (Markus Bordihn)
 */

const {
  configurationUtils,
  defaultConfig,
  normalizeHelper,
} = require('minecraft-utils-shared');

const packs = require('./packs.js');

const newProjectTemplate = (
  name,
  projectOptions = defaultConfig.project.config
) => {
  console.log('Creating new project template for', name);

  // Normalized options
  const options = defaultConfig.project.normalize(
    projectOptions,
    name,
    defaultConfig.project.gameType.BEDROCK
  );

  // Translate Project details for Bedrock
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
  const folderName = normalizeHelper.normalizePathName(
    options.bedrock.folderName ? options.bedrock.folderName : name
  );

  // Create resource pack
  let resourcePackManifest;
  if (
    options.type == defaultConfig.project.type.ADD_ON ||
    options.type == defaultConfig.project.type.BEHAVIOR_PACK
  ) {
    resourcePackManifest = packs.newResourcePack(name, {
      description: options.bedrock.resourcePack.description,
      minEngineVersion: minEngineVersion,
      nameDir: folderName,
      preCreateFiles: options.misc.preCreateFiles,
      version: version,
    });
  }

  // Create behavior pack
  if (
    options.type == defaultConfig.project.type.ADD_ON ||
    options.type == defaultConfig.project.type.RESOURCE_PACK
  ) {
    const resourcePackOptions = {
      description: options.bedrock.behaviorPack.description,
      dependencies: [],
      minEngineVersion: minEngineVersion,
      nameDir: folderName,
      preCreateFiles: options.misc.preCreateFiles,
      version: version,
    };
    if (resourcePackManifest) {
      resourcePackOptions.dependencies = [
        {
          uuid: resourcePackManifest.header.uuid,
          version: resourcePackManifest.header.version,
        },
      ];
    }
    packs.newBehaviorPack(name, resourcePackOptions);
  }

  // Store project configuration
  configurationUtils.saveProjectConfig(options);
};

exports.newProjectTemplate = newProjectTemplate;
