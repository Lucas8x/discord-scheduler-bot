import dayjs from 'dayjs';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { IngressoModel } from '@/providers';
import { createEvent } from '@/controllers/createEvent';
import { validateUrl } from '@/utils';

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
    const { options, guildId } = interaction;
    if (!guildId) throw Error('NO GUILD ID.');

    await interaction.deferReply({
      ephemeral: false,
    });
    const url = options.getString('url');
    if (!url) throw Error('MISSING URL.');

    //TODO: check url then use appropriate provider
    if (!validateUrl(url)) throw Error('INVALID URL.');

    //const cityId = options.getInteger('cityid');
    //if (cityId.length > 3) {return}

    //const onlyDub = options.getBoolean('onlydub');

    const urlKey = url.split('/')?.pop()?.split('?')[0];
    if (!urlKey) throw Error('COULD NOT FIND MOVIE KEY.');

    const movie = new IngressoModel(urlKey);
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

    const { id } = await createEvent({
      name: movie.getName() || 'UNDEFINED MOVIE NAME',
      description,
      startTime: startTime,
      endTime: endTime,
      location: 'Shopping',
      guildId,
    });

    if (!id) throw Error('NO EVENT ID');

    const link = `https://discord.com/events/${guildId}/${id}`;

    const message = id
      ? `Successfully scheduled: ${movie.getName()}\nCheckout: ${link}`
      : 'Event schedule failed.';

    await interaction.editReply({
      content: message,
    });
  } catch (error: unknown) {
    console.error(`[COMMANDS|MES]${error}`);
    await interaction.editReply({
      content: 'Something went wrong.',
    });
  }
}
