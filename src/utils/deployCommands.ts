import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import chalk from 'chalk';

interface Props {
  commands: any[];
  token: string;
  clientId: string;
  guildId: string;
}

export async function deployCommands({
  commands,
  token,
  clientId,
  guildId,
}: Props) {
  const commandsAsJson = commands.map((c) => c.data.toJSON());

  console.log(
    chalk`[{green UTILS}] Deploying ${commandsAsJson.length} commands...`,
  );

  const rest = new REST({ version: '10' }).setToken(token);

  try {
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: commandsAsJson,
      },
    );

    console.log(chalk`[{green UTILS}] ${data.length} Commands deployed.`);
  } catch (error) {
    const isError = error instanceof Error;
    const msg = isError ? error.message : 'Unknown deploy error';
    console.error(chalk`[{red UTILS}] ${msg}`);
  }
}
