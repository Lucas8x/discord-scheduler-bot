import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { makeDir, writeFile, fileExists } from '.';
import { TimestampsManager } from './timestampsManager';
import { CACHE_DIR, EXPIRATION_TIME } from '@/constants';
import { Logger } from './logger';

const log = new Logger('[Cache]', chalk.bgYellow);

export class FileCacheManager {
  private static instance: FileCacheManager;
  private timestampsManager: TimestampsManager;

  private constructor() {
    this.setup();
    this.timestampsManager = TimestampsManager.getInstance();
  }

  public static getInstance(): FileCacheManager {
    if (!FileCacheManager.instance) {
      FileCacheManager.instance = new FileCacheManager();
    }
    return FileCacheManager.instance;
  }

  async checkExpiration(fileName: string) {
    try {
      const { timestamp, expirationMs, error } =
        await this.timestampsManager.get(fileName);

      if (error) {
        return {
          expired: true,
          error,
        };
      }

      const expired =
        timestamp && dayjs().utc().isAfter(dayjs(timestamp).add(expirationMs));

      if (expired) {
        await this.delete(fileName);
        return {
          expired: true,
          error: 'FILE EXPIRED',
        };
      }

      return {
        error: null,
        expired: false,
      };
    } catch (error) {
      return {
        expired: true,
        error,
      };
    }
  }

  async set(fileName: string, value: unknown, expirationMs = EXPIRATION_TIME) {
    try {
      const filePath = path.resolve(CACHE_DIR, fileName);
      const data = JSON.stringify(value);

      await makeDir(path.dirname(filePath));
      await writeFile(filePath, data);

      const timestamp = dayjs().utc().toISOString();
      await this.timestampsManager.set(fileName, expirationMs, timestamp);

      log.log(chalk`[{yellow Set}] {green ${fileName} ${timestamp}}`);

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      log.error(chalk`[{yellow Set}] {red ${error}}`);
      return {
        success: false,
        error,
      };
    }
  }

  async get(fileName: string) {
    try {
      const filePath = path.resolve(CACHE_DIR, fileName);
      const exists = await fileExists(filePath);
      if (!exists) {
        return {
          data: null,
          error: 'FILE DOES NOT EXIST',
        };
      }

      const { expired } = await this.checkExpiration(fileName);
      if (expired) {
        return {
          data: null,
          error: 'FILE EXPIRED',
        };
      }

      const ext = path.extname(filePath).toLowerCase();
      const file = await fs.readFile(filePath, 'utf8');

      let data;
      if (ext === '.json') {
        data = JSON.parse(file);
      } else {
        data = file;
      }

      return {
        data,
        error: null,
      };
    } catch (error) {
      log.error(error);
      return {
        data: null,
        error,
      };
    }
  }

  async delete(fileName: string) {
    try {
      const filePath = path.resolve(CACHE_DIR, fileName);
      await fs.unlink(filePath);
    } catch (error) {
      log.error(chalk`[{yellow Delete}] {red ${error}}`);
    }
  }

  async clear() {
    try {
      await fs.rm(CACHE_DIR, { recursive: true });
    } catch (error) {
      log.error(chalk`[{yellow Clear}] {red ${error}}`);
    }
  }

  async setup() {
    try {
      const exists = await fileExists(CACHE_DIR);
      if (exists) {
        await this.timestampsManager.setup();
        return;
      }
      await fs.mkdir(CACHE_DIR);
      await this.timestampsManager.setup();
    } catch (error) {
      log.error(chalk`[{yellow Setup}]`, error);
    }
  }
}
