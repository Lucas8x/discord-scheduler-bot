import axios from 'axios';
import { GuildScheduledEventManager } from 'discord.js';
import { IngressoModel } from '../models';

export async function createEvent(movie?: IngressoModel) {
  try {
    //const movieName = movie.getName();
    //console.log(`Scheduling: ${movieName} ...`);

    //const data = movie.convert();

    console.log(`Creating event for ${'adon negro'}`);

    const testDate = new Date();
    testDate.setMonth(11);

    await axios.post(
      `https://discord.com/api/v10/guilds/851466373314248765/scheduled-events`,
      {
        name: 'adon negro',
        privacy_level: 2,
        scheduled_start_time: new Date().toISOString(),
        entity_type: 3,
        scheduled_end_time: testDate.toISOString(),
      },
      {
        headers: {
          Authorization:
            'Bot MTAyODQyODU4MzE1ODQzNTg2MQ.GoK-O7.1IFNt5N83BdBA0juSs7ZUWkf1z9VKCnCD-4zlg',
        },
      }
    );

    /*await GuildScheduledEventManager.create({
      name: 'adon negro',
      scheduledStartTime: Date.now(),
      privacyLevel: 2,
      entityType: 3,
    });
*/
    //console.log(`Schedule done: ${movieName}`);
    return {
      id: '123',
    };
  } catch (error) {
    console.log(error);
    //console.error(`[createEvent][ERROR] ${error}`);
    throw error;
  }
}
