interface ISession {
  time: string;
  types: string[];
}

interface IRoom {
  name: string;
  sessions: ISession[];
}

interface ITheater {
  name: string;
  rooms: AIRoom[];
}

interface ICreateEvent {
  date: string;
  dateFormatted: string;
  theaters: ITheater[];
}

interface IState {
  name: string;
  uf: string;
}

interface ICity {
  name: string;
  id: string;
}
