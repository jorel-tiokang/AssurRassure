import { useState } from "react"
import { Link } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { ConfirmDialog } from "../../components/shared/ConfirmDialog"
import { Plus, Search, Eye, Trash2, Filter, X, Loader2 } from "lucide-react"
import { medecinService, Medecin } from "../../lib/services/medecinService"

interface Filters {
  specialite: string
  clinique: string
}

export function MedecinsListPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Filters>({ specialite: "", clinique: "" })
  const [showFilters, setShowFilters] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Medecin | null>(null)

  const { data: medecins = [], isLoading, isError } = useQuery({
    queryKey: ['medecins'],
    queryFn: () => medecinService.getMedecins()
  })

  const ALL_SPECIALITES = Array.from(new Set(medecins.map(m => m.specialite))).filter(Boolean)
  const ALL_CLINIQUES = Array.from(new Set(medecins.map(m => m.clinique))).filter(Boolean)

  const deleteMutation = useMutation({
    mutationFn: (id: number) => medecinService.deleteMedecin(id),
    onSuccess: () => {
      toast.success("Médecin supprimé avec succès")
      queryClient.invalidateQueries({ queryKey: ['medecins'] })
      setDeleteTarget(null)
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du médecin")
      setDeleteTarget(null)
    }
  })

  const activeFilterCount = [filters.specialite, filters.clinique].filter(Boolean).length

  const filtered = medecins.filter(m => {
    const matchSearch =
      m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.specialite && m.specialite.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.identifiant.includes(searchTerm)
    const matchSpecialite = !filters.specialite || m.specialite === filters.specialite
    const matchClinique = !filters.clinique || m.clinique === filters.clinique
    return matchSearch && matchSpecialite && matchClinique
  })

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }

  const resetFilters = () => setFilters({ specialite: "", clinique: "" })

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Médecins</h1>
          <p className="text-ink-muted mt-1">Gérez le registre des praticiens agréés (Généralistes et Spécialistes).</p>
        </div>
        <Button asChild variant="accent">
          <Link to="/agent/medecins/nouveau">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Médecin
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-ink/10 shadow-sm">
        <div className="p-4 border-b border-ink/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-zinc-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input
              placeholder="Rechercher par nom, spécialité ou ID..."
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
            <div className="space-y-1 flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Spécialité</label>
              <select
                value={filters.specialite}
                onChange={e => setFilters(f => ({ ...f, specialite: e.target.value }))}
                className="flex h-10 w-full bg-white border border-ink/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF]"
              >
                <option value="">Toutes les spécialités</option>
                {ALL_SPECIALITES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1 flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Clinique / Hôpital</label>
              <select
                value={filters.clinique}
                onChange={e => setFilters(f => ({ ...f, clinique: e.target.value }))}
                className="flex h-10 w-full bg-white border border-ink/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF]"
              >
                <option value="">Toutes les cliniques</option>
                {ALL_CLINIQUES.map(c => <option key={c} value={c}>{c}</option>)}
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
                <th className="px-6 py-4 font-medium">Praticien</th>
                <th className="px-6 py-4 font-medium">Identifiants</th>
                <th className="px-6 py-4 font-medium">Spécialité / Type</th>
                <th className="px-6 py-4 font-medium">Clinique</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0055FF] mx-auto" />
                    <p className="text-sm text-ink-muted mt-2">Chargement des médecins...</p>
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
                    Aucun médecin trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((medecin) => (
                  <tr key={medecin.id} className="transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">Dr. {medecin.nom} {medecin.prenom}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-ink text-xs">{medecin.identifiant}</div>
                      <div className="font-mono text-ink-muted text-xs mt-1">RPPS: {medecin.rpps}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-ink">{medecin.specialite}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-sm text-[10px] font-medium tracking-wide ${medecin.type === "GENERALISTE" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                        }`}>
                        {medecin.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{medecin.clinique}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-[#0055FF] hover:text-[#0044CC] hover:bg-blue-50"
                          title="Voir le profil"
                        >
                          <Link to={`/agent/medecins/${medecin.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-ink-muted hover:text-red-600 hover:bg-red-50"
                          title="Supprimer"
                          onClick={() => setDeleteTarget(medecin)}
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
          <span>Affichage de {filtered.length} praticien(s) sur {medecins.length}</span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer ce médecin ?"
        description={`Vous êtes sur le point de supprimer le profil de Dr. ${deleteTarget?.nom} ${deleteTarget?.prenom} (${deleteTarget?.identifiant}). Cette action est irréversible.`}
        confirmText="Supprimer définitivement"
        isDestructive
      />
    </div>
  )
}
