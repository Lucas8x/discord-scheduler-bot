import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import chalk from 'chalk';

import { loadCommands } from '.';

interface Props {
  token: string;
  clientId: string;
  guildId: string;
}

export function deployCommands({ token, clientId, guildId }: Props) {
  const commands = loadCommands().map((c) => c.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    })
    .then(() => console.log(chalk`[{green UTILS}] Registered commands.`))
    .catch(console.error);
}
