import axios from 'axios';
import moment from 'moment';
import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

import { IngressoModel } from '../models';
import { config } from '../utils';
const { TOKEN, GUILD_ID } = config;

export async function createEvent(movie?: IngressoModel) {
  try {
    //const movieName = movie.getName();
    //console.log(`Scheduling: ${movieName} ...`);

    //const data = movie.convert();

    console.log(`Creating event for ${'adon negro'}`);

    const startTime = moment().add(1, 'd');
    const endTime = moment().add(2, 'd');

    const eventData = {
      name: 'adon negro',
      description: 'teste',
      privacy_level: 2,
      scheduled_start_time: startTime.toISOString(),
      scheduled_end_time: endTime.toISOString(),
      entity_type: 3,
      entity_metadata: {
        location: 'shops',
      },
    };

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    rest
      .post(Routes.guildScheduledEvents(GUILD_ID), {
        body: eventData,
      })
      .then(() => {})
      .catch(() => {});

    //console.log(`Schedule done: ${movieName}`);
    return {
      id: '123',
    };
  } catch (error) {
    console.error(`[createEvent][ERROR] ${error}`);
    throw error;
  }
}
