import chalk from 'chalk';

import { getMovieDataByUrlKey, getSessions, getStates } from './api';
import { ingressoFilter } from './filter';
import { FileCacheManager } from '@/utils/fileCacheManager';
import { Logger } from '@/utils/logger';

const log = new Logger('[Provider][Ingresso]', chalk.yellow);
const fileCache = FileCacheManager.getInstance();

export class IngressoModel {
  private name?: string;
  private eventId?: string | number;
  private data?: IIngressoMovieDataResponse;
  private sessions?: IIngressoDayEntry[];
  private movieID?: string;

  //private selectedSession?: IIngressoDayEntry;
  //private selectedTheater?: IIngressoTheater;

  constructor(public url: string) {
    this.url = url;

    const movieID = url.split('/')?.pop()?.split('?')[0];
    if (!movieID) {
      throw Error('[ingresso] COULD NOT FIND MOVIE KEY.');
    }
    this.movieID = movieID;
  }

  public getName = () => this.name;

  public async fetchData(): Promise<boolean> {
    try {
      if (!this.movieID) throw Error('NO MOVIE ID.');

      log.log('fetching data...');

      const { data, status } = await getMovieDataByUrlKey(this.movieID);
      if (status !== 200) {
        throw Error("COULDN'T LOAD MOVIE INFO.");
      }

      const { id, title } = data;
      this.data = data;
      this.eventId = id;
      this.name = title;

      return true;
    } catch (error) {
      log.error(error);
      return false;
    }
  }

  public async fetchSessions(
    cityId: string | number,
  ): Promise<IIngressoDayEntry[]> {
    try {
      if (!this.eventId) throw Error('NO EVENT ID.');

      const response = await getSessions(cityId, this.eventId);
      if (!response) {
        throw Error('NO SERVICE RESPONSE.');
      }

      const { data, status } = response;
      if (
        status !== 200 ||
        (!Array.isArray(data) && data?.title === 'Not Found')
      ) {
        throw Error('PROBABLY NO SESSIONS.');
      }

      this.sessions = data;
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  public generateDescription(theater: IIngressoTheater): string {
    try {
      if (!theater) {
        throw Error('No theater provided to generate a description.');
      }
      const { rooms } = theater;

      const roomsString = rooms.map(({ name, sessions }) =>
        [
          name,
          sessions
            .map((session) => `[${session.types[1].alias}] ${session.time}`)
            .join(' / '),
        ].join(' - '),
      );

      const theaterString = [theater.name, roomsString, ''].flat();
      return theaterString.flat().join('\n');
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  public getHorizontalPoster() {
    try {
      if (!this.data) {
        throw Error('Movie information not found, can not get cover image.');
      }

      const coverData = this.data.images.find(
        (i) => i.type === 'PosterHorizontal',
      );
      if (!coverData) {
        throw Error('No cover information found.');
      }

      const { url } = coverData;
      if (!url) {
        throw Error('No image found.');
      }

      return url;
    } catch (error) {
      log.error(error);
      return '';
    }
  }

  public async getStates(): Promise<IIngressoStatesResponse[]> {
    try {
      const cached = await fileCache.get('ingresso/states.json');

      if (cached.data) {
        return cached.data;
      }

      const { data, status } = await getStates();

      if (status !== 200) {
        throw Error("COULDN'T LOAD STATES FROM API");
      }

      await fileCache.set('ingresso/states.json', data);
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  public async getCities(state: string): Promise<IIngressoCity[]> {
    try {
      if (!state) {
        throw Error('Please provide a UF');
      }

      const states = await this.getStates();
      const cities = states.find((i) => i.uf === state)?.cities;

      return cities || [];
    } catch (error) {
      log.error(error);
      return [];
    }
  }
}
