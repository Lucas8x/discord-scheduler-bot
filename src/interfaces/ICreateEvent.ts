export interface ISession {
  time: string;
  types: Array<string>;
}

export interface IRoom {
  name: string;
  sessions: Array<ISession>;
}

export interface ITheater {
  name: string;
  rooms: Array<IRoom>;
}

export interface ICreateEvent {
  theaters: Array<ITheater>;
  date: string;
  dateFormatted: string;
}
