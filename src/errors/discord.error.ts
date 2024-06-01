export class NoGuildIdError extends Error {
  constructor() {
    super('Guild ID not found.');
  }
}

export class NoGuildError extends Error {
  constructor() {
    super('Guild not found.');
  }
}

export class MissingUrlError extends Error {
  constructor() {
    super('Missing URL.');
  }
}

export class NoEventIdError extends Error {
  constructor() {
    super('Could not find event ID.');
  }
}

export class NoEventUrlError extends Error {
  constructor() {
    super('Could not find event URL.');
  }
}
