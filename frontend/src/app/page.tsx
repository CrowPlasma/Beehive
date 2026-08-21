"use client";
import React, { useState } from 'react';
import DashboardGrid from '@/components/DashboardGrid';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import GlobalInjectModal from '@/components/GlobalInjectModal';
import { Plus, Image as ImageIcon, ImageOff, Search, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlobalInjectOpen, setIsGlobalInjectOpen] = useState(false);
  const [isWallpaperMenuOpen, setIsWallpaperMenuOpen] = useState(false);

  const triggerAdd = () => {
    window.dispatchEvent(new CustomEvent('openAddModal'));
  };

  const triggerWallpaper = () => {
    window.dispatchEvent(new CustomEvent('openWallpaperPicker'));
  };

  const triggerRemoveWallpaper = () => {
    window.dispatchEvent(new CustomEvent('removeWallpaper'));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans bg-amber-50 dark:bg-gray-900">
      
      <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 shadow-sm z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-3xl drop-shadow-md">🐝</span>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Beehive</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none text-gray-700 dark:text-gray-200 w-48"
            />
          </div>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('exportCsv'))}
            className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 transition-colors"
            title={t('exportCsv')}
          >
            {t('exportCsv')}
          </button>

          <button
            onClick={() => setIsGlobalInjectOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            <Globe size={20} />
            <span className="hidden sm:inline">{t('globalInject')}</span>
          </button>

          <LanguageToggle />

          <div className="relative">
            <button
              onClick={() => setIsWallpaperMenuOpen(!isWallpaperMenuOpen)}
              className="p-2 text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
              title={t('changeWallpaper')}
            >
              <ImageIcon size={22} />
            </button>
            
            {isWallpaperMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsWallpaperMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      triggerWallpaper();
                      setIsWallpaperMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ImageIcon size={16} />
                    {t('changeWallpaper')}
                  </button>
                  <button
                    onClick={() => {
                      triggerRemoveWallpaper();
                      setIsWallpaperMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    <ImageOff size={16} />
                    {t('removeWallpaper')}
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={triggerAdd}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">{t('addProject')}</span>
          </button>
          
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-amber-50 dark:bg-gray-900 w-full h-full">
        <DashboardGrid dashboardId="principal" searchQuery={searchQuery} />
      </main>

      <GlobalInjectModal 
        isOpen={isGlobalInjectOpen} 
        onClose={() => setIsGlobalInjectOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </div>
  );
}
