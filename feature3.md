Actúa como un Staff Product Engineer, UX Designer y Software Architect especializado en Next.js 15, React 19, TailwindCSS, shadcn/ui, PostgreSQL, Prisma y plataformas SaaS impulsadas por IA.

Quiero rediseñar completamente el proceso de onboarding de Educa+.

Actualmente, cuando un usuario inicia sesión con Google, ingresa directamente a la plataforma.

Quiero cambiar esa experiencia.

==================================================
OBJETIVO
==================================================

Después del primer inicio de sesión con Google, el docente debe completar un proceso de bienvenida antes de utilizar EduAI.

No quiero un formulario largo y aburrido.

Quiero una experiencia moderna, amigable y muy cuidada, similar al onboarding de Notion, Duolingo, Linear, Vercel o Canva.

El objetivo es conocer al docente para personalizar completamente la plataforma.

Toda la información recopilada deberá utilizarse posteriormente para:

- Personalizar la interfaz.
- Configurar el contexto de la IA.
- Mejorar el RAG.
- Reducir la cantidad de información que el docente debe ingresar al generar sesiones.
- Recordar preferencias entre sesiones.

==================================================
EXPERIENCIA
==================================================

Después del login con Google.

Mostrar una pantalla de bienvenida.

Ejemplo

"¡Bienvenido a EduAI!"

"Antes de comenzar queremos conocer un poco sobre ti para personalizar tu experiencia."

Mostrar una barra de progreso.

Ejemplo

Paso 1 de 5

El proceso no debe tomar más de 1 o 2 minutos.

==================================================
PASO 1
UBICACIÓN
==================================================

Preguntar

¿En qué región enseñas?

Selector

Departamento

Al seleccionar el departamento.

Cargar automáticamente

Provincias.

Luego

Distritos.

Una vez seleccionado el distrito.

Consultar la base de datos de instituciones educativas.

Mostrar un Autocomplete.

Buscar colegio por nombre.

Ejemplo

"I.E. José Carlos Mariátegui"

Mientras escribe.

Realizar búsqueda incremental.

Mostrar

Nombre

Código modular

Gestión

Nivel

Distrito

Provincia

Cuando seleccione el colegio.

Autocompletar automáticamente.

- UGEL
- DRE
- Gestión
- Dirección
- Código Modular
- Tipo de gestión
- Área urbana/rural (si existe)
- Nivel educativo disponible

No obligar al docente a escribir estos datos.

==================================================
PASO 2
¿A QUIÉN ENSEÑAS?
==================================================

Permitir seleccionar múltiples opciones.

Nivel educativo

- Inicial
- Primaria
- Secundaria
- EBA
- EBE

Luego

Grados que enseña.

Ejemplo

4°
5°
6°

Si enseña varios grados.

Poder seleccionar múltiples.

Luego

Áreas curriculares.

Matemática

Comunicación

CTA

DPCC

Ciencias Sociales

EPT

Arte

Educación Física

etc.

Permitir múltiples áreas.

==================================================
PASO 3
EXPERIENCIA
==================================================

Preguntar

¿Cuántos años llevas enseñando?

Opciones

0-2

3-5

6-10

10+

Esto servirá para personalizar posteriormente el nivel de ayuda que ofrece la IA.

==================================================
PASO 4
OBJETIVOS
==================================================

¿Qué esperas lograr con EduAI?

Checkbox

Generar sesiones

Crear experiencias

Evaluaciones

Rúbricas

Material para Inicial

Presentaciones

Fichas

Planificación anual

Banco de preguntas

Otro

==================================================
PASO 5
PERSONALIZACIÓN
==================================================

Preguntar

¿Con qué frecuencia utilizas IA?

Nunca

Pocas veces

Frecuentemente

Todos los días

Esto permitirá adaptar la complejidad de la interfaz.

==================================================
BASE DE DATOS
==================================================

Guardar toda la información en PostgreSQL.

Diseñar correctamente las tablas.

No almacenar información duplicada.

Relacionar

users

teacher_profile

school

regions

ugels

preferences

subjects

grades

levels

Crear relaciones normalizadas.

==================================================
PERSONALIZACIÓN
==================================================

Toda esta información deberá utilizarse posteriormente.

Ejemplos.

Si el profesor enseña

Matemática.

Mostrar primero herramientas relacionadas.

Si enseña Inicial.

Mostrar experiencias de aprendizaje antes que sesiones.

Si pertenece a la región Cusco.

Mostrar recursos contextualizados cuando sea posible.

Si pertenece a una institución EIB.

Considerar esa información para futuras funcionalidades.

==================================================
IA
==================================================

Toda esta información deberá incorporarse automáticamente al contexto de la IA.

Ejemplo.

Cuando el docente solicite

"Genera una sesión sobre fracciones."

No volver a preguntar.

Nivel.

Área.

Grado.

Colegio.

La IA ya debe conocer automáticamente.

- Nivel educativo.
- Área.
- Grados que enseña.
- Región.
- Colegio.
- Gestión.
- Preferencias.
- Historial de uso.

La contextualización debe ser transparente para el usuario.

==================================================
RAG
==================================================

Utilizar esta información para mejorar las búsquedas.

Ejemplo.

Si el docente enseña Inicial.

Buscar primero documentos de Inicial.

Si enseña Primaria.

Priorizar Primaria.

Si enseña Matemática.

Priorizar documentos de Matemática.

Si pertenece a una región con EIB.

Preparar el sistema para futuras recomendaciones contextualizadas.

==================================================
UX
==================================================

Diseñar una experiencia premium.

No utilizar formularios largos.

Dividir todo en pasos.

Mostrar animaciones suaves.

Indicador de progreso.

Transiciones.

Validaciones en tiempo real.

Autoguardado.

Poder continuar posteriormente.

Diseño responsive.

Optimizado para escritorio y móvil.

==================================================
RESULTADO
==================================================

Refactorizar completamente el onboarding.

Implementar una experiencia moderna.

Crear todos los componentes.

Crear el flujo frontend.

Crear el flujo backend.

Diseñar el esquema de base de datos.

Diseñar las APIs.

Diseñar el contexto que utilizará la IA.

Seguir principios SOLID.

Código limpio.

Escalable.

Preparado para cientos de miles de docentes.

No implementar únicamente un formulario.

Diseñar un sistema de personalización inteligente que convierta a EduAI en un asistente docente personalizado desde el primer día.