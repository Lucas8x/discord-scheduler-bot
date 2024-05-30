import { LOCALES } from '.';
import { messages } from './messages';

export function t(key: string, locale = LOCALES.ENGLISH) {
  return messages[locale][key];
}
