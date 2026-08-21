<div align="center">
  <h1>🐝 Beehive Dashboard</h1>
  <p><strong>A modern, self-hosted personal dashboard to organize your web apps and services.</strong></p>
  <p><strong>Un dashboard personal moderno y auto-alojado para organizar tus aplicaciones web y servicios.</strong></p>
  
  <p>
    <a href="#english">🇬🇧 English</a> •
    <a href="#español">🇪🇸 Español</a>
  </p>
</div>

---

<h2 id="english">🇬🇧 English</h2>

**Beehive** is a modular, visual, and highly interactive dashboard designed to act as your digital headquarters. Whether you are managing a homelab, organizing environments for a development team, or just keeping track of your daily web tools, Beehive provides a fluid drag-and-drop experience to keep everything just a click away.

### ✨ Features

- 🧲 **Magnetic Snap-to-Grid:** An incredibly smooth Drag & Drop experience to arrange your cards exactly how you want them.
- 📁 **Multi-Dashboard Support:** Create dedicated sub-dashboards (projects) to separate your infrastructure, media, or development tools.
- 🌍 **Global App Library:** Easily search and clone applications you've previously added across different dashboards.
- 🚀 **Global Injection:** Add a single application to all your existing projects simultaneously.
- 📥 **Bulk Import:** Quickly set up your dashboard by importing a CSV or JSON file containing your apps.
- 🎨 **Total Customization:** Upload custom images for app icons and set personalized wallpapers for every single dashboard.
- 🌐 **Bilingual (i18n):** Native support for English and Spanish, switchable on the fly without reloading.

### 🛠️ Tech Stack

- **Frontend:** Next.js (React), TailwindCSS, `@dnd-kit/core` (for physics-based drag & drop), `react-i18next`.
- **Backend:** Node.js, Express.
- **Database:** PostgreSQL accessed via Prisma ORM.
- **Deployment:** 100% Dockerized.

### 🚀 Getting Started (Docker)

Beehive is designed to be deployed effortlessly using Docker and Docker Compose. 

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/beehive.git
   cd beehive
   ```
2. Start the containers using Docker Compose:
   ```bash
   docker-compose up -d
   ```
3. Access your dashboard at `http://localhost:3000` (or the port you configured).

*Note: Beehive is fully compatible with container managers like Dockge and Portainer.*

---

<h2 id="español">🇪🇸 Español</h2>

**Beehive** es un dashboard modular, visual y altamente interactivo diseñado para actuar como tu cuartel general digital. Ya sea que estés administrando un servidor en casa (homelab), organizando entornos para un equipo de desarrollo o simplemente ordenando tus herramientas web diarias, Beehive te ofrece una experiencia fluida para mantener todo a un clic de distancia.

### ✨ Características

- 🧲 **Grid Magnético (Drag & Drop):** Una experiencia de arrastrar y soltar increíblemente suave para acomodar tus tarjetas exactamente donde las quieres.
- 📁 **Soporte Multi-Dashboard:** Crea sub-tableros dedicados (proyectos) para separar tu infraestructura, multimedia o herramientas de desarrollo.
- 🌍 **Biblioteca Global:** Busca y clona fácilmente aplicaciones que ya hayas usado en cualquier otro tablero.
- 🚀 **Inyección Global:** Añade una misma aplicación a todos tus proyectos existentes de forma masiva y simultánea.
- 📥 **Importación Masiva:** Configura tu dashboard en segundos importando un archivo CSV o JSON con tus aplicaciones.
- 🎨 **Personalización Total:** Sube imágenes personalizadas para los íconos de las apps y define fondos de pantalla únicos para cada tablero.
- 🌐 **Bilingüe (i18n):** Soporte nativo para Inglés y Español, intercambiable al instante sin recargar la página.

### 🛠️ Stack Tecnológico

- **Frontend:** Next.js (React), TailwindCSS, `@dnd-kit/core` (para las físicas de arrastre), `react-i18next`.
- **Backend:** Node.js, Express.
- **Base de Datos:** PostgreSQL gestionada mediante Prisma ORM.
- **Despliegue:** 100% Dockerizado.

### 🚀 Instalación (Docker)

Beehive está diseñado para desplegarse sin esfuerzo utilizando Docker y Docker Compose.

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/beehive.git
   cd beehive
   ```
2. Levanta los contenedores usando Docker Compose:
   ```bash
   docker-compose up -d
   ```
3. Accede a tu dashboard en `http://localhost:3000` (o el puerto que hayas configurado).

*Nota: Beehive es totalmente compatible con gestores de contenedores como Dockge y Portainer.*

---

### 🤝 Contributing / Contribuciones
Pull requests are welcome! Feel free to open an issue if you want to suggest a new feature or report a bug.

¡Las Pull Requests son bienvenidas! Siéntete libre de abrir un *issue* si deseas sugerir una nueva funcionalidad o reportar un error.

### 📝 License
[MIT License](LICENSE)
