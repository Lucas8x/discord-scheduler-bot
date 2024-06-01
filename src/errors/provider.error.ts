export class UnsupportedServiceError extends Error {
  constructor(public url: string) {
    super('Unsupported service or invalid URL');
    this.url = url;
  }
}

export class NoMovieDataError extends Error {
  constructor() {
    super('Could not load movie information.');
  }
}

export class NoMovieStatesError extends Error {
  constructor() {
    super('Could not load movie states.');
  }
}

export class NoMovieCitiesError extends Error {
  constructor(message?: string) {
    super(message || 'Could not load movie cities.');
  }
}

export class NoSessionsError extends Error {
  constructor(message?: string) {
    super(message || 'No sessions found.');
  }
}

export class SelectedSessionNotFound extends Error {
  constructor() {
    super('Selected session not found.');
  }
}

export class SelectedTheaterNotFound extends Error {
  constructor() {
    super('Selected theater not found.');
  }
}

export class NoTheaterToGenerateDescription extends Error {
  constructor() {
    super('No theater provided to generate a description.');
  }
}
