import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message || 'Error inesperado', err);

  // Manejo de errores de validación (Zod)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.errors
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error Interno del Servidor';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
