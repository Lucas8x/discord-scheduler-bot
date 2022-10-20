import { GuildScheduledEventManager } from 'discord.js';
import { IngressoModel } from '../models';

export async function createEvent(movie: IngressoModel) {
  try {
    const movieName = movie.getName();
    console.log(`Scheduling: ${movieName} ...`);

    const data = movie.convert();

    /*await GuildScheduledEventManager.create({
      name: movieName,
      scheduledStartTime: Date.now(),
      privacyLevel: 2,
      entityType: 3,
    });*/

    console.log(`Schedule done: ${movieName}`);
    return {
      id: '123',
    };
  } catch (error) {
    console.error(`[createEvent][ERROR] ${error}`);
    throw error;
  }
}
