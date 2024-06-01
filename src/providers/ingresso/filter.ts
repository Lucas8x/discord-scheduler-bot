function filterSession(session: IIngressoSession) {
  const { time, types } = session;
  return {
    time,
    types: types.map((i) => i.alias),
  };
}

function filterRoom(room: IIngressoRoom) {
  const { name, sessions } = room;
  return {
    name,
    sessions: sessions.map(filterSession),
  };
}

function filterTheater(theater: IIngressoTheater) {
  const { name, rooms } = theater;
  return {
    name,
    rooms: rooms.map(filterRoom),
  };
}

export function ingressoFilter(data: IIngressoDayEntry[]): ICreateEvent[] {
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
