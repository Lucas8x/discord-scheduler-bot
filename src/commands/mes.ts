import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { IngressoModel } from '../models';
import { createEvent } from '../controllers/createEvent';
import { validateUrl } from '../utils';

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
    const { options } = interaction;
    await interaction.deferReply({
      ephemeral: false,
    });
    /*const url = options.getString('url');
    if (!url || !validateUrl(url)) return;*/

    //const cityId = options.getInteger('cityid');
    //const onlyDub = options.getBoolean('onlydub');

    /*const url =
      'https://www.ingresso.com/filme/adao-negro?city=maceio&partnership=home&target=em-alta#!#data=20221019';
    if (!url) throw Error('MISSING URL');

    const urlKey = url.split('/')?.pop()?.split('?')[0];
    if (!urlKey) throw Error('COULDNT FIND MOVIE KEY.');

    const movie = new IngressoModel(urlKey);
    await movie.fetchData();
    await movie.fetchSessions(53);*/

    const { id } = await createEvent();

    await interaction.editReply({
      //content: `${movie.getName()} successfully scheduled.\nCheckout: link`,
      content: `successfully scheduled.\nCheckout: ${id}`,
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
