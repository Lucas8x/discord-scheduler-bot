import chalk from 'chalk';

const info = (...message: string[]) =>
  console.info(chalk.bgMagenta.bold(' INFO '), ...message);

const warn = (...message: string[]) =>
  console.error(chalk.bgYellow.bold(' WARN '), ...message);

const error = (...message: string[]) =>
  console.error(chalk.bgRed.bold(' ERROR '), ...message);

const log = console.log;

class Logger {
  constructor(
    private prefix: string,
    private color = chalk.white,
  ) {}

  log = (...message: unknown[]) =>
    console.log(
      this.color.bold(this.prefix),
      chalk.bgMagenta.bold(' LOG '),
      ...message,
    );

  info = (...message: unknown[]) =>
    console.info(
      this.color.bold(this.prefix),
      chalk.bgMagenta.bold(' INFO '),
      ...message,
    );

  warn = (...message: unknown[]) =>
    console.error(
      this.color.bold(this.prefix),
      chalk.bgYellow.bold(' WARN '),
      ...message,
    );

  error = (...message: unknown[]) =>
    console.error(
      this.color.bold(this.prefix),
      chalk.bgRed.bold(' ERROR '),
      ...message,
    );
}

const logger = { info, warn, error, log };
export { Logger, logger };
