import chalk from 'chalk';
import dayjs from 'dayjs';
import {
  ApplicationCommand,
  ChatInputCommandInteraction,
  CommandInteraction,
  ComponentType,
  SlashCommandBuilder,
  type Interaction,
} from 'discord.js';

import { SelectMenu } from '@/components/SelectMenu';
import {
  MissingUrlError,
  NoEventIdError,
  NoEventUrlError,
  NoGuildError,
  NoGuildIdError,
} from '@/errors/discord.error';
import {
  NoMovieCitiesError,
  NoMovieDataError,
  NoMovieStatesError,
  NoSessionsError,
  SelectedSessionNotFound,
  SelectedTheaterNotFound,
  UnsupportedServiceError,
} from '@/errors/provider.error';
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
    const { guildId, guild, options } = interaction;
    if (!guildId) {
      throw new NoGuildIdError();
    }
    if (!guild) {
      throw new NoGuildError();
    }

    const initialMessage = interaction;
    await interaction.reply({
      content: 'Loading...',
    });

    const url = options.getString('url');
    if (!url) {
      throw new MissingUrlError();
    }

    const Provider = getProvider(url);
    if (!Provider) {
      throw new UnsupportedServiceError(url);
    }

    const movie = new Provider(url);
    const movieData = await movie.fetchData();
    if (!movieData) {
      throw new NoMovieDataError();
    }

    const states = await movie.getStates();
    if (!states || states.length === 0) {
      throw new NoMovieStatesError();
    }
    const ufRow = SelectMenu({
      customId: 'ufSelect',
      placeholder: 'Selecione o seu estado.',
      options: states.slice(0, 25), //TODO: pagination
      identifiers: ['uf', 'name'],
    });

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

    const selectedOptions = {
      uf: '',
      city: '',
      date: '',
      theater: '',
    };
    let sessions: IIngressoDayEntry[] = [];
    let selectedSession: IIngressoDayEntry | null = null;

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

          if (!cities || cities.length === 0) {
            throw new NoMovieCitiesError(`No sessions found in ${choice}.`);
          }

          const cityRow = SelectMenu({
            customId: 'citySelect',
            placeholder: 'Selecione sua cidade.',
            options: cities.slice(0, 25),
            identifiers: ['id', 'name'],
          });

          await initialMessage.editReply({
            content: 'Qual sua cidade?',
            components: [cityRow],
          });
        }

        if (customId === 'citySelect') {
          selectedOptions.city = choice;

          sessions = await movie.fetchSessions(selectedOptions.city);
          if (!sessions) {
            throw new NoSessionsError(
              `No sessions found in ${selectedOptions.city}.`,
            );
          }

          const availableDates = sessions.map((j) => j.dateFormatted);

          const datesRow = SelectMenu({
            customId: 'dateSelect',
            placeholder: 'Selecione a data',
            options: availableDates,
          });

          await initialMessage.editReply({
            content: 'Qual sessão deseja assistir?',
            components: [datesRow],
          });
        }

        if (customId === 'dateSelect') {
          selectedOptions.date = choice;

          const dateSession = sessions.find((j) => j.dateFormatted === choice);

          if (!dateSession) {
            throw new NoSessionsError(`No sessions found on ${choice}.`);
          }
          selectedSession = dateSession;

          const { theaters } = dateSession;

          const theatersRow = SelectMenu({
            customId: 'theaterSelect',
            placeholder: 'Selecione qual cinema.',
            options: theaters,
            identifiers: ['id', 'name'],
          });

          await initialMessage.editReply({
            content: 'Qual o cinema?',
            components: [theatersRow],
          });
        }

        if (customId === 'theaterSelect') {
          selectedOptions.theater = choice;
          if (!selectedSession) {
            throw new SelectedSessionNotFound();
          }

          const { date, theaters } = selectedSession;
          const selectedTheater = theaters.find(
            ({ id }) => id === selectedOptions.theater,
          );

          if (!selectedTheater) {
            throw new SelectedTheaterNotFound();
          }

          const startTime = dayjs(date).hour(0).minute(0);
          const endTime = dayjs(date).hour(23).minute(59);

          log.log('Creating event...');

          const { id, url: eventURL } = await guild.scheduledEvents.create({
            name: movie.getName() || 'UNKNOWN MOVIE NAME',
            description: movie.generateDescription(selectedTheater),
            privacyLevel: 2,
            scheduledStartTime: startTime.toISOString(),
            scheduledEndTime: endTime.toISOString(),
            entityType: 3,
            image: movie.getHorizontalPoster(),
            entityMetadata: {
              location: selectedTheater?.name || 'Unknown theater name',
            },
          });

          if (!id) {
            throw new NoEventIdError();
          }
          if (!eventURL) {
            throw new NoEventUrlError();
          }

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
