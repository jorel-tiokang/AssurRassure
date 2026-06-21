import { useParams, Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, User, Stethoscope, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { medecinService } from "../../lib/services/medecinService"

export function AgentMedecinDossierPage() {
  const { id } = useParams()
  const medecinId = id ? parseInt(id, 10) : 0

  const { data: medecin, isLoading } = useQuery({
    queryKey: ['medecin', medecinId],
    queryFn: () => medecinService.getMedecinById(medecinId),
    enabled: !!medecinId
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#0055FF]" />
      </div>
    )
  }

  if (!medecin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-ink-muted">Médecin introuvable.</p>
        <Button variant="outline" asChild>
          <Link to="/agent/medecins">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-ink-muted hover:text-ink">
          <Link to="/agent/medecins">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">
            Dr. {medecin.nom} {medecin.prenom}
          </h1>
          <p className="text-ink-muted mt-1 font-mono text-sm">Identifiant: {medecin.identifiant} | RPPS: {medecin.rpps}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-[#0055FF]" /> Informations Professionnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <span className="text-ink-muted">Type</span>
              <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${
                medecin.type === "GENERALISTE" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
              }`}>
                {medecin.type}
              </span>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <span className="text-ink-muted">Spécialité</span>
              <span className="font-medium text-ink">{medecin.specialite}</span>
            </div>
            <div className="flex justify-between border-b border-ink/5 pb-2">
              <span className="text-ink-muted">Lieu d'exercice</span>
              <span className="font-medium text-ink">{medecin.clinique}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-[#0055FF]" /> Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-ink">
              <Mail className="h-4 w-4 text-ink-muted" />
              <span>{medecin.nom.toLowerCase()}.{medecin.prenom.toLowerCase()}@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-ink">
              <Phone className="h-4 w-4 text-ink-muted" />
              <span>Non renseigné</span>
            </div>
            <div className="flex items-center gap-3 text-ink">
              <MapPin className="h-4 w-4 text-ink-muted" />
              <span>{medecin.clinique}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
