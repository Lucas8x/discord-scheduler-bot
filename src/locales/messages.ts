import { LOCALES } from '.';

type IMessages = {
  [locale: string]: {
    [key: string]: string;
  };
};

export const messages: IMessages = {
  [LOCALES.ENGLISH]: {
    'hello-world': 'Hello World!',
  },
  [LOCALES.PORTUGUESE]: {
    'hello-world': 'Ola Mundo!',
  },
};
