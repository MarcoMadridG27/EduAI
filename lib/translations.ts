export type Language = "es" | "en" | "qu" | "ay";

export interface TranslationDictionary {
  // Common
  welcome: string;
  login: string;
  logout: string;
  exit: string;
  dashboard: string;
  back: string;
  save: string;
  download: string;
  copy: string;
  copied: string;
  loading: string;
  generate: string;
  generating: string;
  home: string;
  teacher: string;
  grade: string;
  section: string;
  date: string;
  theme: string;
  sessionTitle: string;
  duration: string;
  competencies: string;
  capacities: string;
  context: string;
  materials: string;
  evaluation: string;

  // Landing Page
  heroSubtitle: string;
  startNow: string;
  exploreRepo: string;
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  smartGenTitle: string;
  smartGenDesc: string;
  contextualTitle: string;
  contextualDesc: string;
  repoTitle: string;
  repoDesc: string;
  whatsAppTitle: string;
  whatsAppDesc: string;
  whatsAppCTA: string;
  interactiveDemo: string;
  interactiveDemoDesc: string;
  planificationTitle: string;
  planificationDesc: string;

  // Generator Page
  generatorTitle: string;
  generatorSubtitle: string;
  newSession: string;
  formInstructions: string;
  formProgress: string;
  docenteLabel: string;
  docentePlaceholder: string;
  fechaLabel: string;
  gradoLabel: string;
  seccionLabel: string;
  seccionPlaceholder: string;
  temaLabel: string;
  temaPlaceholder: string;
  tituloLabel: string;
  tituloPlaceholder: string;
  horasLabel: string;
  contextoLabel: string;
  competenciaTransversalLabel: string;
  enfoqueTransversalLabel: string;
  materialesLabel: string;
  materialesPlaceholder: string;
  evaluacionLabel: string;
  idiomaLabel: string;
  generateBtn: string;
  generatingStep1: string;
  generatingStep2: string;
  generatingStep3: string;
  generatingStep4: string;

  // Results Page
  resultsTitle: string;
  resultsSaved: string;
  resultsAlert: string;
  editSession: string;
  tabGeneral: string;
  tabSequence: string;
  tabResources: string;
  purpose: string;
  criterios: string;
  evidences: string;
  secuenciaMetodologica: string;
  inicio: string;
  desarrollo: string;
  cierre: string;
  materialesSugeridos: string;
  fichasTrabajo: string;
  problemasEjercicios: string;
  juegoDidactico: string;
  comunicadoPadres: string;
  actividadesDiferenciadas: string;

  // Dashboard Page
  dashboardTitle: string;
  dashboardSubtitle: string;
  totalSessions: string;
  openSession: string;
  noSessions: string;
  overview: string;
  mySessions: string;
  createdSessions: string;
  timeSaved: string;
  contexts: string;
  communityImpact: string;
  contributions: string;
  teachersHelped: string;
  generationActivity: string;
  cyclesActivity: string;
  topCompetencies: string;
  organizeHistory: string;
  recent: string;
  byBimester: string;
  createNewSession: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  es: {
    welcome: "¡Bienvenido!",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    exit: "Salir",
    dashboard: "Dashboard",
    back: "Regresar",
    save: "Guardar en Repositorio",
    download: "Descargar JSON",
    copy: "Copiar Plan",
    copied: "¡Copiado con éxito!",
    loading: "Cargando...",
    generate: "Generar Clase con IA",
    generating: "Generando...",
    home: "Inicio",
    teacher: "Docente",
    grade: "Grado",
    section: "Sección",
    date: "Fecha",
    theme: "Tema Central",
    sessionTitle: "Título de la Sesión",
    duration: "Duración",
    competencies: "Competencias",
    capacities: "Capacidades",
    context: "Contexto sociocultural",
    materials: "Materiales disponibles",
    evaluation: "Evaluación",

    heroSubtitle: "Genera sesiones de aprendizaje estructuradas en segundos. Alineadas al CNEB, con procesos didácticos exactos y adaptadas al contexto de tu aula.",
    startNow: "Comenzar ahora",
    exploreRepo: "Explorar Repositorio",
    whyChooseTitle: "Diseñado por y para docentes peruanos",
    whyChooseSubtitle: "Olvídate de empezar desde cero. Educa + agiliza tu planificación pedagógica para que te enfoques en lo que realmente importa: enseñar y conectar con tus estudiantes.",
    smartGenTitle: "Generador Inteligente",
    smartGenDesc: "IA entrenada para estructurar secuencias metodológicas, propósitos y criterios de evaluación exactos.",
    contextualTitle: "Actividades Contextualizadas",
    contextualDesc: "Ingresa el contexto de tu aula y obtén problemas y dinámicas relevantes para el entorno de tus estudiantes.",
    repoTitle: "Repositorio Colaborativo",
    repoDesc: "Accede a una gran base de sesiones creadas por otros docentes. Inspírate, copia y edita para tus clases.",
    whatsAppTitle: "Planifica tus clases por WhatsApp",
    whatsAppDesc: "¿Sin tiempo para sentarse a la computadora? Ahora puedes interactuar con nuestro Asistente de IA directo desde tu WhatsApp. Genera secuencias didácticas, propósitos y actividades completas con un solo mensaje.",
    whatsAppCTA: "Chatear con el Bot",
    interactiveDemo: "Mira cómo funciona",
    interactiveDemoDesc: "Experimenta con nuestra demo interactiva de Educa + y descubre el poder de la planificación con IA.",
    planificationTitle: "Planificación Inteligente con IA",
    planificationDesc: "Planificar nunca fue tan fácil",

    generatorTitle: "Genera tu Sesión de Aprendizaje",
    generatorSubtitle: "Asistente para docentes de matemática",
    newSession: "Nueva Sesión",
    formInstructions: "Completa el formulario para generar tu clase con Inteligencia Artificial.",
    formProgress: "Progreso general",
    docenteLabel: "Nombre del Docente",
    docentePlaceholder: "Ej. Prof. Carlos Mendoza",
    fechaLabel: "Fecha de la Sesión",
    gradoLabel: "Grado de Secundaria",
    seccionLabel: "Sección",
    seccionPlaceholder: "Ej. A",
    temaLabel: "Tema de la clase",
    temaPlaceholder: "Ej. Ecuaciones cuadráticas en la vida diaria",
    tituloLabel: "Título sugerido para la sesión",
    tituloPlaceholder: "Ej. Resolvemos problemas utilizando balanzas y ecuaciones",
    horasLabel: "Horas pedagógicas",
    contextoLabel: "Contexto sociocultural del aula",
    competenciaTransversalLabel: "Competencia Transversal",
    enfoqueTransversalLabel: "Enfoque Transversal",
    materialesLabel: "Materiales y recursos adicionales en el aula",
    materialesPlaceholder: "Ej. Conchas de mar, semillas locales, laptop, papelote...",
    evaluacionLabel: "Instrumento de evaluación preferido",
    idiomaLabel: "Idioma de la Sesión",
    generateBtn: "Diseñar mi Sesión con IA",
    generatingStep1: "Iniciando conexión con IA...",
    generatingStep2: "Buscando contexto en el Currículo Nacional...",
    generatingStep3: "Estructurando la secuencia metodológica...",
    generatingStep4: "Generando fichas de trabajo y recursos...",

    resultsTitle: "Tu Sesión de Aprendizaje Generada",
    resultsSaved: "Esta sesión está guardada en tu repositorio privado.",
    resultsAlert: "¡Felicidades! Tu sesión ha sido estructurada de acuerdo a los estándares del CNEB.",
    editSession: "Editar campos",
    tabGeneral: "Datos & Propósito",
    tabSequence: "Secuencia Metodológica",
    tabResources: "Recursos de Aula",
    purpose: "Propósito de Aprendizaje",
    criterios: "Criterios de Evaluación",
    evidences: "Evidencias de Aprendizaje",
    secuenciaMetodologica: "Secuencia Didáctica",
    inicio: "Inicio (Motivación y saberes previos)",
    desarrollo: "Desarrollo (Gestión y acompañamiento)",
    cierre: "Cierre (Metacognición y evaluación)",
    materialesSugeridos: "Materiales Sugeridos",
    fichasTrabajo: "Fichas de Trabajo Progresivas",
    problemasEjercicios: "Problemas y Ejercicios Prácticos",
    juegoDidactico: "Juego Didáctico Sugerido",
    comunicadoPadres: "Comunicado para Padres (WhatsApp)",
    actividadesDiferenciadas: "Actividades Diferenciadas",

    dashboardTitle: "Mi Dashboard Pedagógico",
    dashboardSubtitle: "Aquí puedes ver y gestionar las sesiones que has guardado.",
    totalSessions: "Sesiones Guardadas",
    openSession: "Ver Sesión",
    noSessions: "Aún no tienes sesiones guardadas. ¡Genera una nueva sesión para empezar!",
    overview: "Vista General",
    mySessions: "Mis Sesiones",
    createdSessions: "Sesiones Creadas",
    timeSaved: "Tiempo Ahorrado",
    contexts: "Contextos",
    communityImpact: "Tu Impacto en la Comunidad",
    contributions: "Aportes al Repositorio",
    teachersHelped: "Docentes Ayudados",
    generationActivity: "Actividad de Generación",
    cyclesActivity: "Ciclos con más Actividad",
    topCompetencies: "Competencias Más Trabajadas",
    organizeHistory: "Organizar Historial",
    recent: "Recientes",
    byBimester: "Por Bimestre",
    createNewSession: "Crear Nueva Sesión con IA"
  },
  en: {
    welcome: "Welcome!",
    login: "Log In",
    logout: "Log Out",
    exit: "Exit",
    dashboard: "Dashboard",
    back: "Go Back",
    save: "Save to Repository",
    download: "Download JSON",
    copy: "Copy Plan",
    copied: "Successfully Copied!",
    loading: "Loading...",
    generate: "Generate Session with AI",
    generating: "Generating...",
    home: "Home",
    teacher: "Teacher",
    grade: "Grade",
    section: "Section",
    date: "Date",
    theme: "Central Topic",
    sessionTitle: "Session Title",
    duration: "Duration",
    competencies: "Competencies",
    capacities: "Capacities",
    context: "Sociocultural Context",
    materials: "Available Materials",
    evaluation: "Evaluation",

    heroSubtitle: "Generate structured lesson plans in seconds. Aligned with the Peruvian National Curriculum (CNEB), with exact pedagogical processes and customized to your classroom's context.",
    startNow: "Start now",
    exploreRepo: "Explore Repository",
    whyChooseTitle: "Designed by and for Peruvian educators",
    whyChooseSubtitle: "Forget about starting from scratch. Educa + speeds up your lesson planning so you can focus on what really matters: teaching and connecting with your students.",
    smartGenTitle: "Intelligent Generator",
    smartGenDesc: "AI trained to structure exact methodological sequences, learning purposes, and assessment criteria.",
    contextualTitle: "Contextualized Activities",
    contextualDesc: "Enter your classroom's environment and get mathematical problems and dynamics relevant to your students' daily lives.",
    repoTitle: "Collaborative Repository",
    repoDesc: "Access a large base of sessions created by other teachers. Get inspired, copy, and edit them for your classes.",
    whatsAppTitle: "Plan your lessons via WhatsApp",
    whatsAppDesc: "No time to sit at the computer? Now you can interact with our AI Assistant directly from WhatsApp. Generate full pedagogical sequences, goals, and worksheets with a single message.",
    whatsAppCTA: "Chat with the Bot",
    interactiveDemo: "See how it works",
    interactiveDemoDesc: "Experiment with our interactive Educa + demo and discover the power of AI planning.",
    planificationTitle: "Smart Pedagogical Planning",
    planificationDesc: "Planning has never been so easy",

    generatorTitle: "Generate Your Lesson Plan",
    generatorSubtitle: "Assistant for Mathematics Teachers",
    newSession: "New Session",
    formInstructions: "Complete the form to generate your classroom guide using Artificial Intelligence.",
    formProgress: "Form Progress",
    docenteLabel: "Teacher's Name",
    docentePlaceholder: "e.g. Prof. Charles Smith",
    fechaLabel: "Date of the Session",
    gradoLabel: "High School Grade",
    seccionLabel: "Section",
    seccionPlaceholder: "e.g. A",
    temaLabel: "Lesson topic",
    temaPlaceholder: "e.g. Quadratic equations in real-world scenarios",
    tituloLabel: "Suggested title for the session",
    tituloPlaceholder: "e.g. Solving problems using scales and equations",
    horasLabel: "Pedagogical hours",
    contextoLabel: "Sociocultural context of the classroom",
    competenciaTransversalLabel: "Cross-cutting Competency",
    enfoqueTransversalLabel: "Cross-cutting Approach",
    materialesLabel: "Materials and resources in the classroom",
    materialesPlaceholder: "e.g. Seashells, local seeds, laptop, charts...",
    evaluacionLabel: "Preferred assessment tool",
    idiomaLabel: "Session Language",
    generateBtn: "Design my Session with AI",
    generatingStep1: "Starting AI connection...",
    generatingStep2: "Searching for context in the National Curriculum...",
    generatingStep3: "Structuring the pedagogical sequence...",
    generatingStep4: "Generating worksheets and classroom resources...",

    resultsTitle: "Your Generated Lesson Plan",
    resultsSaved: "This session is saved in your private repository.",
    resultsAlert: "Congratulations! Your session has been structured according to CNEB standards.",
    editSession: "Edit fields",
    tabGeneral: "Data & Purpose",
    tabSequence: "Methodological Sequence",
    tabResources: "Classroom Resources",
    purpose: "Learning Purpose",
    criterios: "Assessment Criteria",
    evidences: "Learning Evidences",
    secuenciaMetodologica: "Pedagogical Sequence",
    inicio: "Introduction (Motivation & prior knowledge)",
    desarrollo: "Development (Management & coaching)",
    cierre: "Closure (Metacognition & assessment)",
    materialesSugeridos: "Suggested Materials",
    fichasTrabajo: "Progressive Worksheets",
    problemasEjercicios: "Practical Problems & Exercises",
    juegoDidactico: "Suggested Educational Game",
    comunicadoPadres: "WhatsApp Message for Parents",
    actividadesDiferenciadas: "Differentiated Activities",

    dashboardTitle: "My Pedagogical Dashboard",
    dashboardSubtitle: "Here you can view and manage your saved lesson plans.",
    totalSessions: "Saved Lessons",
    openSession: "View Session",
    noSessions: "You do not have any saved sessions yet. Generate a new session to begin!",
    overview: "Overview",
    mySessions: "My Sessions",
    createdSessions: "Created Sessions",
    timeSaved: "Time Saved",
    contexts: "Contexts",
    communityImpact: "Your Community Impact",
    contributions: "Repository Contributions",
    teachersHelped: "Teachers Helped",
    generationActivity: "Generation Activity",
    cyclesActivity: "Active Cycles",
    topCompetencies: "Top Competencies",
    organizeHistory: "Organize History",
    recent: "Recent",
    byBimester: "By Bimester",
    createNewSession: "Create New Session with AI"
  },
  qu: {
    welcome: "Allin hamuy!",
    login: "Yaykuy",
    logout: "Lluqsiy",
    exit: "Lluqsiy",
    dashboard: "Qawana",
    back: "Kutiy",
    save: "Taqipi waqaychay",
    download: "JSON uranchay",
    copy: "Plan kapiy",
    copied: "¡Kapisqaña!",
    loading: "Cargachkan...",
    generate: "IAwan yachachiyta ruray",
    generating: "Rurachkan...",
    home: "Qallariy",
    teacher: "Yachachiq (Amauta)",
    grade: "Ñiqi",
    section: "T'aqa",
    date: "P'unchay",
    theme: "Yachana",
    sessionTitle: "Suti",
    duration: "Pacha",
    competencies: "Atipakuykuna",
    capacities: "Atiykuna",
    context: "Kawsay pacha",
    materials: "Imakuna kapuq",
    evaluation: "Chaninchay",

    heroSubtitle: "Yachana k'itikunata ruray ratulla. CNEBman tupachisqa, allin ñan yachachiywan yachay wasiyki kawsayman allichasqa.",
    startNow: "Kunan qallariy",
    exploreRepo: "Taqita qaway",
    whyChooseTitle: "Yachachiqkunapaq rurasqa",
    whyChooseSubtitle: "Qallariymanta ama ruraychu. Educa + yachachiy planifikacionniykita utqayman purichin, yachachiypi wawakunawan tupanaykipaq.",
    smartGenTitle: "Yachaq Ruraq",
    smartGenDesc: "IA yachachisqa allin yachana ñankunata, chaninchaykunata allin tupachinaykipaq.",
    contextualTitle: "Kawsayman Tupachisqa Ruraykuna",
    contextualDesc: "Yachay wasiyki kawsayta churay wawakunapaq allin yupay sasachakuykuna ruraykunapas chaskinaykipaq.",
    repoTitle: "Tukuy Yachachiqkunapa Taqan",
    repoDesc: "Huk yachachiqkunapa rurasqanman yaykuy. Yachayta hapikuy, kapiy, yachachiy wasiykipaq allichay.",
    whatsAppTitle: "Yachachiyta WhatsAppwan ruray",
    whatsAppDesc: "¿Manachu pacha computerpi tiyanaykipaq kan? Kunanqa IA Asistentewan rimayta atiwaq WhatsAppniykimanta. Tukuy yachachiy ñiqikunata ruray huk willakuyllawan.",
    whatsAppCTA: "Bot Asistentewan rimay",
    interactiveDemo: "Qaway imaynam ruran",
    interactiveDemoDesc: "Educa + IA yachachiyta qaway, imaynam ratulla yachachiyta ruran.",
    planificationTitle: "IAwan Yachachiy Ruray",
    planificationDesc: "Yachachiy planifikacionqa kunanqa ratullam",

    generatorTitle: "Yachana K'itita Ruray",
    generatorSubtitle: "Yachachiqkunapaq yanapaq",
    newSession: "Musuq Yachachiy",
    formInstructions: "Hunt'ay kay formulat IA yachachiyta rurananpaq.",
    formProgress: "Ruray purichiy",
    docenteLabel: "Yachachiqpa sutin",
    docentePlaceholder: "Ej. Amauta Carlos Mendoza",
    fechaLabel: "P'unchay",
    gradoLabel: "Grado (Secundaria)",
    seccionLabel: "T'aqa",
    seccionPlaceholder: "Ej. A",
    temaLabel: "Yachachiy tema",
    temaPlaceholder: "Ej. Yupaykuna kawsayninchikpi",
    tituloLabel: "Yachachiypaq suti",
    tituloPlaceholder: "Ej. Balanzakunawan yupaykunawan problemakunata allichanchik",
    horasLabel: "Pedagogic pachakuna",
    contextoLabel: "Yachay wasi kawsay pacha",
    competenciaTransversalLabel: "Tukuy yachana atipakuy",
    enfoqueTransversalLabel: "Tukuy yachana enfoque",
    materialesLabel: "Yachay wasipi imakuna kapuq",
    materialesPlaceholder: "Ej. Mama qucha conchakuna, mujukuna, laptop...",
    evaluacionLabel: "Chaninchay instrumentu",
    idiomaLabel: "Yachachiy Rimanapaq",
    generateBtn: "IAwan Yachana K'itita Ruray",
    generatingStep1: "IAwan tinkuchkan...",
    generatingStep2: "Currículo Nacionalpi maskachkan...",
    generatingStep3: "Yachachiy sequence allichachkan...",
    generatingStep4: "Fichakunata tukuy ruraykunatapas rurachkan...",

    resultsTitle: "IAwan Rurasqa Yachachiy",
    resultsSaved: "Kay yachachiyqa sapalla taqiykipim waqaychasqa kachkan.",
    resultsAlert: "¡Kusa! Yachachiyqa CNEBpa mañakusqanman hina allin rurasqam kachkan.",
    editSession: "Allichay",
    tabGeneral: "Datos & Propósito",
    tabSequence: "Yachachiy Ñan",
    tabResources: "Imakuna kapuq",
    purpose: "Yachachiypa munaynin",
    criterios: "Chaninchay Criteriokuna",
    evidences: "Yachay Evidenciakuna",
    secuenciaMetodologica: "Yachachiy Secuencia",
    inicio: "Qallariy (Motivación y saberes previos)",
    desarrollo: "Desarrollo (Gestión y acompañamiento)",
    cierre: "Tukuynin (Metacognición y evaluación)",
    materialesSugeridos: "Imakuna kapuq",
    fichasTrabajo: "Progresivo Llamkana Fichakuna",
    problemasEjercicios: "Yani Yupaykuna y Problemakuna",
    juegoDidactico: "Yachachiypaq Pukllay",
    comunicadoPadres: "Tayta mamakunapaq willakuy (WhatsApp)",
    actividadesDiferenciadas: "T'aqasqa Ruraykuna",

    dashboardTitle: "Ñuqaq Yachachiypaq Qawanay",
    dashboardSubtitle: "Kaypi waqaychasqayki yachachiykunata qawayta atiwaq.",
    totalSessions: "Waqaychasqa Yachachiykuna",
    openSession: "Yachachiyta qaway",
    noSessions: "Manaraq waqaychasqa yachachiykunachu kapusunki. ¡Musuq yachachiyta ruray!",
    overview: "Tukuy qaway",
    mySessions: "Yachachiykunay",
    createdSessions: "Rurasqa yachachiykuna",
    timeSaved: "Waqaychasqa pacha",
    contexts: "Kawsay pachakuna",
    communityImpact: "Llaqtaykipaq llamkayniki",
    contributions: "Taqipi yanapakuykuna",
    teachersHelped: "Yanapasqa yachachiqkuna",
    generationActivity: "Yachachiy ruraykuna",
    cyclesActivity: "Lliwmanta astawan rurasqa ñiqikuna",
    topCompetencies: "Lliwmanta astawan llamkasqa atipakuykuna",
    organizeHistory: "Ñiqichay",
    recent: "Kunanlla rurasqa",
    byBimester: "Bimestreman hina",
    createNewSession: "IAwan musuq yachachiyta ruray"
  },
  ay: {
    welcome: "Kamisaki / Suma juturi!",
    login: "Mantiriña",
    logout: "Mistuña",
    exit: "Mistuña",
    dashboard: "Uñch'ukiña",
    back: "Kutiña",
    save: "Imata imaña",
    download: "JSON uranchaña",
    copy: "Plan copiaña",
    copied: "¡Copiadoña!",
    loading: "Lurañam...",
    generate: "IA Yatichawi luraña",
    generating: "Luraskani...",
    home: "Qalltaña",
    teacher: "Yatichiri",
    grade: "Taqi",
    section: "T'aqa",
    date: "Uru",
    theme: "Yatichaña",
    sessionTitle: "Sutipa",
    duration: "Pacha",
    competencies: "Lurañataki",
    capacities: "Atinakunaka",
    context: "Sarnaqawi pacha",
    materials: "Yatichañataki yänaka",
    evaluation: "Uñakipawi",

    heroSubtitle: "Yatichawi planinakap luraña ratuki. CNEB uñtasqa, yatichawi thakhinakap luri yatiqan uta sarnaqawiman uñt'ata.",
    startNow: "Jichhax qalltaña",
    exploreRepo: "Taqita uñjaña",
    whyChooseTitle: "Yatichirinakataki lurasqa",
    whyChooseSubtitle: "Qalltañatakix janiw cusa lurañakiti. Educa + lurañampix jank'akiw planifiqt'ata, wawanakampi yatichañataki.",
    smartGenTitle: "Yatiñ Luriri",
    smartGenDesc: "IA yatichata uñakipañataki, yatichawi ch'amanaka lurañataki.",
    contextualTitle: "Sarnaqawinakataki Lurañanaka",
    contextualDesc: "Yatiqaña uta sarnaqawi churaña wawanakataki yupay lurañanaka ukhamarak pukllay yatichawinaka chaskiñataki.",
    repoTitle: "Taqip Yatichiri Taqinakapa",
    repoDesc: "Yaqha yatichirinakan luratanakapa uñjaña. Inspiriña, copiaña ukhamarak allichaña yatiqirinakataki.",
    whatsAppTitle: "Yatichawinakap WhatsApp-ta luraña",
    whatsAppDesc: "¿Janiw pacha computer utjiti? Jichhax IA Asistentempi rimt'añamaw WhatsApp-taki. Yatichawi thakhinaka ratuki luraña.",
    whatsAppCTA: "Bot-amp rimt'aña",
    interactiveDemo: "Uñjaña imaynas luri",
    interactiveDemoDesc: "Uñancht'awi demo interactiva Educa + IA-mpi luri uk uñjaña.",
    planificationTitle: "IA-mpi Yatichawi Planina",
    planificationDesc: "Yatichawi planina janiw ch'amäkiti jichhaxa",

    generatorTitle: "Yatichawi Luraña",
    generatorSubtitle: "Yatichirinakataki Yanapiri",
    newSession: "Machaq Yatichawi",
    formInstructions: "Kay formularix phuqt'aña IA yatichaw lurañataki.",
    formProgress: "Taqi purichawi",
    docenteLabel: "Yatichiri sutipa",
    docentePlaceholder: "Ej. Yatichiri Carlos Mendoza",
    fechaLabel: "Uru",
    gradoLabel: "Grado (Secundaria)",
    seccionLabel: "T'aqa",
    seccionPlaceholder: "Ej. A",
    temaLabel: "Yatichawi tema",
    temaPlaceholder: "Ej. Yupay yatiñanaka jakawisana",
    tituloLabel: "Yatichawi sutipa",
    tituloPlaceholder: "Ej. Balanzampi yupanakamp problemak ch'amañcht'aña",
    horasLabel: "Pacha yatichawi",
    contextoLabel: "Yatiqañ utap sarnaqawi",
    competenciaTransversalLabel: "Cross-cutting Yatichawi",
    enfoqueTransversalLabel: "Cross-cutting Enfoque",
    materialesLabel: "Yatiqañ utap yänaka",
    materialesPlaceholder: "Ej. Kota conchayaka, jathayaka, laptop...",
    evaluacionLabel: "Uñakipaw yänaka",
    idiomaLabel: "Yatichawi Aru",
    generateBtn: "IA-mpi Yatichawi Luraña",
    generatingStep1: "IA-mpi tinkuskaspam...",
    generatingStep2: "Currículo Nacionalpi maskaskani...",
    generatingStep3: "Yatichawi sequence allichaskani...",
    generatingStep4: "Fichanaka pukllay yatichawinakamp luraspa...",

    resultsTitle: "IA Lurata Yatichawi",
    resultsSaved: "Yatichawix sapakut imatäniw waqaychata.",
    resultsAlert: "¡Wali kusa! Yatichawix CNEB uñakipawimarjam luratawa.",
    editSession: "Yatichaw allichaña",
    tabGeneral: "Data & Propósito",
    tabSequence: "Yatichawi Thakhinakapa",
    tabResources: "Yänaka Yatichawitaki",
    purpose: "Yatichawip amuyupa",
    criterios: "Uñakipawi Criterioyaka",
    evidences: "Yatiqawi Evidenciayaka",
    secuenciaMetodologica: "Yatichawi Sequence",
    inicio: "Qalltaña (Motivación y saberes previos)",
    desarrollo: "Desarrollo (Gestión y acompañamiento)",
    cierre: "Tukuyaña (Metacognición y evaluación)",
    materialesSugeridos: "Yänaka sugiriña",
    fichasTrabajo: "Llamkana Fichanaka Wali",
    problemasEjercicios: "Yepanaka y Problemak Practico",
    juegoDidactico: "Yatichaw pukllay luraña",
    comunicadoPadres: "Tayka awkinakataki willakuy (WhatsApp)",
    actividadesDiferenciadas: "Yatiqaw lurañanak ch'axwata",

    dashboardTitle: "Yatichirin Yatichañapataki Dashboard",
    dashboardSubtitle: "Kaypi waqaychata yatichawinakam uñjaña.",
    totalSessions: "Imat yatichawinaka",
    openSession: "Yatichawi uñjaña",
    noSessions: "Janiw yatichaw waqaychata utjkiti. Machaq yatichaw lurañampi qallt'aña!",
    overview: "Taqpacha uñjaña",
    mySessions: "Yatichawinaka",
    createdSessions: "Lurata yatichawinaka",
    timeSaved: "Imata pacha",
    contexts: "Kawsay pachanaka",
    communityImpact: "Jumanki ch'amanchawi",
    contributions: "Taqipi yanapirinaka",
    teachersHelped: "Yanapata yatichirinaka",
    generationActivity: "Yatichawi lurañanaka",
    cyclesActivity: "Yatichaw thakhinaka wali",
    topCompetencies: "Lurañataki yatichaw wali",
    organizeHistory: "Thakhinchawi",
    recent: "Jichhaki lurata",
    byBimester: "Bimestre-ru uñtasqa",
    createNewSession: "IA-mpi machaq yatichawi luraña"
  }
};
