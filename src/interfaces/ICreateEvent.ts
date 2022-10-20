export interface Session {
  time: string;
  types: Array<string>;
}

export interface Room {
  name: string;
  sessions: Array<Session>;
}

export interface Theater {
  name: string;
  rooms: Array<Room>;
}

export interface ICreateEvent {
  theaters: Array<Theater>;
  date: string;
  dateFormatted: string;
}
