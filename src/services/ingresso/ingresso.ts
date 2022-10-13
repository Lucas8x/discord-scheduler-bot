import chalk from 'chalk';
import moment from 'moment';
import { AxiosResponse } from 'axios';
import { getSessions } from './api';
import { StatesResponse } from '../../interfaces/IIngresso';

const log = (msg: string) =>
  console.log(chalk`[{blue SERVICES|INGRESSO}] ${msg}`);

interface Props {
  url?: string;
  eventId?: number;
  cityId?: number;
}

type IReturn = Promise<AxiosResponse | undefined>;

export async function IngressoService({
  url,
  eventId,
  cityId,
}: Props): IReturn {
  try {
    if (!eventId) throw Error('NO EVENT ID');
    if (!cityId) throw Error('NO CITY ID');

    log(`Fetching sessions for movie ${eventId}`);

    return await getSessions(cityId, eventId);
  } catch (error) {
    console.error(`[SERVICES|INGRESSO] ${error}`);
    throw error;
  }
}
