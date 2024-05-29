import fs from 'node:fs';
import chalk from 'chalk';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { EXPIRATION_TIME, TIMESTAMPS_FILE } from '@/constants';
import { fileExists, writeFile } from '.';
import { Logger } from './logger';

const log = new Logger('[Cache]', chalk.bgYellow);

type Timestamp = {
  expirationMs: number;
  timestamp: string;
};

export class TimestampsManager {
  private static instance: TimestampsManager;
  private data: Record<string, Timestamp>;

  private constructor() {
    this.data = {};
  }

  public static getInstance(): TimestampsManager {
    if (!TimestampsManager.instance) {
      TimestampsManager.instance = new TimestampsManager();
    }
    return TimestampsManager.instance;
  }

  async get(key: string) {
    try {
      return {
        ...this.data[key],
        error: null,
      };
    } catch (error) {
      log.error(chalk`[{yellow Get}] {red ${error}}`);
      return {
        timestamp: null,
        expirationMs: null,
        error,
      };
    }
  }

  async set(
    key: string,
    expirationMs = EXPIRATION_TIME,
    timestamp = dayjs().utc().toISOString(),
  ) {
    try {
      const file = await fs.promises.readFile(TIMESTAMPS_FILE, 'utf8');

      const data = JSON.parse(file);
      data[key] = {
        expirationMs,
        timestamp,
      };

      await fs.promises.writeFile(TIMESTAMPS_FILE, JSON.stringify(data));
    } catch (error) {
      log.error(chalk`[{yellow Set}] {red ${error}}`);
      throw error;
    }
  }

  async load() {
    try {
      if (!this.data || Object.keys(this.data).length === 0) {
        const file = await fs.promises.readFile(TIMESTAMPS_FILE, 'utf8');
        this.data = JSON.parse(file);
      }
    } catch (error) {
      log.error(chalk`[{yellow Set}] {red ${error}}`);
      throw error;
    }
  }

  async setup() {
    const exists = await fileExists(TIMESTAMPS_FILE);
    if (exists) {
      await this.load();
      return;
    }
    await writeFile(TIMESTAMPS_FILE, '{}');
  }
}
