import fs from 'node:fs/promises';
export { config } from './env';
export { loadCommands } from './loadCommands';
export { deployCommands } from './deployCommands';

export function writeFile(dir: string, data: string | NodeJS.ArrayBufferView) {
  return fs.writeFile(dir, data, {
    encoding: 'utf8',
  });
}

export function makeDir(
  root: string,
  options = { recursive: true },
): Promise<string | undefined> {
  return fs.mkdir(root, options);
}

export async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
