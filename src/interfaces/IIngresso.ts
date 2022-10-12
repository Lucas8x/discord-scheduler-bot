export interface City {
  id: string;
  name: string;
  uf: string;
  state: string;
  urlKey: string;
  timeZone: string;
}

export interface StatesResponse {
  name: string;
  uf: string;
  cities: Array<City>;
}
