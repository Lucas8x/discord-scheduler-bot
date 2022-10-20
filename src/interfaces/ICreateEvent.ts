interface Session {
  time: string;
  types: Array<string>;
}

interface Room {
  name: string;
  sessions: Array<Session>;
}

interface Theather {
  name: string;
  rooms: Array<Room>;
}

export interface ICreateEvent {
  theaters: Array<Theather>;
  date: string;
  dateFormatted: string;
}
