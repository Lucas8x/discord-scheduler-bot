import chalk from 'chalk';
import moment from 'moment';
import { AxiosResponse } from 'axios';
import { getSessions } from './api';
import { StatesResponse } from '../../interfaces/IIngresso';

const log = (msg: string) => console.log(chalk`[{blue SERVICES}] ${msg}`);

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
}: Props): Promise<AxiosResponse | undefined> {
  try {
    if (!eventId) return;
    if (!date) date = moment().format('YYYY-MM-DD');
    if (!cityId) cityId = 53; // maceió

    log(`Fetching sessions for movie ${eventId} on ${date}`);

    return await getSessions(cityId, eventId);
  } catch (error) {
    console.error(`[SERVICES|INGRESSO] ${error}`);
    return;
  }
}
