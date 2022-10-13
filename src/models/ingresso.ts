import chalk from 'chalk';
import { IngressoService } from '../services/ingresso/ingresso';
import { MovieModel } from './movie';

const log = (msg: string) =>
  console.log(chalk`[{yellow MODEL|INGRESSO}] ${msg}`);

export class IngressoModel extends MovieModel {
  constructor(id: number) {
    super(id);
  }

  async fetch(): Promise<any> {
    try {
      const response = await IngressoService({ eventId: this.getID() });
      if (!response) throw Error('NO SERVICE RESPONSE');

      const { data, status } = response;

      if (status === 404 || data?.title === 'Not Found')
        throw Error('PROBABLY NO SESSIONS');

      console.log(data);
      //this.setName('')
      return true;
    } catch (error) {
      console.error(`[MODEL|INGRESSO] ${error}`);
      throw error;
    }
  }
}
