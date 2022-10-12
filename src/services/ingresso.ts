import moment from 'moment';
import { getSessions } from './api';
import { StatesResponse } from '../interfaces/IIngresso';

interface Props {
  url?: string;
  eventId?: number;
  cityId?: number;
  date?: string;
}

export async function IngressoService({
  url,
  eventId,
  cityId,
  date,
}: Props): Promise<any | undefined> {
  try {
    if (!eventId) return;
    if (!date) date = moment().format('YYYY-MM-DD');
    if (!cityId) cityId = 53; // maceió

    console.log(`Fetching sessions for movie ${eventId} on ${date}`);

    return await getSessions(cityId, eventId);
  } catch (error) {
    console.error(`[SERVICES|INGRESSO] ${error}`);
    return;
  }
}
