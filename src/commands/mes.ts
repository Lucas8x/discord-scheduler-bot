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
    if (!guildId) throw 'NO GUILD ID';

    await interaction.deferReply({
      ephemeral: false,
    });
    /*const url = options.getString('url');
    if (!url || !validateUrl(url)) return;*/

    //const cityId = options.getInteger('cityid');
    //if (cityId.length > 3) {return}

    //const onlyDub = options.getBoolean('onlydub');

    /*const url =
      'https://www.ingresso.com/filme/adao-negro?city=maceio&partnership=home&target=em-alta#!#data=20221019';
    if (!url) throw Error('MISSING URL');

    const urlKey = url.split('/')?.pop()?.split('?')[0];
    if (!urlKey) throw Error('COULDNT FIND MOVIE KEY.');

    const movie = new IngressoModel(urlKey);
    await movie.fetchData();
    await movie.fetchSessions(53);*/

    const startTime = moment().add(1, 'd');
    const endTime = moment().add(2, 'd');

    const { id } = await createEvent({
      name: 'adão negro',
      description: 'teste description',
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
