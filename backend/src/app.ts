import express, { Application } from 'express';
import cors from 'cors';
import catalogRoutes from './routes/catalogRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas
app.use('/api/catalog', catalogRoutes);
app.use('/api/dashboards', dashboardRoutes);

// Manejo Global de Errores (Debe ser el último middleware)
app.use(errorHandler);

export default app;
