import { IngressoService } from '../services/ingresso';
import { MovieModel } from '.';

export class IngressoModel extends MovieModel {
  constructor(id: number) {
    super(id);
  }

  async fetch(): Promise<boolean> {
    try {
      const movie = await IngressoService({ eventId: this.getID() });
      return true;
    } catch (error) {
      throw Error('[MODEL|INGRESSO]');
    }
  }
}
