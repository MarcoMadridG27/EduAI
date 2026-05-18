import { PublicSessionView } from "@/components/public-session-view"

export const metadata = {
  title: 'Visor de Documentos - Sesión+',
  description: 'Lee y descarga esta sesión de aprendizaje generada por la comunidad de docentes.',
}

export default function SessionViewPage({ params }: { params: { id: string } }) {
  return <PublicSessionView id={params.id} />
}
