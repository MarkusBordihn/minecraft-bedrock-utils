# Minecraft Bedrock Utils

The Minecraft Bedrock Utils simplify some of the manual tasks and allows a more enjoying development experience.

## Features

Automatic detects the used behaviour pack and/or resource pack based on the *manifest.json file*.

## Installation

The easiest way is to keep minecraft-bedrock-utils as a Dependency in your package.json, by running

```bash
npm install minecraft-bedrock-utils
```

If you are working on several projects it's recommend to install the minecraft-bedrock-utils globally.

## Recommended Project structure

The following folder structure is recommended for your projects.

* **Project Folder**
  * **Behaviour Pack Folder**
    * manifest.json (for Minecraft)
  * **Resource Pack Folder**
    * manifest.json (for Minecraft)
  * **package.json** (for npm)

You should execute the `npx minecraft-bedrock-utils <command>` command inside the project folder and directly inside a behaviour pack or resource pack folder.

## How to use the utils

Use the **npx** command to run the utils with one of the commands in your project folder.

## Commands

Commands are executed over the **npx** command for example `npx minecraft-bedrock-utils <command>` inside the project folder.

### run

The run commands copies the behaviour pack and/or resource pack of the current directory into the developer behaviour pack and/or developer resource pack folders.

After the step is done it tries to start Minecraft Bedrock, if it was not already started.

Example:
`npx minecraft-bedrock-utils run`

### copy

The copy commands copies the behaviour pack and/or resource pack of the current directory into the developer behaviour pack and/or developer resource pack folders.

Example:
`npx minecraft-bedrock-utils copy`

### launch

Tries to start Minecraft Bedrock, if it was not already started.

Example:
`npx minecraft-bedrock-utils launch`

### debug

Shows some debug information mostly for troubleshooting like the detected path.

Example:
`npx minecraft-bedrock-utils launch`

## Disclaimer

NOT OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG.
