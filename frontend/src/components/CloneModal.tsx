import React, { useState, useEffect, useRef } from 'react';
import { X, Search, CheckSquare, Copy, UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CatalogItem {
  id: string;
  custom_name: string;
  custom_url: string;
  bgBase64: string;
  size: 'small' | 'medium' | 'large';
  dashboardId: string;
  dashboard: { name: string, id: string };
}

interface CloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClone: (selectedApps: any[]) => void;
  onBulkImport: (apps: any[]) => void;
}

export default function CloneModal({ isOpen, onClose, onClone, onBulkImport }: CloneModalProps) {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/api/dashboards/catalog/history')
        .then(res => res.json())
        .then(data => {
          // Deduplicación básica por URL o nombre
          const uniqueMap = new Map<string, CatalogItem>();
          data.forEach((item: CatalogItem) => {
            const key = `${item.custom_name}-${item.custom_url}`;
            if (!uniqueMap.has(key)) {
              uniqueMap.set(key, item);
            }
          });
          setCatalog(Array.from(uniqueMap.values()));
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCatalog = catalog.filter(app => 
    app.custom_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (app.custom_url && app.custom_url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleImport = () => {
    const selectedApps = catalog.filter(app => selectedIds.has(app.id));
    onClone(selectedApps);
    setSelectedIds(new Set());
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          if (file.name.endsWith('.csv')) {
            const lines = text.split('\n').filter(l => l.trim() !== '');
            if (lines.length > 1) {
              const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
              const parsedApps = [];
              for (let i = 1; i < lines.length; i++) {
                // Split considerando comillas si las hay
                const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
                const appObj: any = {};
                headers.forEach((h, idx) => {
                  appObj[h] = values[idx] || '';
                });
                if (appObj.name || appObj.nombre) {
                  parsedApps.push({
                    name: appObj.name || appObj.nombre || 'App Importada',
                    url: appObj.url || '',
                    bgBase64: appObj.bgbase64 || appObj.icono || '',
                    size: appObj.size || appObj.tamano || 'small'
                  });
                }
              }
              onBulkImport(parsedApps);
              onClose();
            } else {
              alert("El archivo CSV parece estar vacío o mal formateado.");
            }
          } else {
            // Manejar JSON
            const json = JSON.parse(text);
            if (Array.isArray(json)) {
              const formatted = json.map(item => ({
                name: item.name || item.title || item.custom_name || 'App Importada',
                url: item.url || item.custom_url || '',
                bgBase64: item.bgBase64 || item.icon || item.logo || '',
                size: item.size || 'small'
              }));
              onBulkImport(formatted);
              onClose();
            } else {
              alert("El archivo JSON debe contener un arreglo (array) de aplicaciones.");
            }
          }
        } catch (error) {
          alert("Error al leer el archivo. Verifica que el formato CSV o JSON sea correcto.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <input type="file" accept=".json,.csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] relative overflow-hidden">
        
        <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10 shadow-sm">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Copy className="text-indigo-500" /> {t('globalLibrary')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('libraryDesc')}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={t('searchAppPlaceholder')} 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-gray-500 font-medium">...</div>
          ) : filteredCatalog.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-400 text-center">
              <Search size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-bold text-gray-500">{t('noResults')}</p>
              <p className="text-sm">{t('noResultsDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCatalog.map(app => (
                <div 
                  key={`${app.id}-${app.custom_name}`}
                  onClick={() => toggleSelect(app.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedIds.has(app.id) ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm'}`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${selectedIds.has(app.id) ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {selectedIds.has(app.id) && <CheckSquare size={16} />}
                  </div>
                  
                  {app.bgBase64 ? (
                    <img src={app.bgBase64} alt={app.custom_name} className="w-10 h-10 rounded object-cover shadow-sm bg-white" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                      <span className="text-gray-500 text-xs font-bold">{app.custom_name.substring(0,2).toUpperCase()}</span>
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{app.custom_name}</p>
                    {app.custom_url && <p className="text-xs text-gray-500 truncate">{app.custom_url}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shrink-0">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors border border-amber-200 dark:border-amber-700/50"
          >
            <UploadCloud size={18} />
            <span className="hidden sm:inline">{t('importCsv')}</span>
          </button>
          
          <div className="flex gap-3 items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">
              {t('selectedCount', { count: selectedIds.size })}
            </span>
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {t('cancel')}
            </button>
            <button 
              onClick={handleImport}
              disabled={selectedIds.size === 0}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <Copy size={18} />
              {t('importSelected')} {selectedIds.size > 0 && `(${selectedIds.size})`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
