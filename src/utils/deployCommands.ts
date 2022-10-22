import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import chalk from 'chalk';
import { loadCommands, config } from '.';

const { TOKEN, CLIENT_ID, GUILD_ID } = config;

export function deployCommands() {
  const commands = loadCommands().map((c) => c.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    })
    .then(() => console.log(chalk`[{green UTILS}] Registered commands.`))
    .catch(console.error);
}
