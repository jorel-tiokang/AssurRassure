import { useParams, Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, User, Activity, FileText, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { assureService } from "../../lib/services/assureService"
import { feuilleMaladieService } from "../../lib/services/feuilleMaladieService"

const getAge = (dateNaissance: string) => {
  const today = new Date()
  const birth = new Date(dateNaissance)
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
  return age
}

export function AgentAssureDossierPage() {
  const { id } = useParams()
  const assureId = id ? parseInt(id, 10) : 0

  const { data: assure, isLoading: isLoadingAssure } = useQuery({
    queryKey: ['assure', assureId],
    queryFn: () => assureService.getAssureById(assureId),
    enabled: !!assureId
  })

  const { data: feuilles = [], isLoading: isLoadingFeuilles } = useQuery({
    queryKey: ['feuilles-assure', assureId],
    queryFn: () => feuilleMaladieService.getFeuilles(assureId),
    enabled: !!assureId
  })

  if (isLoadingAssure) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#0055FF]" />
      </div>
    )
  }

  if (!assure) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-ink-muted">Assuré introuvable.</p>
        <Button variant="outline" asChild>
          <Link to="/agent/assures">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-ink-muted hover:text-ink">
            <Link to="/agent/assures">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-display font-medium text-ink">
              Dossier de {assure.nom} {assure.prenom}
            </h1>
            <p className="text-ink-muted mt-1 font-mono text-sm">NSS: {assure.nss}</p>
          </div>
        </div>
        {!assure.medecinTraitantId && (
          <Button asChild variant="accent">
            <Link to={`/agent/assures/medecin-traitant?assureId=${assure.id}`}>
              Assigner Médecin
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-[#0055FF]" /> Informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Date de naissance</span>
                <span className="font-medium">{new Date(assure.dateNaissance).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Sexe</span>
                <span className="font-medium">{assure.sexe || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Âge</span>
                <span className="font-medium">{getAge(assure.dateNaissance)} ans</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Téléphone</span>
                <span className="font-medium">{assure.telephone || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Compte Bancaire</span>
                <span className="font-medium">{assure.numeroCompte || '-'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" /> Couverture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-ink-muted block mb-1">Médecin Traitant</span>
                {assure.medecinTraitantId ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-blue-50 text-blue-700">
                    Assigné (ID: {assure.medecinTraitantId})
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-zinc-100 text-ink-muted">
                    Non assigné
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0055FF]" /> Historique des Feuilles de Maladie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingFeuilles ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-[#0055FF]" /></div>
                ) : feuilles.length === 0 ? (
                  <p className="text-sm text-ink-muted text-center py-4">Aucune feuille de maladie enregistrée.</p>
                ) : (
                  feuilles.map((feuille) => (
                    <div key={feuille.id} className="border border-ink/10 p-4 rounded-sm hover:border-[#0055FF]/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-ink">FM-{new Date().getFullYear()}-{feuille.id.toString().padStart(3, '0')}</h4>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                          feuille.statut === "Remboursé" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                        }`}>
                          {feuille.statut}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-ink-muted block text-xs mb-1">ID Consultation</span>
                          <span>{feuille.consultationId}</span>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-xs mb-1">Montant total</span>
                          <span className="font-medium">{feuille.montantSoins} FCFA</span>
                        </div>
                        <div>
                          <span className="text-ink-muted block text-xs mb-1">Part prise en charge</span>
                          <span className="font-medium text-[#0055FF]">{feuille.montantRembourse || '-'} FCFA</span>
                        </div>
                        {feuille.modePaiement && (
                          <div>
                            <span className="text-ink-muted block text-xs mb-1">Mode Paiement</span>
                            <span className="font-medium">{feuille.modePaiement}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
