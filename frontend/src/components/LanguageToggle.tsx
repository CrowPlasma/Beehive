"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-bold text-sm"
      title="Cambiar Idioma / Change Language"
    >
      <Globe size={20} />
      <span>{i18n.language.startsWith('es') ? 'ES' : 'EN'}</span>
    </button>
  );
}
