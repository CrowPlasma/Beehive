"use client";
import React, { useEffect } from 'react';
import '../i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // Solo necesitamos importar el archivo para que i18n se inicialice.
  return <>{children}</>;
}
