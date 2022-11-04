import { Moment } from 'moment';
import { Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

import { config } from '../utils';
const { TOKEN } = config;

interface Props {
  name: string;
  description: string;
  startTime: Moment;
  endTime: Moment;
  location: string;
  guildId: string;
}

type Return = Promise<{ id?: string }>;

export async function createEvent({
  name,
  description,
  startTime,
  endTime,
  location,
  guildId,
}: Props): Return {
  try {
    if (!TOKEN) throw Error('NO TOKEN');

    console.log(`Creating event for ${name}`);

    const eventData = {
      name,
      description,
      privacy_level: 2,
      scheduled_start_time: startTime.toISOString(),
      scheduled_end_time: endTime.toISOString(),
      entity_type: 3,
      entity_metadata: {
        location,
      },
    };

    let id: string | undefined;
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest
      .post(Routes.guildScheduledEvents(guildId), {
        body: eventData,
      })
      .then((data) => {
        id = data.id;
        console.log(`Event creation done: ${name}`);
      })
      .catch((error) => {
        throw error;
      });

    return {
      id,
    };
  } catch (error) {
    console.error(`[createEvent][ERROR] ${error}`);
    throw error;
  }
}
