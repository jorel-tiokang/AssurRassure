import { useState } from "react"
import { Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { Plus, Search, Eye, Download, Loader2 } from "lucide-react"
import { formatDate } from "../../lib/formatters"
import { useAuthStore } from "../../lib/authStore"
import { consultationService } from "../../lib/services/consultationService"
import { assureService } from "../../lib/services/assureService"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"

export function ConsultationsListPage() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const { data: consultations = [], isLoading: isLoadingConsultations } = useQuery({
    queryKey: ['consultations'],
    queryFn: () => consultationService.getConsultations()
  })

  const { data: assures = [], isLoading: isLoadingAssures } = useQuery({
    queryKey: ['assures'],
    queryFn: () => assureService.getAssures()
  })

  const doctorConsultations = consultations
    .filter(c => c.medecinId === user?.userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formattedConsultations = doctorConsultations.map(c => {
    const assure = assures.find(a => a.id === c.patientId)
    return {
      ...c,
      patient: assure ? `${assure.nom} ${assure.prenom}` : "Inconnu",
      nss: assure?.nss || "-",
      dateStr: c.date.split("T")[0] // For exact match filtering
    }
  })

  const activeFilterCount = filterDate ? 1 : 0

  const filteredConsultations = formattedConsultations.filter(c => {
    const matchSearch = c.patient.toLowerCase().includes(searchTerm.toLowerCase()) || String(c.id).includes(searchTerm)
    const matchDate = !filterDate || c.dateStr === filterDate
    return matchSearch && matchDate
  })

  const isLoading = isLoadingConsultations || isLoadingAssures

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Mes Consultations</h1>
          <p className="text-ink-muted mt-1">Historique des consultations effectuées.</p>
        </div>
        <Button asChild variant="accent">
          <Link to="/medecin/consultations/nouvelle">
            <Plus className="h-4 w-4 mr-2" />
            Effectuer une consultation
          </Link>
        </Button>
      </div>

      <div className="bg-white border border-ink/10 shadow-sm">
        <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-zinc-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input 
              placeholder="Rechercher par patient ou N° Consultation..."
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
            <Plus className="h-4 w-4 mr-2" />
            Filtrer
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-[#0055FF] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="p-4 border-b border-ink/10 bg-blue-50/40 flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="flex h-10 bg-white border border-ink/20 px-3 py-2 text-sm w-36"
              />
            </div>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setFilterDate("")} className="text-ink-muted h-10">
                Réinitialiser
              </Button>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-ink-muted uppercase bg-zinc-50 border-b border-ink/10">
              <tr>
                <th className="px-6 py-4 font-medium">N° Consultation</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-ink-muted">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0055FF] mx-auto mb-2" />
                    Chargement de vos consultations...
                  </td>
                </tr>
              ) : filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-ink-muted">
                    Aucune consultation trouvée.
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="transition-colors group">
                    <td className="px-6 py-4 font-mono text-ink-muted text-xs">Consultation #{consultation.id}</td>
                    <td className="px-6 py-4 text-ink-muted">{formatDate(consultation.date)}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-ink">{consultation.patient}</div>
                      <div className="text-xs text-ink-muted font-mono mt-0.5">NSS: {consultation.nss}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-ink-muted hover:text-ink" title="Voir les détails">
                          <Link to={`/medecin/patients/${consultation.patientId}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
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
          <span>Affichage de {filteredConsultations.length} élément(s)</span>
        </div>
      </div>
    </div>
  )
}
