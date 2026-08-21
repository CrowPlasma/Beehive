"use client";
import React, { useState } from 'react';
import DashboardGrid from '@/components/DashboardGrid';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search, Plus, Library, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export const dynamic = 'force-dynamic';

export default function ProjectDashboardWrapper() {
  return (
    <React.Suspense fallback={<div className="flex h-screen items-center justify-center bg-amber-50">Cargando proyecto...</div>}>
      <ProjectDashboard />
    </React.Suspense>
  );
}

function ProjectDashboard() {
  const { t } = useTranslation();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = params?.id as string;
  const name = searchParams?.get('name') || 'Proyecto';
  
  const [searchQuery, setSearchQuery] = useState('');

  const triggerAdd = () => {
    window.dispatchEvent(new CustomEvent('openAddModal'));
  };

  const triggerClone = () => {
    window.dispatchEvent(new CustomEvent('openCloneModal'));
  };

  const triggerWallpaper = () => {
    window.dispatchEvent(new CustomEvent('openWallpaperPicker'));
  };

  if (!id) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans bg-amber-50 dark:bg-gray-900">
      
      <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 shadow-sm z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl drop-shadow-md">🐝</span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {name}
            </h1>
          </div>
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
            onClick={triggerWallpaper}
            className="p-2 text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
            title={t('changeWallpaper')}
          >
            <ImageIcon size={22} />
          </button>

          <button
            onClick={triggerClone}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-400 font-bold rounded-lg transition-colors"
          >
            <Library size={20} />
            <span className="hidden sm:inline">{t('library')}</span>
          </button>

          <LanguageToggle />

          <button
            onClick={triggerAdd}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">{t('addApp')}</span>
          </button>
          
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden bg-amber-50 dark:bg-gray-900 w-full h-full">
        <DashboardGrid dashboardId={id} searchQuery={searchQuery} />
      </main>
    </div>
  );
}
