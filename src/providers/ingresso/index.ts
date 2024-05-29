import chalk from 'chalk';

import { getMovieDataByUrlKey, getSessions, getStates } from './api';
import { ingressoFilter } from './filter';
import { FileCacheManager } from '@/utils/fileCacheManager';

const prefix = chalk`[{yellow PROVIDER}][{yellow INGRESSO}]`;
const log = {
  log: (...args: unknown[]) => console.log(prefix, ...args),
  error: (...args: unknown[]) => console.error(prefix, ...args),
};

const fileCache = FileCacheManager.getInstance();

export class IngressoModel {
  private name?: string;
  private eventId?: string | number;
  private data?: object;
  private movieID?: string;

  constructor(public url: string) {
    this.url = url;

    const movieID = url.split('/')?.pop()?.split('?')[0];
    if (!movieID) {
      throw Error('[ingresso] COULD NOT FIND MOVIE KEY.');
    }
    this.movieID = movieID;
  }

  public getName = () => this.name;
  public setName = (newName: string) => (this.name = newName);

  public async fetchData(): Promise<boolean> {
    try {
      if (!this.movieID) throw Error('NO MOVIE ID.');
      log.log('fetching data...');
      const { data, status } = await getMovieDataByUrlKey(this.movieID);
      if (status !== 200) {
        throw Error("COULDN'T LOAD MOVIE INFO.");
      }

      const { id, title } = data;

      this.eventId = id;
      this.name = title;

      return true;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  public async fetchSessions(cityId: string | number): Promise<boolean> {
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

      this.data = data;
      return true;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  public convert(): ICreateEvent[] | undefined {
    try {
      if (!this.data) {
        throw Error('NO DATA FOR CONVERSION');
      }
      if (!Array.isArray(this.data)) {
        throw Error('DATA IS NOT THE CORRECT TYPE');
      }

      return ingressoFilter(this.data);
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  /*public getAllTheatersName(): Array<string> {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERSION');
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  }*/

  /* public getOneTheater(theater: string) {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERSION');
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  } */

  /* public getDubRooms() {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERSION');
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  } */

  public toString(): string {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERSION');

      //TODO: Create description of each room/date/session/theater
      const description: string[] = [];

      return description.flat().join('\n');
    } catch (error) {
      log.error(error);
      throw error;
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

  public async getCities(uf: string): Promise<IIngressoCity[]> {
    try {
      if (!uf) {
        throw Error('Please provide a UF');
      }
      const states = await this.getStates();

      const cities = states.find((state) => state.uf === uf)?.cities;

      return cities || [];
    } catch (error) {
      log.error(error);
      return [];
    }
  }
}
