import { Request, Response, NextFunction } from 'express';
import { CatalogService } from '../services/catalogService';

const catalogService = new CatalogService();

export class CatalogController {
  
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await catalogService.getAllTemplates();
      res.json({ success: true, data: templates });
    } catch (error) {
      next(error); // Pasa el error al Global Error Handler
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await catalogService.createTemplate(req.body);
      res.status(201).json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se subió ningún archivo CSV.' });
      }

      const result = await catalogService.bulkUploadCSV(req.file.path);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
