import path from 'node:path';

export const CACHE_DIR = path.resolve(__dirname, '..', 'external');

export const EXPIRATION_TIME = 24 * 60 * 60 * 1000; //24 hours

export const TIMESTAMPS_FILE = path.resolve(CACHE_DIR, 'timestamps.json');
