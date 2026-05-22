# EduAI - Sesión+ (Frontend)

Sesión+ es una plataforma web moderna e interactiva diseñada para docentes peruanos. Permite generar sesiones de aprendizaje estructuradas en segundos, totalmente alineadas al **Currículo Nacional de la Educación Básica (CNEB)**, adaptadas al contexto de cada aula y con procesos didácticos exactos.

## 🚀 Tecnologías Core

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Estilos**: Tailwind CSS & CSS Variables
- **Iconografía**: [Lucide React](https://lucide.dev/)

---

## 🤖 Bot de WhatsApp con IA

Para mayor accesibilidad, contamos con un **Asistente de IA en WhatsApp** que permite a los docentes generar y consultar planificaciones al instante directamente desde su teléfono móvil.

- **Número de WhatsApp**: `+51 984 277 478`
- **Enlace de Acceso Rápido**: [Chatear con el Asistente en WhatsApp](https://wa.me/51984277478?text=Hola!%20Quiero%20probar%20el%20bot%20de%20IA)

El bot está diseñado para responder a consultas estructuradas en lenguaje natural, proporcionando secuencias didácticas completas (Inicio, Desarrollo, Cierre), propósitos de aprendizaje y criterios de evaluación listos para usar en el aula.

---

## 🛠️ Instalación y Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno**:
   Crea o edita el archivo `.env.local` con las rutas a los microservicios correspondientes:
   ```env
   NEXT_PUBLIC_AUTH_URL=http://localhost:8000
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`.

---

## 📁 Estructura del Proyecto

- `/app`: Enrutamiento y estructura de páginas de Next.js.
- `/components`: Componentes reutilizables de la aplicación (creador de sesiones, repositorio público, dashboard, etc.).
- `/public`: Activos estáticos, imágenes y vectores.
- `/styles`: Archivos de configuración de estilos CSS globales.
