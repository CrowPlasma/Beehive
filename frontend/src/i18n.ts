import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    resources: {
      es: {
        translation: {
          "search": "Buscar...",
          "exportCsv": "CSV",
          "globalInject": "Inyección Global",
          "changeWallpaper": "Cambiar Wallpaper",
          "removeWallpaper": "Quitar Wallpaper",
          "addProject": "Añadir Proyecto",
          "addApp": "Añadir App",
          "library": "Biblioteca",
          "save": "Guardar",
          "saveAndAnother": "Guardar y Hacer Otro",
          "cancel": "Cancelar",
          "delete": "Eliminar",
          "edit": "Editar",
          "projectName": "Nombre del Proyecto / App",
          "projectPlaceholder": "Ej. Servidor NAS",
          "cellSize": "Tamaño de la Celda",
          "small": "Pequeña",
          "medium": "Mediana",
          "large": "Gigante",
          "logoOrBg": "Logo o Imagen de Fondo",
          "uploadManual": "Sube una imagen manual",
          "dragOrClick": "Arrastra o haz clic aquí",
          "saveCell": "Guardar Celda",
          "saveAndAddAnother": "Guardar y Añadir Otro",
          "urlDestination": "URL (Destino)",
          "globalInjectDesc": "Esta aplicación se añadirá automáticamente a TODOS tus proyectos actuales de forma masiva.",
          "appName": "Nombre de la App",
          "injecting": "Inyectando...",
          "injectAll": "Inyectar a Todos",
          "globalLibrary": "Biblioteca Global",
          "libraryDesc": "Busca y clona aplicaciones que hayas usado en cualquier otro proyecto.",
          "searchAppPlaceholder": "Buscar aplicación por nombre o URL...",
          "noResults": "No hay resultados",
          "noResultsDesc": "Prueba buscando otra palabra o añade apps nuevas a tus proyectos.",
          "importSelected": "Importar",
          "importCsv": "Importar CSV/JSON",
          "selectedCount": "{{count}} seleccionadas",
        }
      },
      en: {
        translation: {
          "search": "Search...",
          "exportCsv": "CSV",
          "globalInject": "Global Inject",
          "changeWallpaper": "Change Wallpaper",
          "removeWallpaper": "Remove Wallpaper",
          "addProject": "Add Project",
          "addApp": "Add App",
          "library": "Library",
          "save": "Save",
          "saveAndAnother": "Save & Add Another",
          "cancel": "Cancel",
          "delete": "Delete",
          "edit": "Edit",
          "projectName": "Project / App Name",
          "projectPlaceholder": "e.g. NAS Server",
          "cellSize": "Cell Size",
          "small": "Small",
          "medium": "Medium",
          "large": "Large",
          "logoOrBg": "Logo or Background Image",
          "uploadManual": "Upload image manually",
          "dragOrClick": "Drag or click here",
          "saveCell": "Save Cell",
          "saveAndAddAnother": "Save & Add Another",
          "urlDestination": "URL (Destination)",
          "globalInjectDesc": "This application will be automatically added to ALL your current projects massively.",
          "appName": "App Name",
          "injecting": "Injecting...",
          "injectAll": "Inject to All",
          "globalLibrary": "Global Library",
          "libraryDesc": "Search and clone apps you have used in any other project.",
          "searchAppPlaceholder": "Search app by name or URL...",
          "noResults": "No results found",
          "noResultsDesc": "Try searching another word or add new apps to your projects.",
          "importSelected": "Import",
          "importCsv": "Import CSV/JSON",
          "selectedCount": "{{count}} selected",
        }
      }
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
