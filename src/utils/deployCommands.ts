import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import { env, loadCommands } from '.';

const { token, clientId, guildId } = env;

export function deployCommands() {
  const commands = loadCommands().map((c) => c.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(token!);

  rest
    .put(Routes.applicationGuildCommands(clientId!, guildId!), {
      body: commands,
    })
    .then(() => console.log('Registered commands.'))
    .catch(console.error);
}
