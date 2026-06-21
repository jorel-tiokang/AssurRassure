import { useParams, Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Activity, FileText, Pill, Plus, User, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { assureService } from "../../lib/services/assureService"
import { consultationService } from "../../lib/services/consultationService"
import { formatDate } from "../../lib/formatters"

const getAge = (dateNaissance: string) => {
  const today = new Date()
  const birth = new Date(dateNaissance)
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
  return age
}

export function PatientDossierPage() {
  const { id } = useParams()
  const patientId = id ? parseInt(id, 10) : 0

  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['assure', patientId],
    queryFn: () => assureService.getAssureById(patientId),
    enabled: !!patientId
  })

  const { data: consultations = [], isLoading: isLoadingConsultations } = useQuery({
    queryKey: ['consultations-patient', patientId],
    queryFn: () => consultationService.getConsultationsPatient(patientId),
    enabled: !!patientId
  })

  if (isLoadingPatient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#0055FF]" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-ink-muted">Patient introuvable.</p>
        <Button variant="outline" asChild>
          <Link to="/medecin/patients">Retour à la liste</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="text-ink-muted hover:text-ink">
            <Link to="/medecin/patients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-display font-medium text-ink">
              Dossier de {patient.nom} {patient.prenom}
            </h1>
            <p className="text-ink-muted mt-1 font-mono text-sm">NSS: {patient.nss}</p>
          </div>
        </div>
        <Button asChild variant="accent">
          <Link to={`/medecin/consultations/nouvelle?patientNss=${patient.nss}`}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Consultation
          </Link>
        </Button>
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
                <span className="text-ink-muted">Âge</span>
                <span className="font-medium">{patient.dateNaissance ? getAge(patient.dateNaissance) : "?"} ans</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Sexe</span>
                <span className="font-medium">{patient.sexe === 'M' ? 'Masculin' : patient.sexe === 'F' ? 'Féminin' : patient.sexe}</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Taille / Poids</span>
                <span className="font-medium">{patient.taille ? `${patient.taille} cm` : "-"} / {patient.poids ? `${patient.poids} kg` : "-"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" /> Profil Médical
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-ink-muted block mb-1">Allergies connues</span>
                {patient.allergies ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.split(',').map((a: string) => (
                      <span key={a.trim()} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-sm text-xs">{a.trim()}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-ink">Aucune allergie renseignée</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0055FF]" /> Historique des Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingConsultations ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-[#0055FF]" /></div>
                ) : consultations.length === 0 ? (
                  <p className="text-sm text-ink-muted text-center py-4">Aucune consultation enregistrée.</p>
                ) : (
                  consultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(consultation => (
                    <div key={consultation.id} className="border border-ink/10 p-4 rounded-sm hover:border-[#0055FF]/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-ink">Consultation #{consultation.id}</h4>
                        <span className="text-xs text-ink-muted">{formatDate(consultation.date)}</span>
                      </div>
                      <p className="text-sm text-ink mb-1"><span className="text-ink-muted">Symptômes:</span> {consultation.symptome}</p>
                      <p className="text-sm text-ink mb-3"><span className="text-ink-muted">Diagnostic:</span> {consultation.diagnostic}</p>
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

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
