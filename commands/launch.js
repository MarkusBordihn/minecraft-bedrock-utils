/**
 * @file Minecraft Bedrock Utils - Launch command
 * @license Apache-2.0
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
