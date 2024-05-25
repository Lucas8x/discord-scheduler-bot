interface City {
  id: string;
  name: string;
  uf: string;
  state: string;
  urlKey: string;
  timeZone: string;
}

interface StatesResponse {
  name: string;
  uf: string;
  cities: City[];
}
