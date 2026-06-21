import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { FileText, Users, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { formatDate } from "../../lib/formatters"
import { useAuthStore } from "../../lib/authStore"
import { consultationService } from "../../lib/services/consultationService"
import { assureService } from "../../lib/services/assureService"

export function MedecinDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

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

  const uniquePatients = new Set(doctorConsultations.map(c => c.patientId)).size
  const totalConsultations = doctorConsultations.length

  const getPatientName = (patientId: number) => {
    const assure = assures.find(a => a.id === patientId)
    if (!assure) return `Patient #${patientId}`
    return `${assure.nom} ${assure.prenom}`
  }
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-[#0055FF] text-white border-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80">Consultations du mois</CardDescription>
            <CardTitle className="text-4xl text-white">{isLoadingConsultations ? "-" : totalConsultations}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Users className="h-4 w-4" />
              <span>Depuis l'inscription</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Consultations effectuées</CardDescription>
            <CardTitle className="text-3xl text-ink">{isLoadingConsultations ? "-" : totalConsultations}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>100% digitalisées</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Patients Uniques</CardDescription>
            <CardTitle className="text-3xl text-ink">{isLoadingConsultations ? "-" : uniquePatients}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <Users className="h-4 w-4" />
              <span>File active totale</span>
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Dernières consultations</CardTitle>
            <CardDescription>Historique récent de vos actes médicaux enregistrés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-ink-muted uppercase bg-zinc-50 border-b border-ink/5">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Diagnostic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {isLoadingConsultations || isLoadingAssures ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0055FF] mx-auto" />
                        <p className="text-sm text-ink-muted mt-2">Chargement...</p>
                      </td>
                    </tr>
                  ) : doctorConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-ink-muted">
                        Aucune consultation récente.
                      </td>
                    </tr>
                  ) : (
                    doctorConsultations.slice(0, 5).map((row) => (
                      <tr key={row.id} className="transition-colors">
                        <td className="px-4 py-4 text-ink-muted">{formatDate(row.date)}</td>
                        <td className="px-4 py-4 font-medium text-ink">{getPatientName(row.patientId)}</td>
                        <td className="px-4 py-4 truncate max-w-[200px]" title={row.diagnostic}>{row.diagnostic}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-50 border-transparent">
          <CardHeader>
            <CardTitle className="text-xl">Action Rapide</CardTitle>
            <CardDescription>Outils pour simplifier votre journée</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white border border-ink/10 shadow-sm rounded-sm hover:border-[#0055FF] transition-colors cursor-pointer group" onClick={() => navigate('/medecin/consultations/nouvelle')}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-50 text-[#0055FF] flex items-center justify-center group-hover:bg-[#0055FF] group-hover:text-white transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-ink">Effectuer une consultation</h4>
                  <p className="text-xs text-ink-muted">Créer une nouvelle consultation</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-ink/10 shadow-sm rounded-sm hover:border-ink transition-colors cursor-pointer group" onClick={() => navigate('/medecin/patients')}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-zinc-100 text-ink flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-ink">Mes Patients</h4>
                  <p className="text-xs text-ink-muted">Consulter votre file active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
