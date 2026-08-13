import { SessionViewPageClient } from "@/components/session-view-page-client"

export const metadata = {
  title: 'Visor de Documentos - Educa +',
  description: 'Lee y descarga esta sesión de aprendizaje generada por la comunidad de docentes.',
}

export default function SessionViewPage({ params }: Readonly<{ readonly params: Readonly<{ readonly id: string }> }>) {
  return <SessionViewPageClient id={params.id} />
}
