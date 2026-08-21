export const logger = {
  info: (message: string) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
  error: (message: string, meta?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta || ''),
  warn: (message: string) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`),
};
