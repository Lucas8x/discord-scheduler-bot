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
import { t } from '@/locales/getTranslate';

const log = new Logger('[COMMANDS][MES]', chalk.green);

export const data = new SlashCommandBuilder()
  .setName('mes')
  .setDescription('Create movie event.')
  .setDescriptionLocalizations({
    'pt-BR': 'Criar evento de filme.',
  })
  .addStringOption((option) =>
    option.setName('url').setDescription('Movie url').setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const { guildId, guild, options, locale } = interaction;
    if (!guildId) {
      throw new NoGuildIdError();
    }
    if (!guild) {
      throw new NoGuildError();
    }

    const initialMessage = interaction;
    await interaction.reply({
      content: t('loading', locale),
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
      placeholder: t('select.state.placeholder', locale),
      options: states.slice(0, 25), //TODO: pagination
      identifiers: ['uf', 'name'],
    });

    await interaction.editReply({
      content: t('select.state.message', locale),
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
            placeholder: t('select.city.placeholder', locale),
            options: cities.slice(0, 25),
            identifiers: ['id', 'name'],
          });

          await initialMessage.editReply({
            content: t('select.city.message', locale),
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
            placeholder: t('select.date.placeholder', locale),
            options: availableDates,
          });

          await initialMessage.editReply({
            content: t('select.date.message', locale),
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
            placeholder: t('select.theater.placeholder', locale),
            options: theaters,
            identifiers: ['id', 'name'],
          });

          await initialMessage.editReply({
            content: t('select.theater.message', locale),
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
            name: movie.getName() || t('invalid.movie.replace', locale),
            description: movie.generateDescription(selectedTheater),
            privacyLevel: 2,
            scheduledStartTime: startTime.toISOString(),
            scheduledEndTime: endTime.toISOString(),
            entityType: 3,
            image: movie.getHorizontalPoster(),
            entityMetadata: {
              location:
                selectedTheater?.name || t('unknown.theater.name', locale),
            },
          });

          if (!id) {
            throw new NoEventIdError();
          }
          if (!eventURL) {
            throw new NoEventUrlError();
          }

          const message = id
            ? t('success.schedule', locale, movie.getName(), eventURL)
            : t('failed.schedule', locale);

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
    const msg = isError
      ? error.message
      : t('something.went.wrong', interaction.locale);

    log.error(msg, isError && error?.cause ? `> ${error.cause} <` : '');

    await interaction.editReply({
      content: msg,
    });
  }
}
