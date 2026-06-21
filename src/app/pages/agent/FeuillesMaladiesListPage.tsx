import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { Search, Eye, CheckCircle2, Clock, Filter, X, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { feuilleMaladieService, FeuilleMaladie } from "../../lib/services/feuilleMaladieService"

const formatFCFA = (n: number | undefined) =>
  n ? new Intl.NumberFormat("fr-CM").format(n) + " FCFA" : "-"

export function FeuillesMaladiesListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<"" | "ENREGISTREE" | "REMBOURSEE">("")
  const [showFilters, setShowFilters] = useState(false)
  const [viewFeuille, setViewFeuille] = useState<FeuilleMaladie | null>(null)

  const { data: feuilles = [], isLoading, isError } = useQuery({
    queryKey: ['feuilles', filterStatut],
    queryFn: () => feuilleMaladieService.getFeuilles(undefined, filterStatut || undefined)
  })

  const activeFilterCount = [filterStatut].filter(Boolean).length

  const filtered = feuilles.filter(f => {
    const matchSearch =
      f.id.toString().includes(searchTerm) ||
      f.consultationId.toString().includes(searchTerm)
    return matchSearch
  })

  const nonRembCount = feuilles.filter(f => f.statut === "ENREGISTREE").length
  const rembCount = feuilles.filter(f => f.statut === "REMBOURSEE").length

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Feuilles de Maladie</h1>
          <p className="text-ink-muted mt-1">Toutes les feuilles de maladie du système, une par consultation.</p>
        </div>
        <Button asChild variant="accent">
          <a href="/agent/remboursements/nouveau">
            Effectuer un remboursement
          </a>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-ink/10 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 bg-amber-50 flex items-center justify-center">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-ink">{nonRembCount}</div>
            <div className="text-sm text-ink-muted">Non remboursée{nonRembCount > 1 ? "s" : ""}</div>
          </div>
        </div>
        <div className="bg-white border border-ink/10 shadow-sm p-5 flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-ink">{rembCount}</div>
            <div className="text-sm text-ink-muted">Remboursée{rembCount > 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-ink/10 shadow-sm">
        <div className="p-4 border-b border-ink/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-zinc-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              placeholder="Rechercher par assuré, médecin ou référence..."
              className="pl-10 h-10 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={activeFilterCount > 0 ? "border-[#0055FF] text-[#0055FF]" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-[#0055FF] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="p-4 border-b border-ink/10 bg-blue-50/40 flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Statut</label>
              <select
                value={filterStatut}
                onChange={e => setFilterStatut(e.target.value as "" | "ENREGISTREE" | "REMBOURSEE")}
                className="flex h-10 bg-white border border-ink/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF]"
              >
                <option value="">Tous les statuts</option>
                <option value="ENREGISTREE">En attente (Enregistrée)</option>
                <option value="REMBOURSEE">Remboursée</option>
              </select>
            </div>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setFilterStatut("")} className="text-ink-muted h-10">
                <X className="h-3.5 w-3.5 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-ink-muted uppercase bg-zinc-50 border-b border-ink/10">
              <tr>
                <th className="px-6 py-4 font-medium">Référence (ID)</th>
                <th className="px-6 py-4 font-medium">ID Consultation</th>
                <th className="px-6 py-4 font-medium">Montant Soins</th>
                <th className="px-6 py-4 font-medium">Montant Remboursé</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0055FF] mx-auto" />
                    <p className="text-sm text-ink-muted mt-2">Chargement des feuilles de maladie...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-600">
                    Erreur lors du chargement des données.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-ink-muted">
                    Aucune feuille de maladie trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map(feuille => (
                  <tr key={feuille.id} className="transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-ink text-xs">FM-{feuille.id}</td>
                    <td className="px-6 py-4 text-ink-muted">
                      Consultation #{feuille.consultationId}
                    </td>
                    <td className="px-6 py-4 font-mono text-ink">
                      {formatFCFA(feuille.montantSoins)}
                    </td>
                    <td className="px-6 py-4 font-mono text-ink-muted">
                      {formatFCFA(feuille.montantRembourse)}
                    </td>
                    <td className="px-6 py-4">
                      {feuille.statut === "REMBOURSEE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Remboursée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium bg-amber-50 text-amber-700">
                          <Clock className="h-3.5 w-3.5" />
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#0055FF] hover:text-[#0044CC] hover:bg-blue-50"
                        onClick={() => setViewFeuille(feuille)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-ink/10 bg-zinc-50 text-sm text-ink-muted">
          Affichage de {filtered.length} feuille(s) sur {feuilles.length}
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={!!viewFeuille} onOpenChange={open => !open && setViewFeuille(null)}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-ink flex items-center gap-3">
              Feuille de Maladie #{viewFeuille?.id}
              {viewFeuille?.statut === "REMBOURSEE" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium bg-green-50 text-green-700">
                  <CheckCircle2 className="h-3 w-3" /> Remboursée
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium bg-amber-50 text-amber-700">
                  <Clock className="h-3 w-3" /> En attente
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {viewFeuille && (
            <div className="space-y-6 pt-2">
              {/* Consultation info */}
              <div>
                <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-3">Informations de Consultation</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-xs text-ink-muted">ID Consultation</dt>
                    <dd className="font-medium text-ink">{viewFeuille.consultationId}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Statut</dt>
                    <dd className="font-medium text-ink">{viewFeuille.statut === "REMBOURSEE" ? "Remboursée" : "En attente"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Montant des soins</dt>
                    <dd className="font-mono font-medium text-ink">{formatFCFA(viewFeuille.montantSoins)}</dd>
                  </div>
                </dl>
              </div>

              {/* Remboursement info — only if remboursée */}
              {viewFeuille.statut === "REMBOURSEE" && (
                <div className="border-t border-ink/10 pt-6">
                  <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-3">Informations de Remboursement</h3>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <dt className="text-xs text-ink-muted">Date de remboursement</dt>
                      <dd className="font-medium text-ink">
                        {viewFeuille.dateRemboursement ? new Date(viewFeuille.dateRemboursement).toLocaleDateString("fr-FR") : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-muted">Taux de remboursement</dt>
                      <dd className="font-medium text-ink">{viewFeuille.tauxRemboursement ? `${viewFeuille.tauxRemboursement * 100}%` : "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-muted">Montant remboursé</dt>
                      <dd className="font-mono font-bold text-green-700">{formatFCFA(viewFeuille.montantRembourse)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-ink-muted">Mode de paiement</dt>
                      <dd>
                        <span className="inline-block px-2 py-0.5 rounded-sm text-xs font-medium bg-blue-50 text-blue-700">
                          {viewFeuille.modePaiement || "Non spécifié"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="border-t border-ink/10 pt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setViewFeuille(null)}>Fermer</Button>
                <Button variant="default" className="bg-[#0055FF] text-white hover:bg-blue-600" onClick={() => window.alert("Génération du PDF de la feuille de maladie en cours...")}>Imprimer la feuille de maladie</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
