/**
 * @fileoverview Minecraft Bedrock Utils - Launch command
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

const { exec } = require('child_process');

const launch = function () {
  console.log('Launching Minecraft Bedrock ...');
  exec(
    'start shell:AppsFolder\\Microsoft.MinecraftUWP_8wekyb3d8bbwe!App',
    (error, stdout, stderr) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`Error: ${stderr}`);
      }
    }
  );
};

module.exports = launch;
