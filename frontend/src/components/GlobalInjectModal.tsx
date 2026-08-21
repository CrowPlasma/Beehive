import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GlobalInjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GlobalInjectModal({ isOpen, onClose, onSuccess }: GlobalInjectModalProps) {
  const { t } = useTranslation();
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formSize, setFormSize] = useState<'small' | 'medium' | 'large'>('small');
  const [isInjecting, setIsInjecting] = useState(false);

  if (!isOpen) return null;

  const handleInject = async () => {
    if (!formName) return alert('El nombre es requerido');
    
    if (!window.confirm(`¿Estás seguro de inyectar "${formName}" en TODOS los proyectos? Esto modificará todos los tableros al mismo tiempo.`)) {
      return;
    }

    setIsInjecting(true);
    try {
      const res = await fetch('/api/dashboards/global/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          url: formUrl,
          size: formSize
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Éxito. La aplicación se inyectó en ${data.injectedCount} proyectos.`);
        onSuccess();
        onClose();
        setFormName('');
        setFormUrl('');
      } else {
        alert('Hubo un error inyectando la app');
      }
    } catch (e) {
      alert('Error de red al intentar inyectar');
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-blue-500/30">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Globe className="text-blue-500" /> {t('globalInject')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t('globalInjectDesc')}
        </p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('appName')}</label>
            <input 
              type="text" 
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t('projectPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('urlDestination')}</label>
            <input 
              type="text" 
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://192.168.1.100:8006"
            />
          </div>

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
                  <div className="text-center py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg peer-checked:bg-blue-100 peer-checked:border-blue-500 dark:peer-checked:bg-blue-900/40 peer-checked:text-blue-700 dark:peer-checked:text-blue-400 font-medium transition-colors">
                    {t(size)}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            {t('cancel')}
          </button>
          <button 
            onClick={handleInject}
            disabled={isInjecting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isInjecting ? t('injecting') : t('injectAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
