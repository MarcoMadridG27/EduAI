"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain, User, BarChart3, Loader2, Sparkles, Target, Clock, Package,
  Award, CheckCircle2, X, Calculator, LineChart, Ruler, BarChart,
  ChevronDown, ChevronUp, Info, FileText, BookOpen, GraduationCap
} from "lucide-react"
import type { SessionData } from "@/app/page"
import { useLanguage } from "@/lib/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"
import { toast } from "sonner"

interface SessionGeneratorProps {
  readonly user?: { readonly name: string; readonly email: string } | null
  readonly onSessionGenerated: (session: SessionData) => void
  readonly onViewDashboard: () => void
  readonly onLogout: () => void
  readonly editingSession?: SessionData | null
  readonly guestMode?: boolean
  readonly onLoginRequired?: () => void
}

const nivelesEducativos = [
  { id: "inicial", name: "Educación Inicial" },
  { id: "primaria", name: "Educación Primaria" },
  { id: "secundaria", name: "Educación Secundaria" }
]

const gradosPorNivel: Record<string, { id: string; label: string; ciclo: string }[]> = {
  inicial: [
    { id: "3", label: "3 años", ciclo: "II" },
    { id: "4", label: "4 años", ciclo: "II" },
    { id: "5", label: "5 años", ciclo: "II" }
  ],
  primaria: [
    { id: "1", label: "1º Primaria", ciclo: "III" },
    { id: "2", label: "2º Primaria", ciclo: "III" },
    { id: "3", label: "3º Primaria", ciclo: "IV" },
    { id: "4", label: "4º Primaria", ciclo: "IV" },
    { id: "5", label: "5º Primaria", ciclo: "V" },
    { id: "6", label: "6º Primaria", ciclo: "V" }
  ],
  secundaria: [
    { id: "1", label: "1º Secundaria", ciclo: "VI" },
    { id: "2", label: "2º Secundaria", ciclo: "VI" },
    { id: "3", label: "3º Secundaria", ciclo: "VII" },
    { id: "4", label: "4º Secundaria", ciclo: "VII" },
    { id: "5", label: "5º Secundaria", ciclo: "VII" }
  ]
}

export interface CompetenciaCneb {
  name: string
  capacidades: string[]
}

export const cnebEstructura: Record<string, Record<string, CompetenciaCneb[]>> = {
  inicial: {
    "Personal Social": [
      {
        name: "Construye su identidad",
        capacidades: [
          "Se valora a sí mismo",
          "Autorregula sus emociones"
        ]
      },
      {
        name: "Convive y participa democráticamente en la búsqueda del bien común",
        capacidades: [
          "Interactúa con todas las personas",
          "Construye normas, y asume acuerdos y leyes",
          "Participa en acciones que promueven el bienestar común"
        ]
      },
      {
        name: "Construye su identidad, como persona humana, amada por Dios, digna, libre y trascendente",
        capacidades: [
          "Conoce a Dios y asume su identidad religiosa y espiritual",
          "Cultiva y valora las manifestaciones religiosas de su entorno"
        ]
      }
    ],
    "Psicomotricidad": [
      {
        name: "Se desenvuelve de manera autónoma a través de su motricidad",
        capacidades: [
          "Comprende su cuerpo",
          "Se expresa corporalmente"
        ]
      }
    ],
    "Comunicación": [
      {
        name: "Se comunica oralmente en su lengua materna",
        capacidades: [
          "Obtiene información del texto oral",
          "Infiere e interpreta información del texto oral",
          "Adecúa, organiza y desarrolla el texto de forma coherente y cohesionada",
          "Utiliza recursos no verbales y paraverbales de forma estratégica",
          "Interactúa estratégicamente con distintos interlocutores",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto oral"
        ]
      },
      {
        name: "Lee diversos tipos de textos escritos en su lengua materna",
        capacidades: [
          "Obtiene información del texto escrito",
          "Infiere e interpreta información del texto",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto"
        ]
      },
      {
        name: "Crea proyectos desde los lenguajes artísticos",
        capacidades: [
          "Explora y experimenta los lenguajes del arte",
          "Aplica procesos creativos",
          "Socializa sus procesos y proyectos"
        ]
      }
    ],
    "Descubrimiento del Mundo": [
      {
        name: "Indaga mediante métodos científicos para construir sus conocimientos",
        capacidades: [
          "Problematiza situaciones para hacer indagación",
          "Diseña estrategias para hacer indagación",
          "Genera y registra datos o información",
          "Analiza datos e información",
          "Evalúa y comunica el proceso y resultado de su indagación"
        ]
      }
    ],
    "Matemática": [
      {
        name: "Resuelve problemas de cantidad",
        capacidades: [
          "Traduce cantidades a expresiones numéricas",
          "Comunica su comprensión sobre los números y las operaciones",
          "Usa estrategias y procedimientos de estimación y cálculo"
        ]
      },
      {
        name: "Resuelve problemas de forma, movimiento y localización",
        capacidades: [
          "Modela objetos con formas geométricas y sus transformaciones",
          "Comunica su comprensión sobre las formas y relaciones geométricas",
          "Usa estrategias y procedimientos para orientarse en el espacio"
        ]
      }
    ],
    "Ciencia y Tecnología": [
      {
        name: "Indaga mediante métodos científicos para construir sus conocimientos",
        capacidades: [
          "Problematiza situaciones para hacer indagación",
          "Diseña estrategias para hacer indagación",
          "Genera y registra datos o información",
          "Analiza datos e información",
          "Evalúa y comunica el proceso y resultado de su indagación"
        ]
      }
    ]
  },
  primaria: {
    "Personal Social": [
      {
        name: "Construye su identidad",
        capacidades: [
          "Se valora a sí mismo",
          "Autorregula sus emociones",
          "Reflexiona y argumenta éticamente",
          "Vive su sexualidad de manera integral y responsable"
        ]
      },
      {
        name: "Convive y participa democráticamente en la búsqueda del bien común",
        capacidades: [
          "Interactúa con todas las personas",
          "Construye normas y asume acuerdos y leyes",
          "Maneja conflictos de manera constructiva",
          "Delibera sobre asuntos públicos",
          "Participa en acciones que promueven el bienestar común"
        ]
      },
      {
        name: "Construye interpretaciones históricas",
        capacidades: [
          "Interpreta críticamente fuentes diversas",
          "Comprende el tiempo histórico",
          "Elabora explicaciones sobre procesos históricos"
        ]
      },
      {
        name: "Gestiona responsablemente el espacio y el ambiente",
        capacidades: [
          "Comprende las relaciones entre los elementos naturales y sociales",
          "Maneja fuentes de información para comprender el espacio geográfico y el ambiente",
          "Genera acciones para conservar el ambiente local y global"
        ]
      },
      {
        name: "Gestiona responsablemente los recursos económicos",
        capacidades: [
          "Comprende las relaciones entre los elementos del sistema económico y financiero",
          "Toma decisiones económicas y financieras"
        ]
      }
    ],
    "Educación Física": [
      {
        name: "Se desenvuelve de manera autónoma a través de su motricidad",
        capacidades: [
          "Comprende su cuerpo",
          "Se expresa corporalmente"
        ]
      },
      {
        name: "Asume una vida saludable",
        capacidades: [
          "Comprende las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y la salud",
          "Incorpora prácticas que mejoran su calidad de vida"
        ]
      },
      {
        name: "Interactúa a través de sus habilidades sociomotrices",
        capacidades: [
          "Se relaciona utilizando sus habilidades sociomotrices",
          "Crea y aplica estrategias y tácticas de juego"
        ]
      }
    ],
    "Arte y Cultura": [
      {
        name: "Aprecia de manera crítica manifestaciones artístico-culturales",
        capacidades: [
          "Percibe manifestaciones artístico-culturales",
          "Contextualiza manifestaciones artístico-culturales",
          "Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales"
        ]
      },
      {
        name: "Crea proyectos desde los lenguajes artísticos",
        capacidades: [
          "Explora y experimenta los lenguajes artísticos",
          "Aplica procesos creativos",
          "Evalúa y comunica sus procesos y proyectos"
        ]
      }
    ],
    "Comunicación": [
      {
        name: "Se comunica oralmente en su lengua materna",
        capacidades: [
          "Obtiene información del texto oral",
          "Infiere e interpreta información del texto oral",
          "Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada",
          "Utiliza recursos no verbales y paraverbales de forma estratégica",
          "Interactúa estratégicamente con distintos interlocutores",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto oral"
        ]
      },
      {
        name: "Lee diversos tipos de textos escritos en su lengua materna",
        capacidades: [
          "Obtiene información del texto escrito",
          "Infiere e interpreta información del texto",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto"
        ]
      },
      {
        name: "Escribe diversos tipos de textos en su lengua materna",
        capacidades: [
          "Adecúa el texto a la situación comunicativa",
          "Organiza y desarrolla las ideas de forma coherente y cohesionada",
          "Utiliza convenciones del lenguaje escrito de forma pertinente",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito"
        ]
      }
    ],
    "Matemática": [
      {
        name: "Resuelve problemas de cantidad",
        capacidades: [
          "Traduce cantidades a expresiones numéricas",
          "Comunica su comprensión sobre los números y las operaciones",
          "Usa estrategias y procedimientos de estimación y cálculo",
          "Argumenta afirmaciones sobre las relaciones numéricas y las operaciones"
        ]
      },
      {
        name: "Resuelve problemas de regularidad, equivalencia y cambio",
        capacidades: [
          "Traduce datos y condiciones a expresiones algebraicas y gráficas",
          "Comunica su comprensión sobre las relaciones algebraicas",
          "Usa estrategias y procedimientos para encontrar equivalencias y reglas generales",
          "Argumenta afirmaciones sobre relaciones de cambio y equivalencia"
        ]
      },
      {
        name: "Resuelve problemas de forma, movimiento y localización",
        capacidades: [
          "Modela objetos con formas geométricas y sus transformaciones",
          "Comunica su comprensión sobre las formas y relaciones geométricas",
          "Usa estrategias y procedimientos para orientarse en el espacio",
          "Argumenta afirmaciones sobre relaciones geométricas"
        ]
      },
      {
        name: "Resuelve problemas de gestión de datos e incertidumbre",
        capacidades: [
          "Representa datos con gráficos y medidas estadísticas o probabilísticas",
          "Comunica su comprensión de los conceptos estadísticos y probabilísticos",
          "Usa estrategias y procedimientos para recopilar y procesar datos",
          "Sustenta conclusiones o decisiones con base en la información obtenida"
        ]
      }
    ],
    "Ciencia y Tecnología": [
      {
        name: "Indaga mediante métodos científicos para construir sus conocimientos",
        capacidades: [
          "Problematiza situaciones para hacer indagación",
          "Diseña estrategias para hacer indagación",
          "Genera y registra datos e información",
          "Analiza datos e información",
          "Evalúa y comunica el proceso y resultados de su indagación"
        ]
      },
      {
        name: "Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo",
        capacidades: [
          "Comprende y usa conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo",
          "Evalúa las implicancias del saber y del quehacer científico y tecnológico"
        ]
      },
      {
        name: "Diseña y construye soluciones tecnológicas para resolver problemas de su entorno",
        capacidades: [
          "Determina una alternativa de solución tecnológica",
          "Diseña la alternativa de solución tecnológica",
          "Implementa y valida la alternativa de solución tecnológica",
          "Evalúa y comunica el funcionamiento y los impactos de su alternativa de solución tecnológica"
        ]
      }
    ],
    "Educación Religiosa": [
      {
        name: "Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente",
        capacidades: [
          "Conoce a Dios y asume su identidad religiosa y espiritual como persona digna, libre y trascendente",
          "Cultiva y valora las manifestaciones religiosas de su entorno argumentando su fe de manera comprensible y respetuosa"
        ]
      },
      {
        name: "Asume la experiencia del encuentro personal y comunitario con Dios en su proyecto de vida",
        capacidades: [
          "Transforma su entorno desde el encuentro personal y comunitario con Dios y desde la fe que profesa",
          "Actúa coherentemente en razón de su fe según los principios de su conciencia moral en situaciones concretas de la vida"
        ]
      }
    ]
  },
  secundaria: {
    "Desarrollo Personal, Ciudadanía y Cívica": [
      {
        name: "Construye su identidad",
        capacidades: [
          "Se valora a sí mismo",
          "Autorregula sus emociones",
          "Reflexiona y argumenta éticamente",
          "Vive su sexualidad de manera integral y responsable de acuerdo a su etapa de desarrollo y madurez"
        ]
      },
      {
        name: "Convive y participa democráticamente en la búsqueda del bien común",
        capacidades: [
          "Interactúa con todas las personas",
          "Construye normas y asume acuerdos y leyes",
          "Maneja conflictos de manera constructiva",
          "Delibera sobre asuntos públicos",
          "Participa en acciones que promueven el bienestar común"
        ]
      }
    ],
    "Ciencias Sociales": [
      {
        name: "Construye interpretaciones históricas",
        capacidades: [
          "Interpreta críticamente fuentes diversas",
          "Comprende el tiempo histórico",
          "Elabora explicaciones sobre procesos históricos"
        ]
      },
      {
        name: "Gestiona responsablemente el espacio y el ambiente",
        capacidades: [
          "Comprende las relaciones entre los elementos naturales y sociales",
          "Maneja fuentes de información para comprender el espacio geográfico y el ambiente",
          "Genera acciones para conservar el ambiente local y global"
        ]
      },
      {
        name: "Gestiona responsablemente los recursos económicos",
        capacidades: [
          "Comprende las relaciones entre los elementos del sistema económico y financiero",
          "Toma decisiones económicas y financieras"
        ]
      }
    ],
    "Educación Física": [
      {
        name: "Se desenvuelve de manera autónoma a través de su motricidad",
        capacidades: [
          "Comprende su cuerpo",
          "Se expresa corporalmente"
        ]
      },
      {
        name: "Asume una vida saludable",
        capacidades: [
          "Comprende las relaciones entre la actividad física, alimentación, postura e higiene personal y del ambiente, y la salud",
          "Incorpora prácticas que mejoran su calidad de vida"
        ]
      },
      {
        name: "Interactúa a través de sus habilidades sociomotrices",
        capacidades: [
          "Se relaciona utilizando sus habilidades sociomotrices",
          "Crea y aplica estrategias y tácticas de juego"
        ]
      }
    ],
    "Arte y Cultura": [
      {
        name: "Aprecia de manera crítica manifestaciones artístico-culturales",
        capacidades: [
          "Percibe manifestaciones artístico-culturales",
          "Contextualiza manifestaciones artístico-culturales",
          "Reflexiona creativa y críticamente sobre manifestaciones artístico-culturales"
        ]
      },
      {
        name: "Crea proyectos desde los lenguajes artísticos",
        capacidades: [
          "Explora y experimenta los lenguajes artísticos",
          "Aplica procesos creativos",
          "Evalúa y comunica sus procesos y proyectos"
        ]
      }
    ],
    "Comunicación": [
      {
        name: "Se comunica oralmente en su lengua materna",
        capacidades: [
          "Obtiene información del texto oral",
          "Infiere e interpreta información del texto oral",
          "Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada",
          "Utiliza recursos no verbales y paraverbales de forma estratégica",
          "Interactúa estratégicamente con distintos interlocutores",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto oral"
        ]
      },
      {
        name: "Lee diversos tipos de textos escritos en su lengua materna",
        capacidades: [
          "Obtiene información del texto escrito",
          "Infiere e interpreta información del texto",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto"
        ]
      },
      {
        name: "Escribe diversos tipos de textos en su lengua materna",
        capacidades: [
          "Adecúa el texto a la situación comunicativa",
          "Organiza y desarrolla las ideas de forma coherente y cohesionada",
          "Utiliza convenciones del lenguaje escrito de forma pertinente",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito"
        ]
      }
    ],
    "Inglés como Lengua Extranjera": [
      {
        name: "Se comunica oralmente en inglés como lengua extranjera",
        capacidades: [
          "Obtiene información del texto oral",
          "Infiere e interpreta información del texto oral",
          "Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada",
          "Utiliza recursos no verbales y paraverbales de forma estratégica",
          "Interactúa estratégicamente con distintos interlocutores",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto oral"
        ]
      },
      {
        name: "Lee diversos tipos de textos en inglés como lengua extranjera",
        capacidades: [
          "Obtiene información del texto escrito",
          "Infiere e interpreta información del texto",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto"
        ]
      },
      {
        name: "Escribe diversos tipos de textos en inglés como lengua extranjera",
        capacidades: [
          "Adecúa el texto a la situación comunicativa",
          "Organiza y desarrolla las ideas de forma coherente y cohesionada",
          "Utiliza convenciones del lenguaje escrito de forma pertinente",
          "Reflexiona y evalúa la forma, el contenido y contexto del texto escrito"
        ]
      }
    ],
    "Matemática": [
      {
        name: "Resuelve problemas de cantidad",
        capacidades: [
          "Traduce cantidades a expresiones numéricas",
          "Comunica su comprensión sobre los números y las operaciones",
          "Usa estrategias y procedimientos de estimación y cálculo",
          "Argumenta afirmaciones sobre las relaciones numéricas y las operaciones"
        ]
      },
      {
        name: "Resuelve problemas de regularidad, equivalencia y cambio",
        capacidades: [
          "Traduce datos y condiciones a expresiones algebraicas y gráficas",
          "Comunica su comprensión sobre las relaciones algebraicas",
          "Usa estrategias y procedimientos para encontrar equivalencias y reglas generales",
          "Argumenta afirmaciones sobre relaciones de cambio y equivalencia"
        ]
      },
      {
        name: "Resuelve problemas de forma, movimiento y localización",
        capacidades: [
          "Modela objetos con formas geométricas y sus transformaciones",
          "Comunica su comprensión sobre las formas y relaciones geométricas",
          "Usa estrategias y procedimientos para orientarse en el espacio",
          "Argumenta afirmaciones sobre relaciones geométricas"
        ]
      },
      {
        name: "Resuelve problemas de gestión de datos e incertidumbre",
        capacidades: [
          "Representa datos con gráficos y medidas estadísticas o probabilísticas",
          "Comunica su comprensión de los conceptos estadísticos y probabilísticos",
          "Usa estrategias y procedimientos para recopilar y procesar datos",
          "Sustenta conclusiones o decisiones con base en la información obtenida"
        ]
      }
    ],
    "Ciencia y Tecnología": [
      {
        name: "Indaga mediante métodos científicos para construir sus conocimientos",
        capacidades: [
          "Problematiza situaciones para hacer indagación",
          "Diseña estrategias para hacer indagación",
          "Genera y registra datos e información",
          "Analiza datos e información",
          "Evalúa y comunica el proceso y resultados de su indagación"
        ]
      },
      {
        name: "Explica el mundo físico basándose en conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo",
        capacidades: [
          "Comprende y usa conocimientos sobre los seres vivos, materia y energía, biodiversidad, Tierra y universo",
          "Evalúa las implicancias del saber y del quehacer científico y tecnológico"
        ]
      },
      {
        name: "Diseña y construye soluciones tecnológicas para resolver problemas de su entorno",
        capacidades: [
          "Determina una alternativa de solución tecnológica",
          "Diseña la alternativa de solución tecnológica",
          "Implementa y valida la alternativa de solución tecnológica",
          "Evalúa y comunica el funcionamiento y los impactos de su alternativa de solución tecnológica"
        ]
      }
    ],
    "Educación para el Trabajo": [
      {
        name: "Gestiona proyectos de emprendimiento económico o social",
        capacidades: [
          "Crea propuestas de valor",
          "Aplica habilidades técnicas",
          "Trabaja cooperativamente para lograr objetivos y metas",
          "Evalúa los resultados del proyecto de emprendimiento"
        ]
      }
    ],
    "Educación Religiosa": [
      {
        name: "Construye su identidad como persona humana, amada por Dios, digna, libre y trascendente",
        capacidades: [
          "Conoce a Dios y asume su identidad religiosa y espiritual como persona digna, libre y trascendente",
          "Cultiva y valora las manifestaciones religiosas de su entorno argumentando su fe de manera comprensible y respetuosa"
        ]
      },
      {
        name: "Asume la experiencia del encuentro personal y comunitario con Dios en su proyecto de vida",
        capacidades: [
          "Transforma su entorno desde el encuentro personal y comunitario con Dios y desde la fe que profesa",
          "Actúa coherentemente en razón de su fe según los principios de su conciencia moral en situaciones concretas de la vida"
        ]
      }
    ]
  }
}

const capacidadesPorCompetencia: Record<string, string[]> = {
  "Resuelve problemas de cantidad": [
    "Traduce cantidades a expresiones numéricas",
    "Comunica su comprensión sobre los números y las operaciones",
    "Usa estrategias y procedimientos de estimación y cálculo",
    "Argumenta afirmaciones sobre las relaciones numéricas y las operaciones"
  ],
  "Resuelve problemas de regularidad, equivalencia y cambio": [
    "Traduce datos y condiciones a expresiones algebraicas y gráficas",
    "Comunica su comprensión sobre las relaciones algebraicas",
    "Usa estrategias y procedimientos para encontrar equivalencias y reglas generales",
    "Argumenta afirmaciones sobre relaciones de cambio y equivalencia"
  ],
  "Resuelve problemas de forma, movimiento y localización": [
    "Modela objetos con formas geométricas y sus transformaciones",
    "Comunica su comprensión sobre las formas y relaciones geométricas",
    "Usa estrategias y procedimientos para orientarse en el espacio",
    "Argumenta afirmaciones sobre relaciones geométricas"
  ],
  "Resuelve problemas de gestión de datos e incertidumbre": [
    "Representa datos con gráficos y medidas estadísticas o probabilísticas",
    "Comunica su comprensión de los conceptos estadísticos y probabilísticos",
    "Usa estrategias y procedimientos para recopilar y procesar datos",
    "Sustenta conclusiones o decisiones con base en la información obtenida"
  ]
}

const competenciasTransversales = [
  "Se desenvuelve en entornos virtuales generados por las TIC",
  "Gestiona su aprendizaje de manera autónoma"
]

const enfoquesTransversales = [
  "Enfoque de Derechos",
  "Enfoque Inclusivo o de Atención a la Diversidad",
  "Enfoque Intercultural",
  "Enfoque de Igualdad de Género",
  "Enfoque Ambiental",
  "Enfoque de Búsqueda de la Excelencia",
  "Enfoque de Orientación al Bien Común"
]

const enfoquesDescripciones: Record<string, string> = {
  "Enfoque de Derechos": "Fomenta el reconocimiento de los derechos y deberes, promoviendo la participación democrática.",
  "Enfoque Inclusivo o de Atención a la Diversidad": "Busca que todos los estudiantes tengan las mismas oportunidades de aprendizaje.",
  "Enfoque Intercultural": "Promueve el intercambio y enriquecimiento mutuo entre distintas culturas.",
  "Enfoque de Igualdad de Género": "Reconoce que hombres y mujeres tienen los mismos derechos y oportunidades.",
  "Enfoque Ambiental": "Orienta hacia la formación de una conciencia crítica sobre el cuidado del medio ambiente.",
  "Enfoque de Búsqueda de la Excelencia": "Incentiva el desarrollo del máximo potencial para el éxito personal y social.",
  "Enfoque de Orientación al Bien Común": "Promueve valores, virtudes cívicas y sentido de justicia para la construcción de una sociedad equitativa."
}

const contextosLocales = [
  "Urbano (ciudad / zona metropolitana)",
  "Urbano-marginal (periferia de ciudad)",
  "Rural (zona campo, sierra, selva)",
  "Costero / litoral",
  "Comunidad indígena o bilingüe"
]

const instrumentosEvaluacion = [
  "Que la IA lo decida automáticamente",
  "Lista de cotejo",
  "Rúbrica",
  "Escala de valoración",
  "Ficha de observación"
]

const materialesPorContexto: Record<string, string[]> = {
  "Urbano": ["Pizarra acrílica", "Plumones", "Proyector", "Laptop", "Calculadoras", "Reglas", "Compás"],
  "Urbano-marginal": ["Pizarra", "Plumones", "Papelotes", "Material reciclado", "Reglas"],
  "Rural": ["Pizarra", "Tizas", "Borrador", "Papel bond", "Lápices", "Material del entorno (piedras, semillas)"],
  "Costero": ["Pizarra", "Plumones", "Conchas marinas", "Redes", "Cuerdas", "Material del entorno"],
  "Comunidad": ["Pizarra", "Tizas", "Materiales de la comunidad", "Elementos naturales", "Telares"]
}

interface WebSocketMessageConfig {
  socket: WebSocket
  intervalId: ReturnType<typeof setInterval>
  sId: string
  tracker: { current: number }
  formData: Partial<SessionData>
  setCurrentStep: (step: string) => void
  setProgress: (progress: number) => void
  setIsGenerating: (isGenerating: boolean) => void
  onSessionGenerated: (session: SessionData) => void
}

function handleWebSocketMessage(event: MessageEvent, config: WebSocketMessageConfig) {
  try {
    const data = JSON.parse(event.data)

    if (data.status === 'progress') {
      if (data.step) config.setCurrentStep(data.step)
      if (data.progress) {
        config.setProgress(data.progress)
        config.tracker.current = data.progress
      } else {
        config.tracker.current = Math.min(config.tracker.current + 15, 90)
        config.setProgress(config.tracker.current)
      }
    } else if (data.status === 'completed') {
      clearInterval(config.intervalId)
      config.setProgress(100)
      config.setCurrentStep("¡Sesión generada exitosamente!")

      if (!data.data || typeof data.data !== 'object') {
        throw new Error("La sesión generada no tiene el formato correcto")
      }

      setTimeout(() => {
        const sessionData = {
          ...config.formData,
          ...data.data,
          session_id: config.sId,
        }
        config.onSessionGenerated(sessionData)
        config.socket.close()
      }, 1000)
    } else if (data.status === 'error') {
      clearInterval(config.intervalId)
      config.setIsGenerating(false)
      alert("Error de IA: " + (data.message || "desconocido"))
      config.socket.close()
    }
  } catch (e) {
    clearInterval(config.intervalId)
    config.setIsGenerating(false)
    console.error("Error parsing websocket message data:", e)
    alert("Error al procesar la respuesta del servidor")
    config.socket.close()
  }
}

function getContextoBase(ctx: string) {
  if (!ctx) return ""
  if (ctx.includes("Urbano (")) return "Urbano"
  if (ctx.includes("Urbano-marginal")) return "Urbano-marginal"
  if (ctx.includes("Rural")) return "Rural"
  if (ctx.includes("Costero")) return "Costero"
  if (ctx.includes("Comunidad")) return "Comunidad"
  return ""
}

function calculateFormProgress(
  nombreDocente: string,
  grado: string,
  hasCompetencias: boolean,
  tema: string,
  tituloSesion: string,
  contexto: string
) {
  let fields = 0
  const totalFields = 6
  if (nombreDocente) fields++
  if (grado) fields++
  if (hasCompetencias) fields++
  if (tema) fields++
  if (tituloSesion) fields++
  if (contexto) fields++
  return (fields / totalFields) * 100
}

interface RunWebSocketGenerationParams {
  nivel: string
  area: string
  tema: string
  tituloSesion: string
  nombreDocente: string
  fecha: string
  grado: string
  seccion: string
  competenciasSeleccionadas: string[]
  capacidadesSeleccionadas: string[]
  enfoqueTransversal: string
  competenciaTransversal: string
  ciclo: string
  contexto: string
  horasClase: number
  materialesSeleccionados: string[]
  materialesNoEstructurados: string
  instrumentoEvaluacion: string
  user: any
  setCurrentStep: (step: string) => void
  setProgress: (progress: number) => void
  setIsGenerating: (isGenerating: boolean) => void
  onSessionGenerated: (session: SessionData) => void
  formData: Partial<SessionData>
  idioma: string
  loadingMessages?: string[]
}

function runWebSocketSessionGeneration(params: RunWebSocketGenerationParams) {
  const materialesCombinados = [
    ...params.materialesSeleccionados,
    ...(params.materialesNoEstructurados ? [params.materialesNoEstructurados] : [])
  ].join(", ")

  const evalInst = params.instrumentoEvaluacion === instrumentosEvaluacion[0] ? "A decisión de la IA" : params.instrumentoEvaluacion

  const message = `Idioma: ${params.idioma}
Nivel: ${params.nivel}
Área Curricular: ${params.area}
Tema de la Sesión: ${params.tema}
Título: ${params.tituloSesion}
Docente: ${params.nombreDocente}
Fecha: ${params.fecha}
Grado: ${params.grado}
Sección: ${params.seccion}
Competencias: ${params.competenciasSeleccionadas.join(", ")}
Capacidades: ${params.capacidadesSeleccionadas.join(", ")}
Enfoque Transversal: ${params.enfoqueTransversal}
Competencia Transversal: ${params.competenciaTransversal}
Ciclo: ${params.ciclo}
Contexto Social: ${params.contexto}
Duración: ${params.horasClase} horas (${params.horasClase * 45} minutos)
Materiales: ${materialesCombinados}
Instrumento de Evaluación Sugerido: ${evalInst}

Nota: La IA debe generar automáticamente:
- Propósito de la Sesión
- Criterios de Evaluación
- Evidencias de Aprendizaje
- Desarrollo de la sesión (Inicio, Desarrollo, Cierre)
- Recursos y materiales estructurados`

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || ""
  let wsUrl = webhookUrl
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://")

  if (wsUrl.includes("/webhook")) {
    wsUrl = wsUrl.replace("/webhook", "/ws/generate")
  } else {
    wsUrl = wsUrl.replace(/\/$/, "") + "/ws/generate"
  }

  const ws = new WebSocket(wsUrl)
  let currentProgress = 0

  const loadingMessages = params.loadingMessages || [
    "Analizando el currículo nacional...",
    "Diseñando la secuencia didáctica...",
    "Preparando las evidencias y criterios...",
    "Ajustando al contexto social...",
    "Casi listo..."
  ]

  let messageIndex = 0
  const messageInterval = setInterval(() => {
    if (currentProgress < 90) {
      params.setCurrentStep(loadingMessages[messageIndex % loadingMessages.length])
      messageIndex++
    }
  }, 3000)

  ws.onopen = () => {
    ws.send(JSON.stringify({
      session_id: sessionId,
      message: message
    }))
  }

  ws.onmessage = (event) => {
    const tracker = { current: currentProgress }
    handleWebSocketMessage(event, {
      socket: ws,
      intervalId: messageInterval,
      sId: sessionId,
      tracker,
      formData: params.formData,
      setCurrentStep: params.setCurrentStep,
      setProgress: params.setProgress,
      setIsGenerating: params.setIsGenerating,
      onSessionGenerated: params.onSessionGenerated,
    })
    currentProgress = tracker.current
  }

  ws.onerror = (error) => {
    clearInterval(messageInterval)
    params.setIsGenerating(false)
    params.setProgress(0)
    params.setCurrentStep("")
    alert("Error de conexión al generar la sesión. Asegúrate de que el backend esté en ejecución.")
    ws.close()
  }
}

function useSessionGeneratorState({ user, onSessionGenerated, editingSession, guestMode = false, onLoginRequired }: SessionGeneratorProps) {
  const { t, language } = useLanguage()
  const [nombreDocente, setNombreDocente] = useState("")
  const [idiomaGeneracion, setIdiomaGeneracion] = useState("español")

  useEffect(() => {
    const languageNames: Record<string, string> = {
      es: "español",
      en: "inglés",
      qu: "quechua",
      ay: "aymara"
    }
    setIdiomaGeneracion(languageNames[language] || "español")
  }, [language])

  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [nivel, setNivel] = useState("")
  const [area, setArea] = useState("")
  const [grado, setGrado] = useState("")
  const [seccion, setSeccion] = useState("")

  // Resetear grado, area, competencias y capacidades al cambiar de nivel
  const handleNivelChange = (nuevoNivel: string) => {
    setNivel(nuevoNivel)
    setGrado("")
    setArea("")
    setCompetenciasSeleccionadas([])
    setCapacidadesSeleccionadas([])
    setCompetenciaExpandida(null)
  }

  // Resetear competencias y capacidades al cambiar de área
  const handleAreaChange = (nuevaArea: string) => {
    setArea(nuevaArea)
    setCompetenciasSeleccionadas([])
    setCapacidadesSeleccionadas([])
    setCompetenciaExpandida(null)
  }

  const ciclo = useMemo(() => {
    const listaGrados = gradosPorNivel[nivel] || []
    const gradoObj = listaGrados.find(g => g.id === grado)
    return gradoObj ? gradoObj.ciclo : ""
  }, [nivel, grado])

  const [competenciasSeleccionadas, setCompetenciasSeleccionadas] = useState<string[]>([])
  const [capacidadesSeleccionadas, setCapacidadesSeleccionadas] = useState<string[]>([])
  const [competenciaExpandida, setCompetenciaExpandida] = useState<string | null>(null)

  const [tema, setTema] = useState("")
  const [tituloSesion, setTituloSesion] = useState("")

  const [enfoqueTransversal, setEnfoqueTransversal] = useState("")
  const [competenciaTransversal, setCompetenciaTransversal] = useState("")

  const [contexto, setContexto] = useState("")
  const [horasClase, setHorasClase] = useState<number>(1)

  const [materialesSeleccionados, setMaterialesSeleccionados] = useState<string[]>([])
  const [materialesNoEstructurados, setMaterialesNoEstructurados] = useState("")

  const [instrumentoEvaluacion, setInstrumentoEvaluacion] = useState(instrumentosEvaluacion[0])

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [showErrors, setShowErrors] = useState(false)

  // ESTADOS DEL COPILOTO CURRICULAR
  const [copilotData, setCopilotData] = useState<CopilotResponse | null>(null)
  const [isAnalyzingCopilot, setIsAnalyzingCopilot] = useState(false)

  const analizarTemaCopiloto = async (temaInput: string) => {
    if (!temaInput || temaInput.trim().length < 3) {
      setCopilotData(null)
      return
    }
    setIsAnalyzingCopilot(true)
    try {
      const endpoint = "https://api.sesionmas.online/recommend-curriculum"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nivel,
          grado,
          area_seleccionada: area,
          competencias_seleccionadas: competenciasSeleccionadas,
          tema: temaInput
        })
      })
      if (res.ok) {
        const data: CopilotResponse = await res.json()
        setCopilotData(data)
      } else {
        console.error("Error backend status:", res.status)
        setCopilotData(null)
      }
    } catch (e) {
      console.error("Error conectando a backend RAG:", e)
      setCopilotData(null)
    } finally {
      setIsAnalyzingCopilot(false)
    }
  }

  const aplicarSugerenciaCopiloto = (sug: SugerenciaCopiloto) => {
    setArea(sug.area)
    setCompetenciasSeleccionadas([sug.competencia])
    setCapacidadesSeleccionadas(sug.capacidades || [])
    setCompetenciaExpandida(sug.competencia)
    setCopilotData({
      coincide: true,
      es_multiarea: false,
      mensaje_evaluacion: `Se aplicó la sugerencia recomendada del área ${sug.area} con la competencia ${sug.competencia}.`,
      recomendaciones: []
    })
    toast.success(`Recomendación aplicada: ${sug.area} - ${sug.competencia}`)
  }

  const descartarSugerenciaCopiloto = () => {
    setCopilotData(null)
  }

  useEffect(() => {
    if (!editingSession) return
    const {
      datosGenerales,
      tema = "",
      tituloSesion,
      titulo,
      competenciasSeleccionadas,
      capacidades,
      contexto = "",
      horasClase = 1,
      enfoqueTransversal = "",
      competenciaTransversal = "",
      materialesSeleccionados: matsSel,
      materialesNoEstructurados: matsNoEst = "",
      instrumentoEvaluacion: instEval = "",
    } = editingSession as any

    if (datosGenerales) {
      if (datosGenerales.docente) setNombreDocente(datosGenerales.docente)
      if (datosGenerales.fecha) setFecha(datosGenerales.fecha)
      if (datosGenerales.grado) setGrado(datosGenerales.grado)
      if (datosGenerales.seccion) setSeccion(datosGenerales.seccion)
    }
    setTema(tema)
    setTituloSesion(tituloSesion ?? titulo ?? tema)
    setCompetenciasSeleccionadas(Array.isArray(competenciasSeleccionadas) ? competenciasSeleccionadas : [])
    setCapacidadesSeleccionadas(Array.isArray(capacidades) ? capacidades : [])
    setContexto(contexto)
    setHorasClase(horasClase)
    setEnfoqueTransversal(enfoqueTransversal)
    setCompetenciaTransversal(competenciaTransversal)
    if (Array.isArray(matsSel)) {
      setMaterialesSeleccionados(matsSel)
    }
    setMaterialesNoEstructurados(matsNoEst)
    if (instEval) setInstrumentoEvaluacion(instEval)
  }, [editingSession])

  const contextoBase = getContextoBase(contexto)

  useEffect(() => {
    if (editingSession) return // Don't override restored materials
    const materiales = materialesPorContexto[contextoBase] || []
    setMaterialesSeleccionados(materiales)
  }, [contextoBase, editingSession])

  const addCompetencia = (competencia: string) => {
    setCompetenciasSeleccionadas((prev) => [...prev, competencia])
    setCompetenciaExpandida(competencia)
  }

  const removeCompetencia = (competencia: string) => {
    setCompetenciasSeleccionadas((prev) => prev.filter((c) => c !== competencia))
    const capacidadesToRemove = capacidadesPorCompetencia[competencia] || []
    setCapacidadesSeleccionadas((prev) => prev.filter((c) => !capacidadesToRemove.includes(c)))
    if (competenciaExpandida === competencia) {
      setCompetenciaExpandida(null)
    }
  }

  const addCapacidad = (capacidad: string) => {
    setCapacidadesSeleccionadas((prev) => [...prev, capacidad])
  }

  const removeCapacidad = (capacidad: string) => {
    setCapacidadesSeleccionadas((prev) => prev.filter((c) => c !== capacidad))
  }

  const toggleMaterial = (material: string) => {
    setMaterialesSeleccionados((prev) =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    )
  }

  const toggleAccordion = (competencia: string) => {
    setCompetenciaExpandida(competenciaExpandida === competencia ? null : competencia)
  }

  const isValid = [
    nombreDocente,
    tema,
    tituloSesion,
    competenciasSeleccionadas.length > 0,
    grado,
    contexto,
    horasClase
  ].every(Boolean)

  const handleLoginRequired = () => {
    if (guestMode) {
      const guestSessionData = {
        datosGenerales: {
          docente: nombreDocente,
          fecha,
          grado,
          seccion,
          ciclo,
        },
        tema,
        titulo: tituloSesion,
        tituloSesion,
        competenciasSeleccionadas,
        capacidades: capacidadesSeleccionadas,
        contexto,
        horasClase,
        enfoqueTransversal,
        competenciaTransversal,
        materialesSeleccionados,
        materialesNoEstructurados,
        instrumentoEvaluacion,
      }
      localStorage.setItem("session_to_edit", JSON.stringify(guestSessionData))
    }
    onLoginRequired?.()
  }

  const generateSession = async () => {
    if (guestMode) {
      handleLoginRequired()
      return
    }

    if (!isValid) {
      setShowErrors(true)
      globalThis.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setCurrentStep(t("generatingStep1"))

    const materialesCombinados = [
      ...materialesSeleccionados,
      ...(materialesNoEstructurados ? [materialesNoEstructurados] : [])
    ].join(", ")

    const loadingMessages = [
      t("generatingStep2"),
      t("generatingStep3"),
      t("generatingStep4"),
      t("generating")
    ]

    try {
      runWebSocketSessionGeneration({
        nivel,
        area,
        tema,
        tituloSesion,
        nombreDocente,
        fecha,
        grado,
        seccion,
        competenciasSeleccionadas,
        capacidadesSeleccionadas,
        enfoqueTransversal,
        competenciaTransversal,
        ciclo,
        contexto,
        horasClase,
        materialesSeleccionados,
        materialesNoEstructurados,
        instrumentoEvaluacion,
        user,
        setCurrentStep,
        setProgress,
        setIsGenerating,
        onSessionGenerated,
        idioma: idiomaGeneracion,
        loadingMessages,
        formData: {
          datosGenerales: {
            docente: nombreDocente,
            fecha,
            nivel,
            area,
            grado,
            seccion,
            ciclo,
            titulo: tituloSesion,
          },
          nivel,
          area,
          tema,
          titulo: tituloSesion,
          tituloSesion,
          competenciasSeleccionadas,
          capacidades: capacidadesSeleccionadas,
          contexto,
          horasClase,
          enfoqueTransversal,
          competenciaTransversal,
          materialesDisponibles: materialesCombinados,
          idioma: idiomaGeneracion
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      alert(`Error: ${errorMessage}\n\nPor favor, intenta de nuevo.`)
      setIsGenerating(false)
    }
  }

  const formProgress = calculateFormProgress(
    nombreDocente,
    grado,
    competenciasSeleccionadas.length > 0,
    tema,
    tituloSesion,
    contexto
  )

  const competenciasDelArea = useMemo(() => {
    return cnebEstructura[nivel]?.[area] || []
  }, [nivel, area])

  return {
    nombreDocente, setNombreDocente,
    fecha, setFecha,
    nivel, setNivel, handleNivelChange,
    area, setArea, handleAreaChange,
    competenciasDelArea,
    grado, setGrado,
    seccion, setSeccion,
    ciclo,
    competenciasSeleccionadas,
    capacidadesSeleccionadas,
    competenciaExpandida,
    tema, setTema,
    tituloSesion, setTituloSesion,
    enfoqueTransversal, setEnfoqueTransversal,
    competenciaTransversal, setCompetenciaTransversal,
    contexto, setContexto,
    horasClase, setHorasClase,
    materialesSeleccionados,
    materialesNoEstructurados, setMaterialesNoEstructurados,
    instrumentoEvaluacion, setInstrumentoEvaluacion,
    isGenerating,
    progress,
    currentStep,
    showErrors,
    copilotData,
    isAnalyzingCopilot,
    analizarTemaCopiloto,
    aplicarSugerenciaCopiloto,
    descartarSugerenciaCopiloto,
    addCompetencia,
    removeCompetencia,
    addCapacidad,
    removeCapacidad,
    toggleMaterial,
    toggleAccordion,
    generateSession,
    handleLoginRequired,
    formProgress,
    contextoBase,
    isValid,
    idiomaGeneracion,
    setIdiomaGeneracion
  }
}

interface SessionHeaderProps {
  readonly guestMode: boolean
  readonly onLoginRequired?: () => void
  readonly onViewDashboard: () => void
  readonly onLogout: () => void
  readonly user?: { readonly name: string; readonly email: string } | null
}

function SessionHeader({
  guestMode,
  onLoginRequired,
  onViewDashboard,
  onLogout,
  user
}: Readonly<SessionHeaderProps>) {
  const { t } = useLanguage()
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {guestMode ? (
            <Link href="/" aria-label="Ir a la página principal">
              <img src="/educa-logo.png" alt="Educa +" className="h-10 md:h-12 w-auto object-contain drop-shadow-sm" />
            </Link>
          ) : (
            <img src="/educa-logo.png" alt="Educa +" className="h-10 md:h-12 w-auto object-contain drop-shadow-sm" />
          )}
          <div>
            <h1 className="font-bold text-xl md:text-2xl text-slate-800 flex items-center gap-2">
              {t("generatorTitle")}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs md:text-sm text-slate-500 font-medium">{t("generatorSubtitle")}</p>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 font-semibold">Powered by IA</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <LanguageSelector />
          <Button
            variant="outline"
            onClick={() => {
              if (guestMode) {
                onLoginRequired?.()
              } else {
                onViewDashboard()
              }
            }}
            className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 transition-all h-9 text-sm font-medium shadow-sm"
          >
            <BarChart3 className="h-4 w-4 mr-2 text-slate-500" />
            <span className="hidden sm:inline">{t("dashboard")}</span>
          </Button>
          {guestMode ? (
            <Button
              onClick={onLoginRequired}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-full text-sm shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              {t("login")}
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                <div className="bg-blue-100 p-1 rounded-full">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 truncate max-w-[100px] sm:max-w-[150px]">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-2 sm:px-3 font-medium"
                title={t("logout")}
              >
                <X className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">{t("exit")}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

interface ProgressModalProps {
  readonly isGenerating: boolean
  readonly currentStep: string
  readonly progress: number
}

function ProgressModal({ isGenerating, currentStep, progress }: Readonly<ProgressModalProps>) {
  const { t } = useLanguage()
  if (!isGenerating) return null
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <Card className="bg-white border border-slate-200 shadow-2xl max-w-md w-full rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/pinguinos/pinguino_pensando.png"
              alt="Pingüino pensando"
              className="w-24 h-24 object-contain animate-bounce"
            />
          </div>
          <CardTitle className="text-2xl text-slate-800 font-bold">
            {t("generating")}
          </CardTitle>
          <CardDescription className="text-base text-blue-600 font-medium mt-1">
            {currentStep}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
              <span>{progress}% completado</span>
              <span>~{Math.max(1, Math.ceil((100 - progress) / 15))}s restantes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SessionSidebarSummaryProps {
  readonly nombreDocente: string
  readonly nivel: string
  readonly area: string
  readonly grado: string
  readonly ciclo: string
  readonly tema: string
  readonly competenciasSeleccionadas: readonly string[]
  readonly formProgress: number
}

function SessionSidebarSummary({
  nombreDocente,
  nivel,
  area,
  grado,
  ciclo,
  tema,
  competenciasSeleccionadas,
  formProgress
}: Readonly<SessionSidebarSummaryProps>) {
  const { t } = useLanguage()
  const nivelNombre = nivelesEducativos.find(n => n.id === nivel)?.name || nivel
  const gradoObj = (gradosPorNivel[nivel] || []).find(g => g.id === grado)

  return (
    <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{t("newSession")}</h2>
        <p className="text-slate-500 mt-1">{t("formInstructions")}</p>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-700">
            <BookOpen className="h-4 w-4 text-blue-600" />
            {t("newSession")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t("teacher")}</p>
            <p className="text-sm font-medium text-slate-800">{nombreDocente || <span className="text-slate-300 italic">No especificado</span>}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Nivel / Área</p>
            <p className="text-sm font-medium text-slate-800">
              {nivelNombre} • {area}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t("grade")}</p>
            <p className="text-sm font-medium text-slate-800">
              {gradoObj ? (
                <span>
                  {gradoObj.label} {ciclo && `(Ciclo ${ciclo})`}
                </span>
              ) : (
                <span className="text-slate-300 italic">No especificado</span>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t("theme")}</p>
            <p className="text-sm font-medium text-slate-800 line-clamp-2">{tema || <span className="text-slate-300 italic">No especificado</span>}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{t("competencies")} ({competenciasSeleccionadas.length})</p>
            {competenciasSeleccionadas.length > 0 ? (
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                {competenciasSeleccionadas.map(c => <li key={c} className="truncate">{c}</li>)}
              </ul>
            ) : (
              <p className="text-sm font-medium text-slate-300 italic">Ninguna seleccionada</p>
            )}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-600">{t("formProgress")}</span>
              <span className="text-blue-600 font-bold">{Math.round(formProgress)}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${formProgress}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-xs text-blue-800 font-medium leading-relaxed">
          La IA estructurará tu sesión automáticamente siguiendo el enfoque del Currículo Nacional (CNEB) y adaptando las actividades a tu contexto social seleccionado.
        </p>
      </div>
    </div>
  )
}

interface CompetenciasSectionProps {
  readonly area: string
  readonly competenciasDelArea: readonly CompetenciaCneb[]
  readonly showErrors: boolean
  readonly competenciasSeleccionadas: readonly string[]
  readonly competenciaExpandida: string | null
  readonly capacidadesSeleccionadas: readonly string[]
  readonly toggleAccordion: (competencia: string) => void
  readonly addCompetencia: (competencia: string) => void
  readonly removeCompetencia: (competencia: string) => void
  readonly addCapacidad: (capacidad: string) => void
  readonly removeCapacidad: (capacidad: string) => void
}

function CompetenciasSection({
  area,
  competenciasDelArea,
  showErrors,
  competenciasSeleccionadas,
  competenciaExpandida,
  capacidadesSeleccionadas,
  toggleAccordion,
  addCompetencia,
  removeCompetencia,
  addCapacidad,
  removeCapacidad
}: Readonly<CompetenciasSectionProps>) {
  return (
    <section className="space-y-5 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-md">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">2. Competencias y Capacidades ({area})</h3>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-slate-700">
          Competencias CNEB del Área de <span className="text-blue-600 font-bold">{area}</span> <span className="text-red-500">*</span>
        </Label>

        <div className="grid grid-cols-1 gap-3">
          {competenciasDelArea.map((comp) => {
            const isSelected = competenciasSeleccionadas.includes(comp.name)
            const isExpanded = competenciaExpandida === comp.name
            const capacidades = comp.capacidades
            return (
              <div key={comp.name}>
                {/* Tarjeta de Competencia */}
                <div
                  className={`flex items-center p-4 rounded-xl border transition-all duration-200 shadow-sm ${isSelected
                      ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                      : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                >
                  {/* Left & Middle Interactive Area */}
                  <button
                    type="button"
                    className="flex-1 flex items-center text-left"
                    onClick={() => {
                      if (isSelected) {
                        toggleAccordion(comp.name)
                      } else {
                        addCompetencia(comp.name)
                      }
                    }}
                  >
                    <div className={`p-2.5 rounded-lg mr-4 ${isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-500"}`}>
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className={`font-semibold text-sm ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                      {comp.name}
                    </div>
                  </button>

                  {/* Right Interactive Area */}
                  <div className="flex items-center gap-3 ml-4">
                    {isSelected && (
                      <button
                        type="button"
                        onClick={() => toggleAccordion(comp.name)}
                        className="text-slate-400 hover:text-blue-600 p-1 bg-white rounded-md border border-slate-200 animate-in fade-in"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          removeCompetencia(comp.name)
                        } else {
                          addCompetencia(comp.name)
                        }
                      }}
                      className={`h-5 w-5 border-2 rounded flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white hover:border-blue-400"
                      }`}
                      aria-label={`Seleccionar ${comp.name}`}
                    >
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </button>
                  </div>
                </div>

                {/* Acordeón de Capacidades */}
                {isSelected && isExpanded && (
                  <div className="mt-2 ml-4 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in slide-in-from-top-2">
                    <p className="text-xs text-slate-600 font-semibold mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                      Capacidades oficiales asociadas:
                    </p>
                    <div className="flex flex-col gap-2">
                      {capacidades.map((capacidad) => {
                        const isCapSelected = capacidadesSeleccionadas.includes(capacidad)
                        return (
                          <button
                            key={capacidad}
                            type="button"
                            className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${isCapSelected
                                ? "bg-white border-blue-200 shadow-sm"
                                : "bg-transparent border-transparent hover:bg-slate-100"
                              }`}
                            onClick={() => {
                              if (isCapSelected) {
                                removeCapacidad(capacidad)
                              } else {
                                addCapacidad(capacidad)
                              }
                            }}
                          >
                            <div
                              className={`mt-0.5 h-5 w-5 min-w-[20px] min-h-[20px] border-2 rounded flex items-center justify-center transition-all ${
                                isCapSelected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isCapSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <span className={`text-sm leading-snug font-medium ${isCapSelected ? "text-slate-900" : "text-slate-600"}`}>
                              {capacidad}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {showErrors && competenciasSeleccionadas.length === 0 && (
          <p className="text-xs text-red-500 font-medium">Selecciona al menos una competencia de {area}</p>
        )}
      </div>
    </section>
  )
}

interface SugerenciaCopiloto {
  area: string
  competencia: string
  capacidades: string[]
  enfoque_explicacion: string
}

interface CopilotResponse {
  coincide: boolean
  es_multiarea: boolean
  mensaje_evaluacion: string
  recomendaciones: SugerenciaCopiloto[]
}

interface CopilotCurricularCardProps {
  readonly copilotData: CopilotResponse | null
  readonly isAnalyzing: boolean
  readonly onAplicarRecomendacion: (sugerencia: SugerenciaCopiloto) => void
  readonly onDescartarRecomendacion: () => void
}

function CopilotCurricularCard({
  copilotData,
  isAnalyzing,
  onAplicarRecomendacion,
  onDescartarRecomendacion
}: Readonly<CopilotCurricularCardProps>) {
  if (isAnalyzing) {
    return (
      <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3 animate-pulse">
        <Brain className="h-5 w-5 text-indigo-600 animate-spin" />
        <span className="text-xs font-semibold text-indigo-800">
          El Copiloto RAG está analizando el Currículo Nacional para este tema...
        </span>
      </div>
    )
  }

  if (!copilotData) return null

  // Caso A: Coincidencia perfecta
  if (copilotData.coincide) {
    return (
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 animate-in fade-in">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Alineación Curricular Excelente</h4>
          <p className="text-xs text-emerald-800 font-medium mt-0.5 leading-relaxed">
            {copilotData.mensaje_evaluacion}
          </p>
        </div>
      </div>
    )
  }

  // Caso B / C: Recomendación orientadora o Multi-área
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-blue-50/50 to-white border border-indigo-200/80 shadow-sm space-y-4 animate-in slide-in-from-top-2">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20 shrink-0">
          <Brain className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            Copiloto Curricular EduAI
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
              RAG CNEB
            </span>
          </h4>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            {copilotData.mensaje_evaluacion}
          </p>
        </div>
      </div>

      {/* Lista de Recomendaciones */}
      <div className="space-y-3 pt-1">
        {copilotData.recomendaciones.map((sug, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                Área: {sug.area}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {sug.competencia}
              </span>
            </div>
            <p className="text-xs text-slate-600 italic">
              "{sug.enfoque_explicacion}"
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                onClick={() => onAplicarRecomendacion(sug)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-8 px-3 rounded-lg shadow-sm"
              >
                Usar recomendación
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-indigo-100/60 pt-3">
        <span className="text-[11px] text-slate-400">
          El docente siempre conserva la decisión final de la planificación.
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDescartarRecomendacion}
          className="text-xs text-slate-500 hover:text-slate-700 h-7 px-2 font-medium"
        >
          Mantener mi selección
        </Button>
      </div>
    </div>
  )
}

interface MaterialesSectionProps {
  readonly contextoBase: string
  readonly materialesSeleccionados: readonly string[]
  readonly toggleMaterial: (material: string) => void
  readonly materialesNoEstructurados: string
  readonly setMaterialesNoEstructurados: (val: string) => void
}

function MaterialesSection({
  contextoBase,
  materialesSeleccionados,
  toggleMaterial,
  materialesNoEstructurados,
  setMaterialesNoEstructurados
}: Readonly<MaterialesSectionProps>) {
  return (
    <section className="space-y-5 animate-in fade-in">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="bg-violet-100 p-1.5 rounded-md">
          <Package className="h-5 w-5 text-violet-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">6. Materiales Didácticos</h3>
      </div>

      {contextoBase && materialesPorContexto[contextoBase] && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">Sugeridos para {contextoBase}</Label>
          <div className="flex flex-wrap gap-2">
            {materialesPorContexto[contextoBase].map((material) => {
              const isSelected = materialesSeleccionados.includes(material)
              return (
                <Button
                  key={material}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMaterial(material)}
                  className={`h-9 rounded-full transition-all border shadow-sm ${isSelected
                      ? "bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-100"
                      : "bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                >
                  {isSelected ? <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-violet-600" /> : null}
                  {material}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="materialesNoEstructurados" className="text-sm font-semibold text-slate-700">Material No Estructurado (opcional)</Label>
        <Textarea
          id="materialesNoEstructurados"
          placeholder="Ej: chapas, piedritas, palitos, recortes de periódicos..."
          value={materialesNoEstructurados}
          onChange={(e) => setMaterialesNoEstructurados(e.target.value)}
          className="min-h-[80px] bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm resize-none"
        />
      </div>
    </section>
  )
}

export function SessionGenerator(props: SessionGeneratorProps) {
  const { user, onViewDashboard, onLogout, guestMode = false, onLoginRequired, editingSession } = props
  const { t } = useLanguage()
  const {
    nombreDocente, setNombreDocente,
    fecha, setFecha,
    nivel, setNivel, handleNivelChange,
    area, setArea, handleAreaChange,
    competenciasDelArea,
    grado, setGrado,
    seccion, setSeccion,
    ciclo,
    competenciasSeleccionadas,
    capacidadesSeleccionadas,
    competenciaExpandida,
    tema, setTema,
    tituloSesion, setTituloSesion,
    enfoqueTransversal, setEnfoqueTransversal,
    competenciaTransversal, setCompetenciaTransversal,
    contexto, setContexto,
    horasClase, setHorasClase,
    materialesSeleccionados,
    materialesNoEstructurados, setMaterialesNoEstructurados,
    instrumentoEvaluacion, setInstrumentoEvaluacion,
    isGenerating,
    progress,
    currentStep,
    showErrors,
    copilotData,
    isAnalyzingCopilot,
    analizarTemaCopiloto,
    aplicarSugerenciaCopiloto,
    descartarSugerenciaCopiloto,
    addCompetencia,
    removeCompetencia,
    addCapacidad,
    removeCapacidad,
    toggleMaterial,
    toggleAccordion,
    generateSession,
    handleLoginRequired,
    formProgress,
    contextoBase,
    isValid,
    idiomaGeneracion,
    setIdiomaGeneracion
  } = useSessionGeneratorState(props)

  const areasDisponibles = Object.keys(cnebEstructura[nivel] || {})

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative font-sans">

      {/* HEADER LUMINOSO Y LIMPIO */}
      <SessionHeader
        guestMode={guestMode}
        onLoginRequired={handleLoginRequired}
        onViewDashboard={onViewDashboard}
        onLogout={onLogout}
        user={user}
      />

      {/* Progress Modal */}
      <ProgressModal
        isGenerating={isGenerating}
        currentStep={currentStep}
        progress={progress}
      />

      {/* CONTENIDO PRINCIPAL A 2 COLUMNAS */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SIDEBAR - RESUMEN (Pegajoso en Desktop) */}
          <SessionSidebarSummary
            nombreDocente={nombreDocente}
            nivel={nivel}
            area={area}
            grado={grado}
            ciclo={ciclo}
            tema={tema}
            competenciasSeleccionadas={competenciasSeleccionadas}
            formProgress={formProgress}
          />

          {/* FORMULARIO PRINCIPAL */}
          <div className="col-span-1 lg:col-span-8 space-y-6">

            {/* Título en Móvil */}
            <div className="lg:hidden mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{t("newSession")}</h2>
              <p className="text-slate-500 text-sm mt-1">{t("formInstructions")}</p>
            </div>

            <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-10">

                {/* 1. DATOS GENERALES */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-indigo-100 p-1.5 rounded-md">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">1. {t("welcome").replace("!", "")} ({t("teacher")})</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="nombreDocente" className="text-sm font-semibold text-slate-700">
                        {t("docenteLabel")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nombreDocente"
                        placeholder={t("docentePlaceholder")}
                        value={nombreDocente}
                        onChange={(e) => setNombreDocente(e.target.value)}
                        className={`h-11 bg-white border-${showErrors && !nombreDocente ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm transition-all`}
                      />
                      {showErrors && !nombreDocente && <p className="text-xs text-red-500 font-medium">Este campo es requerido</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fecha" className="text-sm font-semibold text-slate-700">{t("fechaLabel")}</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm"
                      />
                    </div>

                    {/* SELECTOR DE NIVEL EDUCATIVO */}
                    <div className="space-y-2">
                      <Label htmlFor="nivel" className="text-sm font-semibold text-slate-700">
                        Nivel Educativo <span className="text-red-500">*</span>
                      </Label>
                      <Select value={nivel} onValueChange={handleNivelChange}>
                        <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                          <SelectValue placeholder="Selecciona Nivel..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {nivelesEducativos.map((n) => (
                            <SelectItem key={n.id} value={n.id}>
                              {n.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SELECTOR DE ÁREA CURRICULAR */}
                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-sm font-semibold text-slate-700">
                        Área Curricular <span className="text-red-500">*</span>
                      </Label>
                      <Select value={area} onValueChange={handleAreaChange}>
                        <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                          <SelectValue placeholder="Selecciona Área..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {areasDisponibles.map((a) => (
                            <SelectItem key={a} value={a}>
                              {a}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* SELECTOR DINÁMICO DE GRADO */}
                    <div className="space-y-2">
                      <Label htmlFor="grado" className="text-sm font-semibold text-slate-700">
                        {t("gradoLabel")} / Edad <span className="text-red-500">*</span>
                      </Label>
                      <Select value={grado} onValueChange={setGrado}>
                        <SelectTrigger className={`h-11 bg-white border-${showErrors && !grado ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}>
                          <SelectValue placeholder="Selecciona Grado/Edad..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {(gradosPorNivel[nivel] || []).map((g) => (
                            <SelectItem key={g.id} value={g.id}>
                              {g.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {showErrors && !grado && <p className="text-xs text-red-500 font-medium">Selecciona un grado</p>}

                      {ciclo && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold animate-in fade-in duration-300">
                          <BookOpen className="h-3 w-3" />
                          Ciclo {ciclo}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seccion" className="text-sm font-semibold text-slate-700">{t("seccionLabel")}</Label>
                      <Input
                        id="seccion"
                        placeholder={t("seccionPlaceholder")}
                        value={seccion}
                        onChange={(e) => setSeccion(e.target.value)}
                        className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. TEMA Y CONTENIDO DE LA SESIÓN CON COPILOTO RAG */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-emerald-100 p-1.5 rounded-md">
                      <FileText className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">2. {t("theme")}</h3>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="tema" className="text-sm font-semibold text-slate-700">
                          {t("temaLabel")} <span className="text-red-500">*</span>
                        </Label>
                        {nivel && area && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => analizarTemaCopiloto(tema)}
                            className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold h-7 px-2 flex items-center gap-1"
                          >
                            <Brain className="h-3.5 w-3.5" />
                            Analizar con Copiloto RAG
                          </Button>
                        )}
                      </div>

                      {(!nivel || !area) ? (
                        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs font-semibold flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-amber-600 shrink-0" />
                          <span>Primero selecciona el <strong>Nivel Educativo</strong> y el <strong>Área Curricular</strong> arriba para ingresar el tema.</span>
                        </div>
                      ) : (
                        <Input
                          id="tema"
                          placeholder={t("temaPlaceholder")}
                          value={tema}
                          disabled={!nivel || !area}
                          onChange={(e) => {
                            const val = e.target.value
                            setTema(val)
                            if (val.trim().length >= 4) {
                              analizarTemaCopiloto(val)
                            } else {
                              descartarSugerenciaCopiloto()
                            }
                          }}
                          className={`h-11 bg-white border-${showErrors && !tema ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}
                        />
                      )}
                      
                      <p className="text-xs text-slate-500">
                        El tema o situación de aprendizaje. El Copiloto RAG analizará la alineación con el CNEB automáticamente.
                      </p>
                      {showErrors && !tema && <p className="text-xs text-red-500 font-medium">El tema es obligatorio</p>}

                      {/* RENDERING TARJETA COPILOTO RAG */}
                      <CopilotCurricularCard
                        copilotData={copilotData}
                        isAnalyzing={isAnalyzingCopilot}
                        onAplicarRecomendacion={aplicarSugerenciaCopiloto}
                        onDescartarRecomendacion={descartarSugerenciaCopiloto}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tituloSesion" className="text-sm font-semibold text-slate-700">
                        {t("tituloLabel")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="tituloSesion"
                        placeholder={t("tituloPlaceholder")}
                        value={tituloSesion}
                        onChange={(e) => setTituloSesion(e.target.value)}
                        className={`h-11 bg-white border-${showErrors && !tituloSesion ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}
                      />
                      <p className="text-xs text-slate-500">
                        El título debe reflejar la situación significativa que motivará el aprendizaje.
                      </p>
                      {showErrors && !tituloSesion && <p className="text-xs text-red-500 font-medium">El título es obligatorio</p>}
                    </div>
                  </div>
                </section>

                {/* 3. COMPETENCIAS Y CAPACIDADES */}
                <CompetenciasSection
                  area={area}
                  competenciasDelArea={competenciasDelArea}
                  showErrors={showErrors}
                  competenciasSeleccionadas={competenciasSeleccionadas}
                  competenciaExpandida={competenciaExpandida}
                  capacidadesSeleccionadas={capacidadesSeleccionadas}
                  toggleAccordion={toggleAccordion}
                  addCompetencia={addCompetencia}
                  removeCompetencia={removeCompetencia}
                  addCapacidad={addCapacidad}
                  removeCapacidad={removeCapacidad}
                />

                {/* 4. ENFOQUES TRANSVERSALES */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 p-1.5 rounded-md">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">4. {t("enfoqueTransversalLabel")}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="enfoqueTransversal" className="text-sm font-semibold text-slate-700">{t("enfoqueTransversalLabel")}</Label>
                      <Select value={enfoqueTransversal} onValueChange={setEnfoqueTransversal}>
                        <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {enfoquesTransversales.map((enfoque) => (
                            <SelectItem key={enfoque} value={enfoque}>{enfoque}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {enfoqueTransversal && enfoquesDescripciones[enfoqueTransversal] && (
                        <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-2 rounded-md border border-slate-100">
                          {enfoquesDescripciones[enfoqueTransversal]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competenciaTransversal" className="text-sm font-semibold text-slate-700">{t("competenciaTransversalLabel")}</Label>
                      <Select value={competenciaTransversal} onValueChange={setCompetenciaTransversal}>
                        <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {competenciasTransversales.map((comp) => (
                            <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                {/* 5. CONTEXTO Y DURACIÓN */}
                <section className="space-y-5 animate-in fade-in">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-rose-100 p-1.5 rounded-md">
                      <Clock className="h-5 w-5 text-rose-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">5. {t("context")} & {t("duration")}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contexto" className="text-sm font-semibold text-slate-700">
                        {t("contextoLabel")} <span className="text-red-500">*</span>
                      </Label>
                      <Select value={contexto} onValueChange={setContexto}>
                        <SelectTrigger className={`h-11 bg-white border-${showErrors && !contexto ? 'red-300' : 'slate-300'} focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm`}>
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          {contextosLocales.map((ctx) => (
                            <SelectItem key={ctx} value={ctx}>{ctx}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {showErrors && !contexto && <p className="text-xs text-red-500 font-medium">Selecciona el contexto social</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="horas" className="text-sm font-semibold text-slate-700">
                        {t("horasLabel")} <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="horas"
                          type="number"
                          min="1"
                          max="8"
                          value={horasClase}
                          onChange={(e) => setHorasClase(Number.parseInt(e.target.value) || 1)}
                          className="w-20 h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 text-center font-bold shadow-sm"
                        />
                        <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg flex-1">
                          <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            {horasClase === 1 ? "1 hora = 45 min" : `${horasClase} horas = ${horasClase * 45} min`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idiomaGeneracion" className="text-sm font-semibold text-slate-700">
                        {t("idiomaLabel")} <span className="text-red-500">*</span>
                      </Label>
                      <Select value={idiomaGeneracion} onValueChange={setIdiomaGeneracion}>
                        <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm font-semibold">
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-900">
                          <SelectItem value="español">
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-red-500" />
                              Español
                            </span>
                          </SelectItem>
                          <SelectItem value="inglés">
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-white to-red-500" />
                              English (Inglés)
                            </span>
                          </SelectItem>
                          <SelectItem value="quechua">
                            <span className="flex items-center gap-2 font-bold text-amber-600">
                              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 to-purple-600" />
                              Runasimi (Quechua) ⭐
                            </span>
                          </SelectItem>
                          <SelectItem value="aymara">
                            <span className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-300 via-emerald-400 to-indigo-600" />
                              Aymar aru (Aymara)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>

                {/* 6. MATERIALES DIDÁCTICOS */}
                <MaterialesSection
                  contextoBase={contextoBase}
                  materialesSeleccionados={materialesSeleccionados}
                  toggleMaterial={toggleMaterial}
                  materialesNoEstructurados={materialesNoEstructurados}
                  setMaterialesNoEstructurados={setMaterialesNoEstructurados}
                />

                {/* 7. EVALUACIÓN */}
                <section className="space-y-5 animate-in fade-in pb-2">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="bg-fuchsia-100 p-1.5 rounded-md">
                      <Award className="h-5 w-5 text-fuchsia-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">6. {t("evaluation")}</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instrumentoEvaluacion" className="text-sm font-semibold text-slate-700">{t("evaluacionLabel")}</Label>
                    <Select value={instrumentoEvaluacion} onValueChange={setInstrumentoEvaluacion}>
                      <SelectTrigger className="h-11 bg-white border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 text-slate-900 shadow-sm">
                        <SelectValue placeholder="Selecciona..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900">
                        {instrumentosEvaluacion.map((inst) => (
                          <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </section>
              </CardContent>
            </Card>

            {/* BOTÓN GENERAR */}
            <div className="pt-4 animate-in fade-in sticky bottom-4 z-20">
              <Button
                onClick={generateSession}
                disabled={isGenerating}
                className={`w-full h-14 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${isGenerating
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-600/30 hover:-translate-y-0.5"
                  }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-3 animate-spin text-slate-400" />
                    {t("generating")}
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6 mr-3 text-white" />
                    {editingSession ? t("save") : t("generateBtn")}
                  </>
                )}
              </Button>

              {showErrors && !isValid && (
                <div className="mt-4 text-center p-3 rounded-lg bg-red-50 border border-red-100">
                  <p className="text-sm font-semibold text-red-600 flex items-center justify-center gap-2">
                    <Info className="h-4 w-4" />
                    Revisa los campos marcados en rojo antes de continuar
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
