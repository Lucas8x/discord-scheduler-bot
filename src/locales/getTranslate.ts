import { LOCALES } from '.';
import { messages } from './messages';

export function t(key: string, locale = LOCALES.ENGLISH, ...values: string[]) {
  return (
    messages[locale]?.[key] ??
    messages[LOCALES.ENGLISH]?.[key] ??
    key
  ).replace(/{(\d+)}/g, (_, index) => values[index] || '');
}
