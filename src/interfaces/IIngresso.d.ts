interface IIngressoCity {
  id: string;
  name: string;
  uf: string;
  state: string;
  urlKey: string;
  timeZone: string;
}

interface IIngressoStatesResponse {
  name: string;
  uf: string;
  cities: City[];
}

interface IIngressoMovieDataResponse {
  b2BEventId: unknown;
  id: string;
  title: string;
  originalTitle: string;
  type: string;
  movieIdUrl: string;
  ancineId: string;
  countryOrigin: string;
  priority: number;
  contentRating: string;
  duration: string;
  rating: number;
  synopsis: string;
  cast: string;
  director: string;
  distributor: string;
  inPreSale: boolean;
  isReexhibition: boolean;
  urlKey: string;
  isPlaying: bigint;
  countIsPlaying: number;
  premiereDate: {
    localDate: string;
    isToday: false;
    dayOfWeek: string;
    dayAndMonth: string;
    hour: string;
    year: string;
  };
  creationDate: string;
  city: string;
  siteURL: string;
  nationalSiteURL: string;
  images: {
    url: string;
    type: 'PosterHorizontal' | 'PosterVertical' | string;
  }[];
  genres: string;
  ratingDescriptors: string[];
  accessibilityHubs: unknown[];
  completeTags: unknown[];
  tags: unknown[];
  trailers: {
    type: string;
    url: string;
    embeddedUrl: string;
  }[];
  cities: unknown[];
  partnershipType: string;
  rottenTomatoe: unknown;
}

interface IIngressoSessionDate {
  localDate: string;
  isToday: boolean;
  dayOfWeek: string;
  dayAndMonth: boolean;
  hour: string;
  year: string;
}

interface IIngressoSession {
  id: string;
  boxOfficeId: string;
  eventBoxOfficeId: string;
  price: number;
  room: string;
  type: string[];
  types: {
    id: number;
    name: string;
    alias: string;
    display: boolean;
  }[];
  date: IIngressoSessionDate;
  realDate: IIngressoSessionDate;
  time: string;
  defaultSector: string;
  midnightMessage: unknown;
  siteURL: string;
  nationalSiteURL: unknown;
  hasSeatSelection: boolean;
  driveIn: boolean;
  streaming: boolean;
  isNewCheckout: boolean;
  maxTicketsPerCar: number;
  enabled: boolean;
  blockMessage: string;
}

interface IIngressoRoom {
  name: string;
  type: unknown;
  sessions: IIngressoSession[];
}

interface IIngressoTheater {
  id: string;
  boxOfficeId: string;
  name: string;
  address: string;
  addressComplement: string;
  number: string;
  urlKey: string;
  neighborhood: string;
  properties: {
    hasBomboniere: boolean;
    hasContactlessWithdrawal: boolean;
    hasSession: boolean;
    hasSeatDistancePolicy: boolean;
    hasSeatDistancePolicyArena: boolean;
  };
  functionalities: {
    operationPolicyEnabled: boolean;
  };
  deliveryType: string[];
  siteURL: string;
  nationalSiteURL: string;
  enabled: boolean;
  blockMessage: string;
  rooms: IIngressoRoom[];
  sessionTypes: unknown;
  geolocation: {
    lat: number;
    lng: number;
  };
  operationPolicies: unknown[];
}

interface IIngressoDayEntry {
  date: string;
  dateFormatted: string;
  dayOfWeek: string;
  isToday: boolean;
  theaters: IIngressoTheater[];
}

interface IIngressoGetSessionsNotFoundResponse {
  type: string;
  title: string;
  status: number;
  traceId: string;
}

type IIngressoGetSessionsResponse =
  | IIngressoDayEntry[]
  | IIngressoGetSessionsNotFoundResponse;
