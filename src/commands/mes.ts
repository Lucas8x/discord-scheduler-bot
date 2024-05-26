import dayjs from 'dayjs';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { getProvider } from '@/providers/getProvider';

export const data = new SlashCommandBuilder()
  .setName('mes')
  .setDescription('create movie event')
  .addStringOption((option) =>
    option.setName('url').setDescription('Movie url').setRequired(true),
  );
/*.addIntegerOption((option) =>
    option.setName('cityid').setDescription('City ID')
  );
  .addBooleanOption((option) =>
    option.setName('onlydub').setDescription('Only Dub ?')
  );*/

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const { options, guildId, guild } = interaction;
    if (!guildId) throw Error('NO GUILD ID.');
    if (!guild) throw Error('NO GUILD.');

    await interaction.deferReply({
      ephemeral: false,
    });

    const url = options.getString('url');
    if (!url) throw Error('MISSING URL.');

    const Provider = getProvider(url);
    if (!Provider) throw Error('INVALID URL.');

    //const cityId = options.getInteger('cityid');
    //if (cityId.length > 3) {return}

    //const onlyDub = options.getBoolean('onlydub');

    const movie = new Provider(url);
    await movie.fetchData();

    //TODO: prompt city from user or set a default on first install
    await movie.fetchSessions(53);

    const data = movie.convert();
    if (!data) throw Error('NO DATA AFTER CONVERSION.');

    const { date, theaters } = data[0];

    /* const theatersNames = theaters.map((j) => j.name);
    // TODO: ASK USER
    const selectedTheater = 'Kinoplex Maceió';

    const selectedTheaterObj = theaters.find(
      (j) => j.name === selectedTheater
    );

    const { rooms } = selectedTheaterObj; */

    const startTime = dayjs().add(1, 'd');
    const endTime = dayjs().add(2, 'd');
    const description = movie.toString();

    const { id, url: eventURL } = await guild.scheduledEvents.create({
      name: movie.getName() || 'UNKNOWN MOVIE NAME',
      description,
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

    await interaction.editReply({
      content: message,
    });
  } catch (error: unknown) {
    console.error(`[ERROR][COMMANDS][MES] ${error}`);

    await interaction.editReply({
      content: 'Something went wrong.',
    });
  }
}
