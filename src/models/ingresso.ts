import chalk from 'chalk';

import { ingressoFilter } from '../filters/ingressoFilter';
import { ICreateEvent } from '../interfaces/ICreateEvent';
import { getMovieDataByUrlKey, getSessions } from '../services/ingresso/api';

const log = (msg: string) =>
  console.log(chalk`[{yellow MODEL}|{yellow INGRESSO}] ${msg}`);

export class IngressoModel {
  private name: string | null;
  private eventId: string | number | null;
  private data: object | null;

  constructor(public key: string) {
    this.key = key;
    this.name = null;
    this.eventId = null;
    this.data = null;
  }

  public getName = () => this.name;
  public setName = (newName: string) => (this.name = newName);

  public async fetchData(): Promise<boolean> {
    try {
      const { data, status } = await getMovieDataByUrlKey(this.key);
      if (status !== 200) throw Error("COULDN'T LOAD MOVIE INFO.");

      const { id, title } = data;

      this.eventId = id;
      this.name = title;

      return true;
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  }

  public async fetchSessions(cityId: number): Promise<boolean> {
    try {
      if (!this.eventId) throw Error('NO EVENT ID.');

      const response = await getSessions(cityId, this.eventId);
      if (!response) throw Error('NO SERVICE RESPONSE.');

      const { data, status } = response;
      if (status !== 200 || data?.title === 'Not Found')
        throw Error('PROBABLY NO SESSIONS.');

      this.data = data;
      return true;
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  }

  public convert(): ICreateEvent | undefined {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERTION');
      if (!Array.isArray(this.data)) throw Error('DATA ISNT THE CORRECT TYPE');

      return ingressoFilter(this.data);
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  }

  /*public getAllTheatersName(): Array<string> {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERTION');
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  }*/

  /* public getOneTheater(theater: string) {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERTION');
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  } */

  /* public getDubRooms() {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERTION');
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  } */

  public toString(): string {
    try {
      if (!this.data) throw Error('NO DATA FOR CONVERTION');
      const description = [];
      return description.flat().join('\n');
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  }
}
