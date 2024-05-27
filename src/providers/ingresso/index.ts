import chalk from 'chalk';

import { getMovieDataByUrlKey, getSessions } from './api';
import { ingressoFilter } from './filter';

const prefix = chalk`[{yellow PROVIDER}][{yellow INGRESSO}]`;
const log = {
  log: (...args: unknown[]) => console.log(prefix, ...args),
  error: (...args: unknown[]) => console.error(prefix, ...args),
};

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

  public async fetchSessions(cityId: number): Promise<boolean> {
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
}

export function setup() {}
