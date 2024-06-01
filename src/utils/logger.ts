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
      chalk.bgMagenta.bold(' LOG '),
      this.color.bold(this.prefix),
      ...message,
    );

  info = (...message: unknown[]) =>
    console.info(
      chalk.bgMagenta.bold(' INFO '),
      this.color.bold(this.prefix),
      ...message,
    );

  warn = (...message: unknown[]) =>
    console.error(
      chalk.bgYellow.bold(' WARN '),
      this.color.bold(this.prefix),
      ...message,
    );

  error = (...message: unknown[]) =>
    console.error(
      chalk.bgRed.bold(' ERROR '),
      this.color.bold(this.prefix),
      ...message,
    );
}

const logger = { info, warn, error, log };
export { Logger, logger };
