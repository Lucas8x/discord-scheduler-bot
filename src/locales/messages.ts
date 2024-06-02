import { LOCALES } from '.';

type IMessages = {
  [locale: string]: {
    [key: string]: string;
  };
};

export const messages: IMessages = {
  [LOCALES.ENGLISH]: {
    loading: 'Loading...',
    'select.state.placeholder': 'Select your state',
    'select.state.message': 'Please select your state',
    'select.city.placeholder': 'Select your city',
    'select.city.message': 'Please select your city',
    'select.date.placeholder': 'Select a date',
    'select.date.message': 'Please select a session',
    'select.theater.placeholder': 'Select a theater',
    'select.theater.message': 'Please select a theater',
    'success.schedule': 'Successfully scheduled: {0}\nCheckout: {1}',
    'invalid.movie.replace': 'UNKNOWN MOVIE NAME',
    'unknown.theater.name': 'Unknown theater name',
    'failed.schedule': 'Event schedule failed.',
    'something.went.wrong': 'Something went wrong',
  },
  [LOCALES.PORTUGUESE]: {
    loading: 'Carregando...',
    'select.state.placeholder': 'Selecione o seu estado.',
    'select.state.message': 'Qual seu estado?',
    'select.city.placeholder': 'Selecione sua cidade.',
    'select.city.message': 'Qual sua cidade?',
    'select.date.placeholder': 'Selecione a data.',
    'select.date.message': 'Qual sessão deseja assistir?',
    'select.theater.placeholder': 'Selecione qual cinema.',
    'select.theater.message': 'Qual o cinema?',
    'success.schedule': 'Agendado com sucesso: {0}\nDetalhes: {1}',
    'invalid.movie.replace': 'NOME DO FILME INEXISTENTE',
    'unknown.theater.name': 'Nome do cinema inexistente',
    'failed.schedule': 'Falha ao agendar evento.',
    'something.went.wrong': 'Algo deu errado',
  },
};
