import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const name = id === 'principal' ? 'Principal' : `Proyecto ${id}`;
    
    let dashboard = await prisma.dashboard.findFirst({
      where: { id: id === 'principal' ? undefined : id, name: id === 'principal' ? 'Principal' : undefined },
      include: { instances: true }
    });

    if (!dashboard) {
      dashboard = await prisma.dashboard.create({
        data: {
          id: id === 'principal' ? undefined : id,
          name: name,
        },
        include: { instances: true }
      });
    }

    res.json(dashboard);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

export const updateDashboard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cards, wallpaperBase64 } = req.body; // Array of AppCard and optional wallpaper

    const name = id === 'principal' ? 'Principal' : `Proyecto ${id}`;
    let dashboard = await prisma.dashboard.findFirst({
      where: { id: id === 'principal' ? undefined : id, name: id === 'principal' ? 'Principal' : undefined }
    });
    
    if (!dashboard) {
      dashboard = await prisma.dashboard.create({
        data: { id: id === 'principal' ? undefined : id, name: name, wallpaperBase64: wallpaperBase64 !== undefined ? wallpaperBase64 : null }
      });
    } else if (wallpaperBase64 !== undefined) {
      dashboard = await prisma.dashboard.update({
        where: { id: dashboard.id },
        data: { wallpaperBase64 }
      });
    }

    if (!Array.isArray(cards)) {
      return res.status(400).json({ error: 'Cards must be an array' });
    }

    await prisma.$transaction(async (tx) => {
      // Borrar existentes
      await tx.appInstance.deleteMany({
        where: { dashboardId: dashboard!.id }
      });

      // Insertar nuevos
      if (cards.length > 0) {
        await tx.appInstance.createMany({
          data: cards.map((card: any) => ({
            id: card.id, // Preservar el ID para que la navegación a sub-proyectos funcione
            dashboardId: dashboard!.id,
            custom_name: card.name,
            custom_url: card.url || '#',
            row: card.row,
            col: card.col,
            size: card.size,
            bgBase64: card.bgBase64,
          }))
        });
      }

      // Limpieza de proyectos huérfanos si estamos guardando el panel principal
      if (id === 'principal') {
        const validProjectIds = cards.map((c: any) => c.id);
        await tx.dashboard.deleteMany({
          where: {
            id: { notIn: [dashboard!.id, ...validProjectIds] }
          }
        });
      }
    });

    res.json({ success: true, message: 'Dashboard saved successfully' });
  } catch (error) {
    console.error('Error updating dashboard:', error);
    res.status(500).json({ error: 'Failed to update dashboard' });
  }
};

export const getCatalog = async (req: Request, res: Response) => {
  try {
    const allInstances = await prisma.appInstance.findMany({
      include: {
        dashboard: {
          select: { name: true, id: true }
        }
      }
    });
    
    res.json(allInstances);
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
};

const HEX_WIDTH = 100;
const ROWS = 25;
const COLS = 40;

const getOccupiedSlots = (card: any) => {
  const { row: r, col: c, size } = card;
  const slots = [{ r, c }];
  if (size === 'small') return slots;

  const isEven = r % 2 === 0;
  const dl_c = isEven ? c - 1 : c;
  const dr_c = isEven ? c : c + 1;

  if (size === 'medium') {
    slots.push({ r: r + 1, c: dl_c });
    slots.push({ r: r + 1, c: dr_c });
  } else if (size === 'large') {
    slots.push({ r: r + 1, c: dl_c }, { r: r + 1, c: dr_c }, { r, c: c - 1 }, { r, c: c + 1 }, { r: r - 1, c: dl_c }, { r: r - 1, c: dr_c });
  }
  return slots;
};

const getFirstEmptySlot = (size: string, instances: any[]) => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const testCard = { row: r, col: c, size };
      const slots = getOccupiedSlots(testCard);
      
      const outOfBounds = slots.some(s => s.r < 0 || s.r >= ROWS || s.c < 0 || s.c >= COLS);
      const overlapping = slots.some(s => {
        return instances.some(inst => {
          return getOccupiedSlots(inst).some(is => is.r === s.r && is.c === s.c);
        });
      });
      
      if (!outOfBounds && !overlapping) return { row: r, col: c };
    }
  }
  return { row: 0, col: 0 };
};

export const injectGlobalApp = async (req: Request, res: Response) => {
  try {
    const { name, url, bgBase64, size } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const allDashboards = await prisma.dashboard.findMany({
      include: { instances: true }
    });

    const newInstances = [];

    for (const dashboard of allDashboards) {
      const slot = getFirstEmptySlot(size || 'small', dashboard.instances);
      
      newInstances.push({
        dashboardId: dashboard.id,
        custom_name: name,
        custom_url: url || '#',
        size: size || 'small',
        bgBase64: bgBase64 || '',
        row: slot.row,
        col: slot.col
      });
    }

    if (newInstances.length > 0) {
      await prisma.appInstance.createMany({
        data: newInstances
      });
    }

    res.json({ success: true, injectedCount: newInstances.length });
  } catch (error) {
    console.error('Error injecting global app:', error);
    res.status(500).json({ error: 'Failed to inject app' });
  }
};

