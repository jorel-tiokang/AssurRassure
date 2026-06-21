import { useState } from "react"
import { Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { Search, ArrowRight, Loader2 } from "lucide-react"
import { formatDate } from "../../lib/formatters"
import { useAuthStore } from "../../lib/authStore"
import { consultationService } from "../../lib/services/consultationService"
import { assureService } from "../../lib/services/assureService"

const getAge = (dateNaissance: string) => {
  const today = new Date()
  const birth = new Date(dateNaissance)
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
  return age
}

export function PatientsListPage() {
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState("")

  const { data: consultations = [], isLoading: isLoadingConsultations } = useQuery({
    queryKey: ['consultations'],
    queryFn: () => consultationService.getConsultations()
  })

  const { data: assures = [], isLoading: isLoadingAssures } = useQuery({
    queryKey: ['assures'],
    queryFn: () => assureService.getAssures()
  })

  const doctorConsultations = consultations.filter(c => c.medecinId === user?.userId)
  
  // Get unique patients
  const patientIds = Array.from(new Set(doctorConsultations.map(c => c.patientId)))
  
  const patients = patientIds.map(patientId => {
    const assure = assures.find(a => a.id === patientId)
    const patientConsultations = doctorConsultations.filter(c => c.patientId === patientId)
    const lastConsultation = patientConsultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    return {
      id: patientId,
      nom: assure?.nom || "Inconnu",
      prenom: assure?.prenom || "",
      nss: assure?.nss || "-",
      age: assure?.dateNaissance ? getAge(assure.dateNaissance) : "?",
      sexe: assure?.sexe || "?",
      derniereConsultation: lastConsultation?.date
    }
  })

  const filteredPatients = patients.filter(p => 
    `${p.nom} ${p.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.nss.includes(searchTerm)
  )

  const isLoading = isLoadingConsultations || isLoadingAssures

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Mes Patients</h1>
          <p className="text-ink-muted mt-1">Gérez votre file active et accédez aux dossiers médicaux.</p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 shadow-sm">
        <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-zinc-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <Input 
              placeholder="Rechercher par nom, prénom ou NSS..." 
              className="pl-10 h-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-ink-muted uppercase bg-zinc-50 border-b border-ink/10">
              <tr>
                <th className="px-6 py-4 font-medium">Patient</th>
                <th className="px-6 py-4 font-medium">NSS</th>
                <th className="px-6 py-4 font-medium">Âge / Sexe</th>
                <th className="px-6 py-4 font-medium">Dernière Consultation</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink-muted">
                    <Loader2 className="h-6 w-6 animate-spin text-[#0055FF] mx-auto mb-2" />
                    Chargement de vos patients...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink-muted">
                    Aucun patient trouvé.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-[#0055FF] flex items-center justify-center font-medium">
                          {patient.nom[0]}{(patient.prenom && patient.prenom[0]) ? patient.prenom[0] : ""}
                        </div>
                        <div className="font-medium text-ink">{patient.nom} {patient.prenom}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-ink-muted text-xs">{patient.nss}</td>
                    <td className="px-6 py-4 text-ink-muted">
                      {patient.age} ans, {patient.sexe}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {patient.derniereConsultation ? formatDate(patient.derniereConsultation) : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity text-[#0055FF] hover:bg-blue-50">
                        <Link to={`/medecin/patients/${patient.id}`}>
                          Voir le dossier <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
