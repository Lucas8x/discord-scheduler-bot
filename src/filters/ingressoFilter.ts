import { ICreateEvent } from '../interfaces/ICreateEvent';

interface Session {
  time: string;
  types: Array<{
    alias: string;
  }>;
}

function filterSession(session: Session) {
  const { time, types } = session;
  return {
    time,
    types: types.map((i) => i.alias),
  };
}

interface Room {
  name: string;
  sessions: Array<Session>;
}

function filterRoom(room: Room) {
  const { name, sessions } = room;
  return {
    name,
    sessions: sessions.map(filterSession),
  };
}

interface Theater {
  name: string;
  rooms: Array<Room>;
}

function filterTheater(theater: Theater) {
  const { name, rooms } = theater;
  return {
    name,
    rooms: rooms.map(filterRoom),
  };
}

interface Item {
  theaters: Array<Theater>;
  date: string;
  dateFormatted: string;
}

export function ingressoFilter(data: Array<Item>): ICreateEvent {
  const response = data.map((t) => {
    const { date, dateFormatted, theaters } = t;
    return {
      date,
      dateFormatted,
      theaters: theaters.map(filterTheater),
    };
  });

  return response;
}

/* export function ingressoDataToString(Theater: Theater) {} */
