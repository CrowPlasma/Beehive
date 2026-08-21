import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import { z } from 'zod';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Validación estricta con Zod
const appTemplateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  default_url: z.string().url("URL no válida"),
  icon_url: z.string().url("URL del icono no válida"),
  is_global_default: z.boolean().or(z.string().transform(val => val === 'true')).default(false)
});

export class CatalogService {
  
  async getAllTemplates() {
    return await prisma.appTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTemplate(data: any) {
    const validatedData = appTemplateSchema.parse(data);
    return await prisma.appTemplate.create({ data: validatedData });
  }

  // Lógica core para la carga masiva (Bulk Upload)
  async bulkUploadCSV(filePath: string): Promise<{ success: number, failed: number, errors: any[] }> {
    const results: any[] = [];
    const errors: any[] = [];
    let successCount = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          for (const item of results) {
            try {
              const validated = appTemplateSchema.parse(item);
              await prisma.appTemplate.create({ data: validated });
              successCount++;
            } catch (error: any) {
              errors.push({ item, error: error.errors || error.message });
            }
          }
          
          // Limpieza del archivo temporal
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            logger.error(`Error eliminando archivo temporal: ${filePath}`);
          }
          
          resolve({ success: successCount, failed: errors.length, errors });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
