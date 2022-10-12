import { GuildScheduledEventManager } from 'discord.js';
import { MovieModel } from '../models/movie';

export async function createEvent(movie: MovieModel) {
  try {
    const movieName = movie.getName();
    console.log(`Scheduling: ${movieName} ...`);

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
