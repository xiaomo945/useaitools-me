const isDev = process.env.NODE_ENV === 'development';

export function debugLog(module: string, message: string, data?: unknown) {
  if (!isDev) return;
  const prefix = `[UseAITools] [${module}]`;
  if (data !== undefined) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
}

export function debugWarn(module: string, message: string, data?: unknown) {
  if (!isDev) return;
  const prefix = `[UseAITools] [${module}]`;
  if (data !== undefined) {
    console.warn(prefix, message, data);
  } else {
    console.warn(prefix, message);
  }
}

export function debugError(module: string, message: string, data?: unknown) {
  if (!isDev) return;
  const prefix = `[UseAITools] [${module}]`;
  if (data !== undefined) {
    console.error(prefix, message, data);
  } else {
    console.error(prefix, message);
  }
}
