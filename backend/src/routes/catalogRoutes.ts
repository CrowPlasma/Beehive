import { Router } from 'express';
import multer from 'multer';
import { CatalogController } from '../controllers/catalogController';

const router = Router();
const catalogController = new CatalogController();

// Configuración de Multer para recibir archivos en memoria o temporalmente
const upload = multer({ dest: 'uploads/' });

router.get('/', catalogController.getAll.bind(catalogController));
router.post('/', catalogController.create.bind(catalogController));

// Endpoint para el Bulk Upload (espera un archivo con el campo 'file')
router.post('/bulk-upload', upload.single('file'), catalogController.bulkUpload.bind(catalogController));

export default router;
