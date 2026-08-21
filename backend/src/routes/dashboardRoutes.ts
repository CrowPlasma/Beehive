import { Router } from 'express';
import { getDashboard, updateDashboard, getCatalog, injectGlobalApp } from '../controllers/dashboardController';

const router = Router();

router.post('/global/inject', injectGlobalApp);
router.get('/catalog/history', getCatalog);
router.get('/:id', getDashboard);
router.post('/:id', updateDashboard);

export default router;
