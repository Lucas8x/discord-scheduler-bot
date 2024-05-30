import dayjs from 'dayjs';
import chalk from 'chalk';
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type Interaction,
  ComponentType,
  ApplicationCommand,
  CommandInteraction,
} from 'discord.js';

import { getProvider } from '@/providers/getProvider';
import { Logger } from '@/utils/logger';

const log = new Logger('[COMMANDS][MES]', chalk.green);

export const data = new SlashCommandBuilder()
  .setName('mes')
  .setDescription('create movie event')
  .addStringOption((option) =>
    option.setName('url').setDescription('Movie url').setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    console.log(interaction.locale);
    const { guildId, guild, options } = interaction;
    if (!guildId) {
      throw Error('NO GUILD ID.');
    }
    if (!guild) {
      throw Error('NO GUILD.');
    }

    const initialMessage = interaction;
    await interaction.reply({
      content: 'Loading...',
    });

    const url = options.getString('url');
    if (!url) {
      throw Error('Please provide a URL.');
    }

    const Provider = getProvider(url);
    if (!Provider) {
      throw Error('Unsupported service or invalid URL', {
        cause: url,
      });
    }

    const movie = new Provider(url);
    const movieData = await movie.fetchData();
    if (!movieData) {
      throw Error('Could not load movie information.');
    }

    const selectedOptions = {
      uf: '',
      city: '',
    };

    const states = await movie.getStates();
    if (!states || states.length === 0) {
      throw Error('Could not load states.');
    }

    const ufRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ufSelect')
        .setPlaceholder('Selecione o seu estado.')
        .addOptions(
          states
            .slice(0, 25)
            .map(({ name, uf }) =>
              new StringSelectMenuOptionBuilder().setLabel(name).setValue(uf),
            ),
        ),
    );

    await interaction.editReply({
      content: 'Qual seu estado?',
      components: [ufRow],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === interaction.member.id,
      componentType: ComponentType.StringSelect,
      time: 60 * 1000,
    });

    let cities: ICity[] = [];

    collector.on('collect', async (interaction) => {
      try {
        const { customId, values } = interaction;
        const [choice] = values;

        if (interaction.isStringSelectMenu()) {
          await interaction.deferUpdate();
        }

        if (customId === 'ufSelect') {
          selectedOptions.uf = choice;
          cities = await movie.getCities(choice);
          const cityRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId('citySelect')
                .setPlaceholder('Selecione sua cidade.')
                .addOptions(
                  cities
                    .slice(0, 25)
                    .map(({ name, id }) =>
                      new StringSelectMenuOptionBuilder()
                        .setLabel(name)
                        .setValue(id),
                    ),
                ),
            );

          await initialMessage.editReply({
            content: 'Qual sua cidade?',
            components: [cityRow],
          });
        }

        if (customId === 'citySelect') {
          selectedOptions.city = choice;
        }

        if (selectedOptions.uf && selectedOptions.city) {
          const sessions = await movie.fetchSessions(selectedOptions.city);
          if (!sessions) {
            throw Error(`No sessions found in ${selectedOptions.city}.`);
          }

          /*
            const data = movie.convert();
            if (!data) throw Error('NO DATA AFTER CONVERSION.');

            const selectedTheaterObj = theaters.find(
              (j) => j.name === selectedTheater
            );

            const { rooms } = selectedTheaterObj;
          */

          //TODO: Prompt user to select a day
          const { date, theaters } = sessions[0];
          const theatersNames = theaters.map((j) => j.name);

          //TODO: Use selected date
          const startTime = dayjs().add(1, 'd');
          const endTime = dayjs().add(2, 'd');

          const { id, url: eventURL } = await guild.scheduledEvents.create({
            name: movie.getName() || 'UNKNOWN MOVIE NAME',
            description: movie.toString(),
            privacyLevel: 2,
            scheduledStartTime: startTime.toISOString(),
            scheduledEndTime: endTime.toISOString(),
            entityType: 3,
            entityMetadata: {
              location: 'Shopping',
            },
          });

          if (!id) throw Error('NO EVENT ID');
          if (!eventURL) throw Error('NO EVENT URL');

          const message = id
            ? `Successfully scheduled: ${movie.getName()}\nCheckout: ${eventURL}`
            : 'Event schedule failed.';

          await initialMessage.editReply({
            content: message,
            components: [],
          });

          collector.stop();
        }
      } catch (error) {
        log.error('[Collector]', error);
      }
    });

    collector.on('end', async () => {
      /* await interaction.editReply({
        content: 'Collector end',
        components: [],
      }); */
    });
  } catch (error) {
    const isError = error instanceof Error;
    const msg = isError ? error.message : 'Something went wrong.';

    log.error(msg, isError && error?.cause ? `> ${error.cause} <` : '');

    await interaction.editReply({
      content: msg,
    });
  }
}
