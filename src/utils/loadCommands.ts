import fs from 'node:fs';
import path from 'node:path';

export function loadCommands() {
  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts'));

  if (commandFiles.length === 0) {
    console.error('[UTILS|LOAD COMMANDS] NO COMMANDS FOUND');
    return [];
  }

  const commands = commandFiles.map((file) => {
    const filePath = path.join(commandsPath, file);
    return require(filePath);
  });

  return commands;
}
