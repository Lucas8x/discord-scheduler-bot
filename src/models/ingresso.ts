import chalk from 'chalk';
import { IngressoService } from '../services/ingresso/ingresso';
import { MovieModel } from './movie';

const log = (msg: string) =>
  console.log(chalk`[{yellow MODEL|INGRESSO}] ${msg}`);

export class IngressoModel extends MovieModel {
  constructor(id: number) {
    super(id);
  }

  async fetch(): Promise<boolean> {
    try {
      const response = await IngressoService({ eventId: this.getID() });
      if (!response) return false;

      const { data, status } = response;

      console.log(data);
      //this.setName('')
      return true;
    } catch (error) {
      throw Error('[MODEL|INGRESSO]');
    }
  }
}
