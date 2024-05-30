import chalk from 'chalk';
import {
  Client,
  GatewayIntentBits,
  Collection,
  type Interaction,
} from 'discord.js';

import { Logger } from './utils/logger';
import { loadCommands, deployCommands, config } from './utils';
const { TOKEN, CLIENT_ID, GUILD_ID } = config;

const log = new Logger('[BOT]', chalk.bgMagenta);

interface ExtendClient extends Client {
  commands?: Collection<string, any>;
}

async function init() {
  try {
    if (!TOKEN) throw 'NO TOKEN';
    if (!CLIENT_ID) throw 'NO CLIENT ID';
    if (!GUILD_ID) throw 'NO GUILD ID';

    const client: ExtendClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
      ],
    });

    client.commands = new Collection();
    const commands = loadCommands();

    commands.forEach((c) => client.commands?.set(c.data.name, c));
    await deployCommands({
      commands,
      token: TOKEN,
      clientId: CLIENT_ID,
      guildId: GUILD_ID,
    });

    client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = client.commands?.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        log.error(error instanceof Error ? error.message : error);
        await interaction.reply({
          content: 'Command error',
          ephemeral: true, // hide from everyone except the author
        });
      }
    });

    client.once('ready', () => log.log('Ready!'));
    client.on('error', (e) => console.error(chalk`[{magenta BOT}][ERROR]`, e));
    client.login(TOKEN);

    process.on('SIGINT', () => client.destroy());
  } catch (error) {
    console.error(error);
    process.exit();
  }
}

init();
