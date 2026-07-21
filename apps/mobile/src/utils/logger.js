const isDevelopment = typeof globalThis.__DEV__ !== 'undefined' ? globalThis.__DEV__ : false;

const write = (method, ...args) => {
  if (isDevelopment && typeof globalThis.console !== 'undefined') {
    globalThis.console[method](...args);
  }
};

export const logger = {
  info: (...args) => write('info', ...args),
  warn: (...args) => write('warn', ...args),
  error: (...args) => write('error', ...args),
};

export const logError = (message, error) => {
  logger.error(message, error?.message || error);
};
