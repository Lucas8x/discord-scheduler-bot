import { IngressoModel } from '.';

const patterns = [
  {
    regex: /^https:\/\/www\.ingresso\.com\/filme\/.+/,
    provider: IngressoModel,
  },
];

export function getProvider(url: string) {
  for (const { regex, provider } of patterns) {
    if (regex.test(url)) {
      return provider;
    }
  }
  return false;
}
