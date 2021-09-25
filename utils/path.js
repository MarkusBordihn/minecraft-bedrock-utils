/**
 * @fileoverview Minecraft Bedrock Utils - Path lib
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
const glob = require('glob');
const path = require('path');

const getWorkingPath = () => {
  return process.cwd();
};

/**
 * @param {String} search_path
 * @return {Array}
 */
const getPossibleManifestInSearchPath = (search_path = exports.workingPath) => {
  const searchPath = path.resolve(search_path);
  const result = [];
  // If we found a manifest.json in root we will use this.
  if (fs.existsSync(path.join(searchPath, 'manifest.json'))) {
    return [path.join(searchPath, 'manifest.json')];
  }
  // Search for alternative manifest files.
  glob
    .sync(path.join(searchPath, '**/manifest.json'), {
      nodir: true,
    })
    .map((file) => {
      result.push(path.resolve(file));
    });
  if (result.length > 0) {
    return result;
  }
};

const getPossibleManifestInWorkingPath = () => {
  return getPossibleManifestInSearchPath(exports.workingPath);
};

/**
 * @param {String} search_path
 * @return {String}
 */
const getPossibleBehaviorPackInSearchPath = (search_path) => {
  const manifests = getPossibleManifestInSearchPath(search_path);
  for (const file of manifests || []) {
    const manifestFile = fs.readFileSync(file);
    const manifest = JSON.parse(manifestFile);
    if (manifest.header && manifest.modules) {
      for (const module of manifest.modules) {
        if (module.type == 'data' || module.type == 'client_data') {
          return path.resolve(path.dirname(file));
        }
      }
    }
  }
};

const getPossibleBehaviorPackInWorkingPath = () => {
  return getPossibleBehaviorPackInSearchPath(exports.workingPath);
};

/**
 * @param {String} search_path
 * @return {String}
 */
const getPossibleResourcePackPackInSearchPath = (
  search_path = exports.workingPath
) => {
  const manifests = getPossibleManifestInSearchPath(search_path);
  for (const file of manifests || []) {
    const manifestFile = fs.readFileSync(file);
    const manifest = JSON.parse(manifestFile);
    if (manifest.header && manifest.modules) {
      for (const module of manifest.modules) {
        if (module.type == 'resources') {
          return path.resolve(path.dirname(file));
        }
      }
    }
  }
};

const getPossibleResourcePackInWorkingPath = () => {
  return getPossibleResourcePackPackInSearchPath(exports.workingPath);
};

const getMinecraftPath = () => {
  const minecraftPath = path.resolve(
    process.env.LOCALAPPDATA,
    'Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe'
  );
  if (fs.existsSync(minecraftPath)) {
    return minecraftPath;
  }
};

const getMinecraftLocalStatePath = () => {
  if (exports.minecraftPath) {
    const localStatePath = path.resolve(
      exports.minecraftPath,
      'LocalState',
      'games',
      'com.mojang'
    );
    if (fs.existsSync(localStatePath)) {
      return localStatePath;
    }
  }
};

const getDevelopmentBehaviorPacksPath = () => {
  if (exports.minecraftLocalStatePath) {
    const developmentBehaviorPacksPath = path.resolve(
      exports.minecraftLocalStatePath,
      'development_behavior_packs'
    );
    if (fs.existsSync(developmentBehaviorPacksPath)) {
      return developmentBehaviorPacksPath;
    }
  }
};

const getDevelopmentResourcePacksPath = () => {
  if (exports.minecraftLocalStatePath) {
    const developmentResourcePacksPath = path.resolve(
      exports.minecraftLocalStatePath,
      'development_resource_packs'
    );
    if (fs.existsSync(developmentResourcePacksPath)) {
      return developmentResourcePacksPath;
    }
  }
};

const getDevelopmentSkinPacksPath = () => {
  if (exports.minecraftLocalStatePath) {
    const developmentSkinPacksPath = path.resolve(
      exports.minecraftLocalStatePath,
      'development_skin_packs'
    );
    if (fs.existsSync(developmentSkinPacksPath)) {
      return developmentSkinPacksPath;
    }
  }
};

const getBehaviorPacksPath = () => {
  if (exports.minecraftLocalStatePath) {
    const behaviorPacksPath = path.resolve(
      exports.minecraftLocalStatePath,
      'behavior_packs'
    );
    if (fs.existsSync(behaviorPacksPath)) {
      return behaviorPacksPath;
    }
  }
};

const getResourcePacksPath = () => {
  if (exports.minecraftLocalStatePath) {
    const resourcePacksPath = path.resolve(
      exports.minecraftLocalStatePath,
      'resource_packs'
    );
    if (fs.existsSync(resourcePacksPath)) {
      return resourcePacksPath;
    }
  }
};

// General path definitions
exports.configPath = path.join(process.cwd(), '.minecraft-bedrock-utils');
exports.modulePath = path.resolve(__dirname, '..');
exports.workingPath = getWorkingPath();

exports.assetsInitPath = path.join(exports.modulePath, 'assets', 'init');
exports.assetsItemsPath = path.join(exports.modulePath, 'assets', 'items');
exports.assetsMiscPath = path.join(exports.modulePath, 'assets', 'misc');
exports.assetsModelsArmorPath = path.join(
  exports.modulePath,
  'assets',
  'armor'
);
exports.assetsModelsPath = path.join(exports.modulePath, 'assets', 'models');
exports.assetsPath = path.join(exports.modulePath, 'assets');

exports.minecraftPath = getMinecraftPath();
exports.minecraftLocalStatePath = getMinecraftLocalStatePath();
exports.possibleManifestInWorkingPath = getPossibleManifestInWorkingPath();
exports.possibleBehaviorPackInWorkingPath =
  getPossibleBehaviorPackInWorkingPath();
exports.possibleResourcePackInWorkingPath =
  getPossibleResourcePackInWorkingPath();
exports.developmentBehaviorPacksPath = getDevelopmentBehaviorPacksPath();
exports.developmentResourcePacksPath = getDevelopmentResourcePacksPath();
exports.developmentSkinPacksPath = getDevelopmentSkinPacksPath();
exports.behaviorPacksPath = getBehaviorPacksPath();
exports.resourcePacksPath = getResourcePacksPath();

// Helper functions
exports.getPossibleBehaviorPackInSearchPath =
  getPossibleBehaviorPackInSearchPath;
exports.getPossibleResourcePackPackInSearchPath =
  getPossibleResourcePackPackInSearchPath;
exports.getPossibleManifestInSearchPath = getPossibleManifestInSearchPath;
