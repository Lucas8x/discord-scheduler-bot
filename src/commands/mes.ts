import dayjs from 'dayjs';
import chalk from 'chalk';
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRow,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type Interaction,
  ComponentType,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

import { getProvider } from '@/providers/getProvider';
import { Logger } from '@/utils/logger';

const log = new Logger('[Commands][MES]', chalk.green);

export const data = new SlashCommandBuilder()
  .setName('mes')
  .setDescription('create movie event')
  .addStringOption((option) =>
    option.setName('url').setDescription('Movie url').setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const { guildId, guild } = interaction;
    if (!guildId) {
      throw Error('NO GUILD ID.');
    }
    if (!guild) {
      throw Error('NO GUILD.');
    }

    const { options } = interaction;

    /* await interaction.reply({
      content: 'Loading...',
      fetchReply: true,
    });  */

    const url = options.getString('url');
    if (!url) throw Error('MISSING URL.');

    const Provider = getProvider(url);
    if (!Provider) throw Error('INVALID URL.');

    const movie = new Provider(url);
    await movie.fetchData();

    const selectedOptions = {
      uf: '',
      city: '',
    };

    const states = await movie.getStates();
    if (!states || states.length === 0) {
      throw Error('Could not load states.');
    }

    const ufRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('ufSelect')
        .setPlaceholder('Make a selection!')
        .addOptions(
          states
            .slice(0, 5)
            .map(({ name, uf }) =>
              new StringSelectMenuOptionBuilder().setLabel(name).setValue(uf),
            ),
        ),
    );

    const firstMsg = await interaction.reply({
      content: 'Qual seu estado?',
      components: [ufRow],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === interaction.member.id,
      componentType: ComponentType.StringSelect,
    });

    collector.on('collect', async (interaction) => {
      const { customId, values } = interaction;
      let [choice] = values;

      if (selectedOptions.uf && selectedOptions.city) {
        collector.stop();
      }

      let cities: ICity[] = [];

      if (customId === 'ufSelect') {
        selectedOptions.uf = choice;
        cities = await movie.getCities(choice);
      }
      if (customId === 'citySelect') {
        selectedOptions.city = choice;
      }

      const cityRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('citySelect')
          .setPlaceholder('Make a selection!')
          .addOptions(
            cities
              .slice(0, 5)
              .map(({ id, name }) =>
                new StringSelectMenuOptionBuilder().setLabel(name).setValue(id),
              ),
          ),
      );

      await interaction.update({
        content: 'Qual sua cidade?',
        components: [cityRow],
      });
    });

    collector.on('end', async () => {
      //await movie.fetchSessions(selectedOptions.city);

      await firstMsg.edit({
        content: 'Done',
        components: [],
      });
    });

    /*

    const data = movie.convert();
    if (!data) throw Error('NO DATA AFTER CONVERSION.');*/

    //const { date, theaters } = data[0];

    /* const theatersNames = theaters.map((j) => j.name);
    // TODO: ASK USER
    const selectedTheater = 'Kinoplex Maceió';

    const selectedTheaterObj = theaters.find(
      (j) => j.name === selectedTheater
    );

    const { rooms } = selectedTheaterObj; */

    /* const startTime = dayjs().add(1, 'd');
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
    */

    /* await interaction.reply({
      content: 'message',
    }); */
  } catch (error: unknown) {
    log.error(`[MES] ${error}`);

    await interaction.editReply({
      content: 'Something went wrong.',
    });
  }
}
