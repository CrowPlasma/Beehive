"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  Modifier,
} from '@dnd-kit/core';
import { Edit2, Trash2, X, Upload, Copy } from 'lucide-react';
import CloneModal from './CloneModal';
import ClassicBackgroundBees from './ClassicBackgroundBees';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface AppCard {
  id: string;
  name: string;
  bgBase64: string;
  url?: string;
  row: number;
  col: number;
  size: 'small' | 'medium' | 'large';
}

const HEX_WIDTH = 100;
const HEX_HEIGHT = 116; 
const GAP_X = 8;

const COL_ADVANCE = HEX_WIDTH + GAP_X; 
const ROW_ADVANCE = HEX_HEIGHT * 0.75; 

const ROWS = 25;
const COLS = 40;

// ----------------------------------------------------
// Lógica Matemática de Ocupación (Matriz del Panal)
// ----------------------------------------------------
const getOccupiedSlots = (card: AppCard) => {
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
    slots.push({ r: r + 1, c: dl_c });
    slots.push({ r: r + 1, c: dr_c });
    slots.push({ r, c: c - 1 });
    slots.push({ r, c: c + 1 });
    slots.push({ r: r - 1, c: dl_c });
    slots.push({ r: r - 1, c: dr_c });
  }
  return slots;
};

const getCardAtSlot = (r: number, c: number, allCards: AppCard[]) => {
  return allCards.find(card => {
    return getOccupiedSlots(card).some(slot => slot.r === r && slot.c === c);
  });
};


// ----------------------------------------------------
// Celda de Destino (Guía del Panal)
// ----------------------------------------------------
const DroppableSlot = ({ id, row, col, children }: { id: string, row: number, col: number, children: React.ReactNode }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  
  const left = col * COL_ADVANCE + (row % 2 === 1 ? COL_ADVANCE / 2 : 0);
  const top = row * ROW_ADVANCE;

  return (
    <div 
      ref={setNodeRef} 
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${HEX_WIDTH}px`,
        height: `${HEX_HEIGHT}px`,
      }}
      className="pointer-events-none" 
    >
      <svg viewBox={`0 0 ${HEX_WIDTH} ${HEX_HEIGHT}`} className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
        <polygon 
          points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87" 
          fill={isOver ? 'rgba(251, 191, 36, 0.2)' : 'transparent'} 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeDasharray="4 4" 
          className={`transition-colors duration-300 ${isOver ? 'text-amber-500' : 'text-amber-900/30 dark:text-amber-600/30'}`} 
        />
      </svg>
      {children}
    </div>
  );
};

// ----------------------------------------------------
// Tarjeta Arrastrable (Poli-Hexágono en SVG)
// ----------------------------------------------------
const CardView = React.forwardRef<HTMLDivElement, any>(({ card, onEdit, onClickCard, isDimmed, isHighlighted, isDragging, style, attributes, listeners, isOverlay }, ref) => {
  const baseZIndex = card.size === 'large' ? 30 : (card.size === 'medium' ? 20 : 10);
  
  const config = {
    small: { w: 100, h: 116, left: 0, top: 0, viewBox: "0 0 100 116", polys: [{dx:0, dy:0}] },
    medium: { w: 208, h: 203, left: -54, top: 0, viewBox: "0 0 208 203", polys: [{dx:54, dy:0}, {dx:0, dy:87}, {dx:108, dy:87}] },
    large: { w: 316, h: 290, left: -108, top: -87, viewBox: "0 0 316 290", polys: [{dx:108, dy:87}, {dx:54, dy:0}, {dx:162, dy:0}, {dx:0, dy:87}, {dx:216, dy:87}, {dx:54, dy:174}, {dx:162, dy:174}] },
  };

  const c = config[card.size as 'small'|'medium'|'large' || 'small'];

  let containerClass = `draggable-card absolute transition-all duration-300 group `;
  if (!isOverlay) {
     containerClass += 'pointer-events-auto ';
  }
  if (isDragging || isOverlay) {
    containerClass += 'scale-[1.05] ';
  } else if (isHighlighted) {
    containerClass += 'scale-[1.05] drop-shadow-2xl ';
  } else if (isDimmed) {
    containerClass += 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0 ';
  } else {
    containerClass += 'hover:scale-[1.02] ';
  }

  return (
    <div 
      ref={ref} 
      style={{ ...style, width: c.w, height: c.h, left: c.left, top: c.top, zIndex: isOverlay ? 9999 : (isDragging ? 0 : (isHighlighted ? 40 : baseZIndex)) }}
      className={containerClass}
      {...attributes} 
      {...listeners}
    >
      <svg onClick={(e) => { e.stopPropagation(); onClickCard(card); }} viewBox={c.viewBox} className="absolute inset-0 w-full h-full drop-shadow-xl overflow-visible cursor-pointer active:cursor-grabbing">
        <defs>
           <clipPath id={`clip-${card.id}`}>
              {c.polys.map((p, i) => (
                <polygon key={i} points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87" transform={`translate(${p.dx}, ${p.dy})`} />
              ))}
           </clipPath>
        </defs>
        
        {/* Fondo del clúster (Blanco / Gris oscuro) */}
        <rect width={c.w} height={c.h} fill="currentColor" className="text-white dark:text-gray-800" clipPath={`url(#clip-${card.id})`} />
        
        {/* Imagen de fondo extendida en todo el clúster */}
        {card.bgBase64 && (
           <image href={card.bgBase64} width={c.w} height={c.h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${card.id})`} opacity="0.9" />
        )}
        
        {/* Bordes Individuales que forman el contorno exterior y costuras internas */}
        {c.polys.map((p, i) => (
           <polygon 
             key={`stroke-${i}`} 
             points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87" 
             transform={`translate(${p.dx}, ${p.dy})`} 
             fill="none" 
             stroke="#fbbf24" 
             strokeWidth="3.5" 
             className={isDragging ? 'stroke-amber-500' : 'group-hover:stroke-amber-500 transition-colors'} 
           />
        ))}
      </svg>
      
      {/* Capa de UI (HTML superpuesto sobre el hexágono Ancla) */}
      <div 
        className="absolute flex flex-col items-center justify-center pointer-events-none"
        style={{ left: -c.left, top: -c.top, width: HEX_WIDTH, height: HEX_HEIGHT }}
      >
        <div className="z-10 bg-black/80 px-2 py-1.5 rounded text-center mt-auto mb-4 w-[85%] shadow-md pointer-events-none">
          <p className="text-white font-bold text-[10px] sm:text-xs truncate">{card.name}</p>
        </div>

        <button 
          onPointerDown={(e) => { e.stopPropagation(); onEdit(card); }}
          className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-amber-100 dark:hover:bg-amber-900 pointer-events-auto cursor-pointer"
        >
          <Edit2 size={12} />
        </button>
      </div>
    </div>
  );
});

const DraggableCard = ({ card, onEdit, onClickCard, isDimmed, isHighlighted }: { card: AppCard, onEdit: (c: AppCard) => void, onClickCard: (c: AppCard) => void, isDimmed?: boolean, isHighlighted?: boolean }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.id });
  
  const style = {
    opacity: isDragging ? 0.3 : 1,
  };

  return <CardView 
     ref={setNodeRef}
     card={card}
     onEdit={onEdit}
     onClickCard={onClickCard}
     isDimmed={isDimmed}
     isHighlighted={isHighlighted}
     isDragging={isDragging}
     style={style}
     attributes={attributes}
     listeners={listeners}
  />;
};

// ----------------------------------------------------
// Contenedor Principal
// ----------------------------------------------------
export default function DashboardGrid({ dashboardId, searchQuery = '' }: { dashboardId: string, searchQuery?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [cards, setCards] = useState<AppCard[]>([]);
  const [wallpaperBase64, setWallpaperBase64] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<AppCard | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isDraggingGrid, setIsDraggingGrid] = useState(false);
  
  const [formName, setFormName] = useState('');
  const [formBgBase64, setFormBgBase64] = useState('');
  const [formSize, setFormSize] = useState<'small'|'medium'|'large'>('small');
  const [formUrl, setFormUrl] = useState('');

  const wallpaperInputRef = React.useRef<HTMLInputElement>(null);

  const magneticSnapModifier: Modifier = ({ transform, over, active }) => {
    if (!over || !active) return transform;
    const draggedCard = cards.find(c => c.id === active.id);
    if (!draggedCard) return transform;

    const match = String(over.id).match(/r(\d+)-c(\d+)/);
    if (!match) return transform;

    const targetRow = parseInt(match[1]);
    const targetCol = parseInt(match[2]);

    // Validación de límites
    const simulatedCard = { ...draggedCard, row: targetRow, col: targetCol };
    const targetSlots = getOccupiedSlots(simulatedCard);
    const outOfBounds = targetSlots.some(s => s.r < 0 || s.r >= ROWS || s.c < 0 || s.c >= COLS);
    
    // Validación de colisiones
    const overlapping = targetSlots.some(s => {
      const cardThere = getCardAtSlot(s.r, s.c, cards);
      return cardThere && cardThere.id !== draggedCard.id;
    });

    if (outOfBounds || overlapping) {
      // Si el hueco no es válido, podemos mostrar un feedback visual, pero para el snap nos mantenemos en la posición actual del cursor (o regresamos al origen).
      return transform; // No hacemos snap magnético si es inválido, que flote normal.
    }

    const origRow = draggedCard.row;
    const origCol = draggedCard.col;

    const getSlotLeft = (r: number, c: number) => c * COL_ADVANCE + (r % 2 === 1 ? COL_ADVANCE / 2 : 0);
    const getSlotTop = (r: number, c: number) => r * ROW_ADVANCE;

    return {
      ...transform,
      x: getSlotLeft(targetRow, targetCol) - getSlotLeft(origRow, origCol),
      y: getSlotTop(targetRow, targetCol) - getSlotTop(origRow, origCol),
    };
  };

  // Cargar estado inicial del backend
  useEffect(() => {
    fetch(`/api/dashboards/${dashboardId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setWallpaperBase64(data.wallpaperBase64 || '');
          if (data.instances) {
            const loadedCards = data.instances.map((inst: any) => ({
              id: inst.id,
              name: inst.custom_name,
              bgBase64: inst.bgBase64 || '',
              url: inst.custom_url || '',
              row: inst.row,
              col: inst.col,
              size: inst.size as 'small'|'medium'|'large'
            }));
            setCards(loadedCards);
          }
        }
      })
      .catch(err => console.error('Error fetching dashboard:', err))
      .finally(() => setIsLoading(false));
  }, [dashboardId]);

  // Función auxiliar para guardar cambios en el backend
  const saveToBackend = async (newCards: AppCard[], newWallpaper?: string) => {
    try {
      const payload: any = { cards: newCards };
      if (newWallpaper !== undefined) {
        payload.wallpaperBase64 = newWallpaper;
      }
      await fetch(`/api/dashboards/${dashboardId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error saving dashboard:', err);
    }
  };

  useEffect(() => {
    const handleOpenModal = () => openAddModal();
    const handleOpenCloneModal = () => setIsCloneModalOpen(true);
    const handleOpenWallpaperPicker = () => wallpaperInputRef.current?.click();
    
    const handleRemoveWallpaper = () => {
      setWallpaperBase64('');
      saveToBackend(cards, null as unknown as string); // Enviar null para borrar
    };

    const handleExportCsv = () => {
      if (cards.length === 0) {
        alert('No hay aplicaciones para exportar en este proyecto.');
        return;
      }
      
      const headers = ['name', 'url', 'size', 'bgBase64'];
      const rows = cards.map(c => [
        `"${c.name.replace(/"/g, '""')}"`,
        `"${(c.url || '').replace(/"/g, '""')}"`,
        c.size,
        `"${(c.bgBase64 || '').replace(/"/g, '""')}"`
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `beehive_export_${dashboardId}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    };

    window.addEventListener('openAddModal', handleOpenModal);
    window.addEventListener('openCloneModal', handleOpenCloneModal);
    window.addEventListener('openWallpaperPicker', handleOpenWallpaperPicker);
    window.addEventListener('removeWallpaper', handleRemoveWallpaper);
    window.addEventListener('exportCsv', handleExportCsv);
    
    return () => {
      window.removeEventListener('openAddModal', handleOpenModal);
      window.removeEventListener('openCloneModal', handleOpenCloneModal);
      window.removeEventListener('openWallpaperPicker', handleOpenWallpaperPicker);
      window.removeEventListener('removeWallpaper', handleRemoveWallpaper);
      window.removeEventListener('exportCsv', handleExportCsv);
    };
  }, [cards, dashboardId]);

  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setWallpaperBase64(base64);
        saveToBackend(cards, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const [_, rStr, cStr] = over.id.match(/r(\d+)-c(\d+)/);
    const targetRow = parseInt(rStr);
    const targetCol = parseInt(cStr);

    const draggedCard = cards.find(c => c.id === active.id);
    if (!draggedCard) return;

    const simulatedCard = { ...draggedCard, row: targetRow, col: targetCol };
    const targetSlots = getOccupiedSlots(simulatedCard);

    // Validación 1: Límites del Tablero
    if (targetSlots.some(s => s.r < 0 || s.r >= ROWS || s.c < 0 || s.c >= COLS)) {
      return; 
    }

    // Validación 2: Colisiones
    const overlapping = targetSlots.some(s => {
      const cardThere = getCardAtSlot(s.r, s.c, cards);
      return cardThere && cardThere.id !== draggedCard.id;
    });

    if (overlapping) {
      return; // Rebota a su lugar original
    }

    const newCards = cards.map(c => c.id === draggedCard.id ? simulatedCard : c);
    setCards(newCards);
    saveToBackend(newCards);
  };

  const getFirstEmptySlot = (size: 'small'|'medium'|'large') => {
    for (let r = 0; r < ROWS; r++) {
       for (let c = 0; c < COLS; c++) {
          const testCard = { row: r, col: c, size } as AppCard;
          const slots = getOccupiedSlots(testCard);
          
          if (slots.some(s => s.r < 0 || s.r >= ROWS || s.c < 0 || s.c >= COLS)) continue;
          if (slots.some(s => getCardAtSlot(s.r, s.c, cards))) continue;
          
          return { row: r, col: c };
       }
    }
    return { row: 0, col: 0 };
  };

  const openAddModal = () => {
    setEditingCard(null);
    setFormName('');
    setFormUrl('');
    setFormBgBase64('');
    setFormSize('small');
    setIsModalOpen(true);
  };

  const openEditModal = (card: AppCard) => {
    setEditingCard(card);
    setFormName(card.name);
    setFormUrl(card.url || '');
    setFormBgBase64(card.bgBase64);
    setFormSize(card.size || 'small');
    setIsModalOpen(true);
  };

  const handleCardClick = (card: AppCard) => {
    if (dashboardId === 'principal') {
      router.push(`/project/${card.id}?name=${encodeURIComponent(card.name)}`);
    } else {
      if (card.url) {
        let finalUrl = card.url.trim();
        // Asegurar que la URL tenga un protocolo, de lo contrario el navegador la trata como ruta interna
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = 'http://' + finalUrl;
        }
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormBgBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (keepOpen = false) => {
    let newCards: AppCard[];
    if (editingCard) {
      const testCard = { ...editingCard, name: formName, url: formUrl, bgBase64: formBgBase64, size: formSize };
      const targetSlots = getOccupiedSlots(testCard);
      
      const outOfBounds = targetSlots.some(s => s.r < 0 || s.r >= ROWS || s.c < 0 || s.c >= COLS);
      const overlapping = targetSlots.some(s => {
        const cardThere = getCardAtSlot(s.r, s.c, cards);
        return cardThere && cardThere.id !== editingCard.id;
      });

      if (outOfBounds || overlapping) {
         alert("No hay suficiente espacio libre para cambiar el tamaño en esta ubicación. Mueve las celdas adyacentes primero.");
         return;
      }
      newCards = cards.map(c => c.id === editingCard.id ? testCard : c);
    } else {
      const slot = getFirstEmptySlot(formSize);
      newCards = [...cards, { 
        id: Date.now().toString(), 
        name: formName || 'Nueva App', 
        url: formUrl,
        bgBase64: formBgBase64,
        row: slot.row,
        col: slot.col,
        size: formSize
      }];
    }
    
    setCards(newCards);
    saveToBackend(newCards);
    
    if (keepOpen) {
      setFormName('');
      setFormUrl('');
      setFormBgBase64('');
      setFormSize('small');
      setEditingCard(null);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (editingCard) {
      const confirmMessage = dashboardId === 'principal' 
        ? '¿Estás seguro de que deseas eliminar este proyecto y todas sus apps internas?' 
        : '¿Estás seguro de que deseas eliminar esta aplicación?';
        
      if (window.confirm(confirmMessage)) {
        const newCards = cards.filter(c => c.id !== editingCard.id);
        setCards(newCards);
        saveToBackend(newCards);
        setIsModalOpen(false);
      }
    }
  };

  const handleClone = (selectedApps: any[]) => {
    let currentCards = [...cards];
    
    selectedApps.forEach(app => {
      // Find the first empty slot for the app size
      // We need a helper that uses the currentCards so they don't overlap with newly added ones in this loop
      let foundSlot = { row: 0, col: 0 };
      
      const getEmptySlotWithCurrentCards = (size: 'small'|'medium'|'large', existingCards: AppCard[]) => {
        for (let r = 0; r < ROWS; r++) {
           for (let c = 0; c < COLS; c++) {
              const testCard = { row: r, col: c, size } as AppCard;
              const slots = getOccupiedSlots(testCard);
              
              if (slots.some(s => s.r < 0 || s.r >= ROWS || s.c < 0 || s.c >= COLS)) continue;
              if (slots.some(s => getCardAtSlot(s.r, s.c, existingCards))) continue;
              
              return { row: r, col: c };
           }
        }
        return { row: 0, col: 0 };
      };

      foundSlot = getEmptySlotWithCurrentCards(app.size, currentCards);

      currentCards.push({
        id: Date.now().toString() + Math.random().toString(),
        name: app.custom_name || app.name || 'App',
        url: app.custom_url || app.url || '',
        bgBase64: app.bgBase64 || '',
        row: foundSlot.row,
        col: foundSlot.col,
        size: app.size
      });
    });

    setCards(currentCards);
    saveToBackend(currentCards);
  };

  const renderGrid = () => {
    const grid = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const slotId = `r${r}-c${c}`;
        const cardInSlot = cards.find(card => card.row === r && card.col === c);
        
        let isHighlighted = false;
        let isDimmed = false;

        if (cardInSlot && searchQuery) {
          isHighlighted = cardInSlot.name.toLowerCase().includes(searchQuery.toLowerCase());
          isDimmed = !isHighlighted;
        }

        grid.push(
          <DroppableSlot key={slotId} id={slotId} row={r} col={c}>
            {cardInSlot ? (
              <DraggableCard 
                card={cardInSlot} 
                onEdit={openEditModal} 
                onClickCard={handleCardClick}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
              />
            ) : null}
          </DroppableSlot>
        );
      }
    }
    return grid;
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        ref={wallpaperInputRef}
        className="hidden"
        onChange={handleWallpaperChange}
      />
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={(e) => {
          setActiveDragId(e.active.id as string);
          setIsDraggingGrid(true);
        }}
        onDragEnd={(e) => {
          handleDragEnd(e);
          setActiveDragId(null);
          setIsDraggingGrid(false);
        }}
      >
        <div 
          className="absolute inset-0 select-none overflow-auto custom-scrollbar"
          style={wallpaperBase64 ? {
            backgroundImage: `url(${wallpaperBase64})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          } : {}}
        >
          {wallpaperBase64 && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-none"></div>}
          {!wallpaperBase64 && <ClassicBackgroundBees />}
          
          <div className="relative p-10 z-10" style={{ width: '4500px', height: '2500px' }}>
            {renderGrid()}
          </div>
        </div>
        
        <DragOverlay modifiers={[magneticSnapModifier]}>
          {activeDragId ? (() => {
             const activeCard = cards.find(c => c.id === activeDragId);
             if (!activeCard) return null;
             // Renderizamos el clon sin useDraggable
             return <CardView card={activeCard} onEdit={() => {}} onClickCard={() => {}} isOverlay />;
          })() : null}
        </DragOverlay>
      </DndContext>

      <CloneModal 
        isOpen={isCloneModalOpen} 
        onClose={() => setIsCloneModalOpen(false)} 
        onClone={handleClone} 
        onBulkImport={handleClone}
      />

      {/* Modal / Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingCard ? t('edit') : t('addProject')}
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('projectName')}</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder={t('projectPlaceholder')}
                />
              </div>

              {dashboardId !== 'principal' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('urlDestination')}</label>
                  <input 
                    type="text" 
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="https://192.168.1.50:8080"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('cellSize')}</label>
                <div className="flex gap-4">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <label key={size} className="flex-1 cursor-pointer">
                      <input 
                        type="radio" 
                        name="size" 
                        value={size} 
                        checked={formSize === size}
                        onChange={() => setFormSize(size)}
                        className="peer sr-only"
                      />
                      <div className="text-center py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg peer-checked:bg-amber-100 peer-checked:border-amber-500 dark:peer-checked:bg-amber-900/40 peer-checked:text-amber-700 dark:peer-checked:text-amber-400 font-medium transition-colors">
                        {t(size)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('logoOrBg')}</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  {formBgBase64 ? (
                    <img src={formBgBase64} alt="Preview" className="h-24 mx-auto object-contain rounded drop-shadow-md" />
                  ) : (
                    <div className="text-gray-500 flex flex-col items-center">
                      <Upload size={28} className="mb-2 text-amber-500" />
                      <span className="text-sm font-medium">{t('uploadManual')}</span>
                      <span className="text-xs text-gray-400 mt-1">{t('dragOrClick')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              {editingCard ? (
                <button 
                  onClick={handleDelete}
                  className="flex items-center text-red-500 hover:text-red-700 font-bold px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 size={18} className="mr-2" /> {t('delete')}
                </button>
              ) : <div></div>}
              
              <div className="flex gap-3 flex-1 justify-end ml-4">
                {!editingCard && (
                  <button 
                    onClick={() => handleSave(true)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 dark:text-amber-300 font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm text-sm"
                  >
                    {t('saveAndAddAnother')}
                  </button>
                )}
                <button 
                  onClick={() => handleSave(false)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl transition-transform hover:scale-105 shadow-md flex-1 text-center"
                >
                  {t('saveCell')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

