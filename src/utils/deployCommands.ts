import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import chalk from 'chalk';

interface Props {
  commands: any[];
  token: string;
  clientId: string;
  guildId: string;
}

export function deployCommands({ commands, token, clientId, guildId }: Props) {
  const commandsAsJson = commands.map((c) => c.data.toJSON());

  console.log(
    chalk`[{green UTILS}] Deploying ${commandsAsJson.length} commands...`,
  );

  const rest = new REST({ version: '10' }).setToken(token);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandsAsJson,
    })
    .then(() =>
      console.log(
        chalk`[{green UTILS}] ${commandsAsJson.length} Commands deployed.`,
      ),
    )
    .catch((err) => console.error(chalk`[{red UTILS}] ${err.message}`));
}
