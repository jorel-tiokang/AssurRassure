import { useState } from "react"
import { Link } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { ConfirmDialog } from "../../components/shared/ConfirmDialog"
import { Plus, Search, Eye, Trash2, Filter, X, Loader2 } from "lucide-react"
import { assureService, Assure } from "../../lib/services/assureService"

const MEDECINS_GENERALISTES = ["Dr. Abanda", "Dr. Kamga"]

const getAge = (dateNaissance: string) => {
  const today = new Date()
  const birth = new Date(dateNaissance)
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
  return age
}

interface Filters {
  ageMin: string
  ageMax: string
  medecinTraitant: string
}

export function AssuresListPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Filters>({ ageMin: "", ageMax: "", medecinTraitant: "" })
  const [showFilters, setShowFilters] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Assure | null>(null)

  // Fetching assures
  const { data: assures = [], isLoading, isError } = useQuery({
    queryKey: ['assures'],
    queryFn: () => assureService.getAssures()
  })

  // Mutation for deleting an assure
  const deleteMutation = useMutation({
    mutationFn: (id: number) => assureService.deleteAssure(id),
    onSuccess: () => {
      toast.success("Assuré supprimé avec succès")
      queryClient.invalidateQueries({ queryKey: ['assures'] })
      setDeleteTarget(null)
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'assuré")
      setDeleteTarget(null)
    }
  })

  const activeFilterCount = [filters.ageMin, filters.ageMax, filters.medecinTraitant].filter(Boolean).length

  const filtered = assures.filter(a => {
    const matchSearch =
      a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nss.includes(searchTerm)
    const age = getAge(a.dateNaissance)
    const matchAgeMin = !filters.ageMin || age >= parseInt(filters.ageMin)
    const matchAgeMax = !filters.ageMax || age <= parseInt(filters.ageMax)
    // Here medecinTraitantId is a number. Let's filter by its presence for "__aucun__"
    const matchMedecin =
      !filters.medecinTraitant ||
      (filters.medecinTraitant === "__aucun__" ? !a.medecinTraitantId : a.medecinTraitantId?.toString() === filters.medecinTraitant)
    return matchSearch && matchAgeMin && matchAgeMax && matchMedecin
  })

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }

  const resetFilters = () => setFilters({ ageMin: "", ageMax: "", medecinTraitant: "" })

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Assurés</h1>
          <p className="text-ink-muted mt-1">Gérez les dossiers des patients et leurs affectations.</p>
        </div>
        <Button asChild variant="accent">
          <Link to="/agent/assures/nouveau">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Assuré
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-ink/10 shadow-sm">
        <div className="p-4 border-b border-ink/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-zinc-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              placeholder="Rechercher par nom, prénom ou NSS..."
              className="pl-10 h-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <span className="ml-2 bg-[#0055FF] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="p-4 border-b border-ink/10 bg-blue-50/40 flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Âge minimum</label>
              <Input
                type="number"
                placeholder="Ex: 18"
                className="h-10 w-28"
                value={filters.ageMin}
                onChange={e => setFilters(f => ({ ...f, ageMin: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Âge maximum</label>
              <Input
                type="number"
                placeholder="Ex: 65"
                className="h-10 w-28"
                value={filters.ageMax}
                onChange={e => setFilters(f => ({ ...f, ageMax: e.target.value }))}
              />
            </div>
            <div className="space-y-1 flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Médecin Traitant</label>
              <select
                value={filters.medecinTraitant}
                onChange={e => setFilters(f => ({ ...f, medecinTraitant: e.target.value }))}
                className="flex h-10 w-full bg-white border border-ink/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF]"
              >
                <option value="">Tous</option>
                <option value="__aucun__">Sans médecin traitant</option>
                {MEDECINS_GENERALISTES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-ink-muted h-10">
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
                <th className="px-6 py-4 font-medium">Identité</th>
                <th className="px-6 py-4 font-medium">NSS</th>
                <th className="px-6 py-4 font-medium">Âge</th>
                <th className="px-6 py-4 font-medium">Médecin Traitant</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0055FF] mx-auto" />
                    <p className="text-sm text-ink-muted mt-2">Chargement des assurés...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-600">
                    Une erreur est survenue lors du chargement des données.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink-muted">
                    Aucun assuré trouvé correspondant à votre recherche.
                  </td>
                </tr>
              ) : (
                filtered.map((assure) => (
                  <tr key={assure.id} className="transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-ink">{assure.nom} {assure.prenom}</div>
                    <div className="text-xs text-ink-muted mt-0.5">{new Date(assure.dateNaissance).toLocaleDateString("fr-FR")}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-ink-muted">{assure.nss}</td>
                  <td className="px-6 py-4 text-ink">{getAge(assure.dateNaissance)} ans</td>
                  <td className="px-6 py-4">
                    {assure.medecinTraitantId ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-blue-50 text-blue-700">
                        Assigné (ID: {assure.medecinTraitantId})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-zinc-100 text-ink-muted">
                        Non assigné
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 text-[#0055FF] hover:text-[#0044CC] hover:bg-blue-50"
                        title="Voir le dossier"
                      >
                        <Link to={`/agent/assures/${assure.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-ink-muted hover:text-red-600 hover:bg-red-50"
                        title="Supprimer"
                        onClick={() => setDeleteTarget(assure)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-ink/10 bg-zinc-50 flex items-center justify-between text-sm text-ink-muted">
          <span>Affichage de {filtered.length} assuré(s) sur {assures.length}</span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer cet assuré ?"
        description={`Vous êtes sur le point de supprimer le dossier de ${deleteTarget?.nom} ${deleteTarget?.prenom} (NSS: ${deleteTarget?.nss}). Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        isDestructive
      />
    </div>
  )
}
