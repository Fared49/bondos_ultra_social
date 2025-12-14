import fs from 'fs';
import path from 'path';

const logsDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const backendLog = path.join(logsDir, 'backend.log');

export function log(...args) {
  const message = `[${new Date().toISOString()}] ${args.join(' ')}\n`;
  // append to file
  fs.appendFile(backendLog, message, (err) => {
    if (err) {
      // do not crash on logging errors
    }
  });
  // only print to stdout in non-production
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

export function error(...args) {
  const message = `[${new Date().toISOString()}] ERROR ${args.join(' ')}\n`;
  fs.appendFile(backendLog, message, (err) => {});
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
}

export default { log, error };
