import chalk from 'chalk';
import { Client, GatewayIntentBits, Collection, Interaction } from 'discord.js';
import { loadCommands, deployCommands, config } from './utils';
const { TOKEN } = config;

const log = (msg: string) => console.log(chalk`[{magenta BOT}] ${msg}`);

interface ExtendClient extends Client {
  commands?: Collection<any, any>;
}

const client: ExtendClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

client.commands = new Collection();
loadCommands().forEach((c) => client.commands?.set(c.data.name, c));
deployCommands();

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands?.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    await interaction.reply({
      content: 'Command error',
      ephemeral: true,
    });
  }
});

client.once('ready', () => log('Ready!'));

client.on('error', (e) => console.error(chalk`[{magenta BOT}][ERROR]`, e));

client.login(TOKEN);
