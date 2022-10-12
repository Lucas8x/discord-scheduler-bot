import { SlashCommandBuilder } from 'discord.js';
import { IngressoModel } from '../models';
import { createEvent } from '../controllers/createEvent';
import { validateUrl } from '../utils';

const data = new SlashCommandBuilder()
  .setName('mes')
  .setDescription('create movie event')
  /* .addStringOption((option) =>
    option.setName('url').setDescription('Movie url').setRequired(true)
  ) */
  .addIntegerOption((option) =>
    option.setName('movieid').setDescription('Movie ID')
  )
  .addIntegerOption((option) =>
    option.setName('cityid').setDescription('City ID')
  )
  .addBooleanOption((option) =>
    option.setName('onlydub').setDescription('Only Dub ?')
  );

async function execute(interaction: any) {
  try {
    const { options } = interaction;
    await interaction.deferReply({
      ephemeral: false,
    });
    /*const url = options.getString('url');
    if (!url || !validateUrl(url)) return;*/

    const movieId = options.getInteger('movieid');
    const cityId = options.getInteger('cityid');

    const onlyDub = options.getBoolean('onlydub');

    const movie = new IngressoModel(24274);
    const response = await movie.fetch();
    if (!response) return;

    //const { id } = await createEvent(movie);

    await interaction.editReply({
      content: `${movie.getName()} successfully scheduled.\nCheckout: https://discord.com/events/575815357609148426/1005235427113979995`,
    });
  } catch (error) {
    console.log(`[COMMANDS|MES]${error}`);
  }
}

module.exports = {
  data,
  execute,
};
