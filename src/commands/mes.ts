import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import { IngressoModel } from '../models';
import { createEvent } from '../controllers/createEvent';
import { validateUrl } from '../utils';
import moment from 'moment';

const data = new SlashCommandBuilder()
  .setName('mes')
  .setDescription('create movie event');
/* .addStringOption((option) =>
    option.setName('url').setDescription('Movie url').setRequired(true)
  )
  .addIntegerOption((option) =>
    option.setName('cityid').setDescription('City ID')
  );
  .addBooleanOption((option) =>
    option.setName('onlydub').setDescription('Only Dub ?')
  );*/

async function execute(interaction: ChatInputCommandInteraction) {
  try {
    const { options, guildId } = interaction;
    if (!guildId) throw Error('NO GUILD ID.');

    await interaction.deferReply({
      ephemeral: false,
    });
    const url = options.getString('url');
    if (!url) throw Error('MISSING URL.');
    if (!validateUrl(url)) throw Error('INVALID URL.');

    //const cityId = options.getInteger('cityid');
    //if (cityId.length > 3) {return}

    //const onlyDub = options.getBoolean('onlydub');

    const urlKey = url.split('/')?.pop()?.split('?')[0];
    if (!urlKey) throw Error('COULDNT FIND MOVIE KEY.');

    const movie = new IngressoModel(urlKey);
    await movie.fetchData();
    await movie.fetchSessions(53);

    const data = movie.convert();
    if (!data) throw Error('NO DATA AFTER CONVERTSION.');

    const { date } = data;

    const startTime = moment(date);
    const endTime = moment().add(2, 'd');

    const { id } = await createEvent({
      name: movie.getName() || 'UNDEFINED MOVIE NAME',
      description: 'test description',
      startTime: startTime,
      endTime: endTime,
      location: 'Shopping',
      guildId,
    });

    const link = `https://discord.com/events/${guildId}/${id}`;

    const message = id
      ? `Successfully scheduled: ${'adão negro'}\nCheckout: ${link}`
      : 'Event schedule failed.';

    await interaction.editReply({
      content: message,
    });
  } catch (error) {
    console.error(`[COMMANDS|MES]${error}`);
    await interaction.editReply({
      content: 'Something went wrong.',
    });
  }
}

module.exports = {
  data,
  execute,
};
