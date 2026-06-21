import { useState } from "react"
import { useNavigate, Link, useSearchParams } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft, Save, Plus, X, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { useAuthStore } from "../../lib/authStore"
import { assureService } from "../../lib/services/assureService"
import { medecinService } from "../../lib/services/medecinService"
import { tarifService } from "../../lib/services/tarifService"
import { consultationService } from "../../lib/services/consultationService"

const MOCK_SPECIALITES = ["Cardiologie", "Pédiatrie", "Gynécologie-Obstétrique"]

export function ConsultationFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  
  const patientNss = searchParams.get("patientNss")

  const { data: assures = [], isLoading: isLoadingAssures } = useQuery({
    queryKey: ['assures'],
    queryFn: () => assureService.getAssures()
  })

  const { data: medecins = [] } = useQuery({
    queryKey: ['medecins'],
    queryFn: () => medecinService.getMedecins()
  })

  const { data: tarifs } = useQuery({
    queryKey: ['tarifs'],
    queryFn: () => tarifService.getTarifs()
  })

  const initialPatient = assures.find(p => p.nss === patientNss)

  const [selectedPatientId, setSelectedPatientId] = useState<number | "">(initialPatient ? initialPatient.id : "")
  const [symptome, setSymptome] = useState("")
  const [diagnostic, setDiagnostic] = useState("")
  
  const [medicaments, setMedicaments] = useState("")
  const [showMedicamentsModal, setShowMedicamentsModal] = useState(false)
  const [tempMedicaments, setTempMedicaments] = useState("")
  
  const [prescriptionSpecialiste, setPrescriptionSpecialiste] = useState<{ specialite: string, medecin: string } | null>(null)
  const [showSpecialisteModal, setShowSpecialisteModal] = useState(false)
  const [tempSpecialite, setTempSpecialite] = useState("")
  const [tempMedecinSpec, setTempMedecinSpec] = useState("")

  const [showPreview, setShowPreview] = useState(false)

  const selectedPatient = assures.find(p => p.id === selectedPatientId)
  
  // Calculate default montant based on doctor identifiant if it contains 'S' for specialist
  const currentDoctor = medecins.find(m => m.id === user?.userId)
  const isSpecialisteDoctor = currentDoctor?.identifiant?.includes('S') || false
  const montantSoins = tarifs ? (isSpecialisteDoctor ? tarifs.specialiste : tarifs.generaliste) : 0

  const handleMedicamentsOk = () => {
    setMedicaments(tempMedicaments)
    setShowMedicamentsModal(false)
  }

  const handleSpecialisteOk = () => {
    if (tempSpecialite && tempMedecinSpec) {
      setPrescriptionSpecialiste({ specialite: tempSpecialite, medecin: tempMedecinSpec })
    }
    setShowSpecialisteModal(false)
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user?.userId || !selectedPatientId) throw new Error("Missing data")
      
      const fullDiagnostic = `${diagnostic}
${medicaments ? `\nPrescription Médicamenteuse:\n${medicaments}` : ''}
${prescriptionSpecialiste ? `\nOrientation Spécialiste:\nSpécialité: ${prescriptionSpecialiste.specialite}\nMédecin: ${prescriptionSpecialiste.medecin}` : ''}`.trim()

      return consultationService.createConsultation({
        date: new Date().toISOString(),
        symptome,
        diagnostic: fullDiagnostic,
        patientId: selectedPatientId as number,
        medecinId: user.userId,
        montantSoins
      })
    },
    onSuccess: () => {
      toast.success("Consultation enregistrée avec succès")
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      queryClient.invalidateQueries({ queryKey: ['consultations-patient'] })
      navigate("/medecin")
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement de la consultation")
    }
  })

  const handleValidation = () => {
    createMutation.mutate()
  }

  if (showPreview) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Aperçu de la consultation</h1>
          <p className="text-ink-muted mt-1">Veuillez vérifier les informations avant de valider.</p>
        </div>

        <div className="bg-white border border-ink/10 shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-ink-muted uppercase font-medium">Patient</p>
              <p className="font-medium text-ink">{selectedPatient?.nom}</p>
              <p className="font-mono text-xs text-ink-muted">NSS: {selectedPatient?.nss}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted uppercase font-medium">Date</p>
              <p className="font-medium text-ink">{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-ink-muted uppercase font-medium mb-1">Symptômes</p>
              <p className="text-ink whitespace-pre-wrap bg-zinc-50 p-4">{symptome}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted uppercase font-medium mb-1">Diagnostic</p>
              <p className="text-ink whitespace-pre-wrap bg-zinc-50 p-4">{diagnostic}</p>
            </div>
          </div>

          {medicaments && (
            <div>
              <p className="text-xs text-ink-muted uppercase font-medium mb-1">Prescription Médicamenteuse</p>
              <p className="text-ink whitespace-pre-wrap bg-zinc-50 p-4">{medicaments}</p>
            </div>
          )}

          {prescriptionSpecialiste && (
            <div>
              <p className="text-xs text-ink-muted uppercase font-medium mb-1">Orientation Spécialiste</p>
              <div className="bg-zinc-50 p-4">
                <p className="font-medium text-ink">{prescriptionSpecialiste.specialite}</p>
                <p className="text-ink-muted">Médecin recommandé : {prescriptionSpecialiste.medecin}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setShowPreview(false)} disabled={createMutation.isPending}>Annuler et modifier</Button>
          <Button variant="accent" className="bg-[#0055FF] text-white hover:bg-blue-600" onClick={handleValidation} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Enregistrement..." : "Valider la consultation"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-ink-muted hover:text-ink">
          <Link to="/medecin/consultations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Effectuer une consultation</h1>
          <p className="text-ink-muted mt-1">Saisie de l'acte médical et des prescriptions.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-display font-medium mb-6 pb-2 border-b border-ink/5">1. Sélection du Patient</h2>
          
          {isLoadingAssures ? (
            <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-[#0055FF]" /></div>
          ) : assures.length === 0 ? (
            <div className="p-4 bg-amber-50 text-amber-800 text-sm">
              Vous n'avez aucun patient dans votre liste pour le moment.
            </div>
          ) : (
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-medium text-ink">Patient <span className="text-red-500">*</span></label>
              <select 
                className="w-full h-10 px-3 border border-ink/20 focus:outline-none focus:ring-2 focus:ring-[#0055FF] bg-white"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value ? parseInt(e.target.value, 10) : "")}
              >
                <option value="">Sélectionner un patient...</option>
                {assures.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nom} {p.prenom} (NSS: {p.nss})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className={`bg-white border border-ink/10 shadow-sm p-6 sm:p-8 transition-opacity ${!selectedPatientId ? "opacity-50 pointer-events-none" : ""}`}>
          <h2 className="text-lg font-display font-medium mb-6 pb-2 border-b border-ink/5">2. Compte-rendu Médical</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Symptômes <span className="text-red-500">*</span></label>
              <textarea 
                value={symptome}
                onChange={e => setSymptome(e.target.value)}
                placeholder="Décrivez les symptômes du patient..."
                className="flex min-h-[100px] w-full border border-ink/20 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF] resize-y"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Diagnostic détaillé <span className="text-red-500">*</span></label>
              <textarea 
                value={diagnostic}
                onChange={e => setDiagnostic(e.target.value)}
                placeholder="Rédigez votre diagnostic ici..."
                className="flex min-h-[150px] w-full border border-ink/20 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF] resize-y"
              />
            </div>

            <div className="pt-4 space-y-4">
              <h3 className="text-sm font-medium text-ink">Actions optionnelles</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTempMedicaments(medicaments)
                    setShowMedicamentsModal(true)
                  }}
                  className={medicaments ? "border-[#0055FF] text-[#0055FF]" : ""}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Prescrire médicaments
                  {medicaments && <span className="ml-2 bg-[#0055FF] text-white rounded-full px-2 text-xs">Ajouté</span>}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (prescriptionSpecialiste) {
                      setTempSpecialite(prescriptionSpecialiste.specialite)
                      setTempMedecinSpec(prescriptionSpecialiste.medecin)
                    } else {
                      setTempSpecialite("")
                      setTempMedecinSpec("")
                    }
                    setShowSpecialisteModal(true)
                  }}
                  className={prescriptionSpecialiste ? "border-[#0055FF] text-[#0055FF]" : ""}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Prescrire une consultation chez un spécialiste
                  {prescriptionSpecialiste && <span className="ml-2 bg-[#0055FF] text-white rounded-full px-2 text-xs">Ajouté</span>}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/medecin/consultations">Annuler</Link>
          </Button>
          <Button 
            type="button" 
            variant="accent" 
            className="bg-[#0055FF] text-white hover:bg-blue-600"
            disabled={!selectedPatientId || !symptome.trim() || !diagnostic.trim()}
            onClick={() => setShowPreview(true)}
          >
            Aperçu de la consultation
          </Button>
        </div>
      </div>

      {/* Medicaments Modal */}
      <Dialog open={showMedicamentsModal} onOpenChange={setShowMedicamentsModal}>
        <DialogContent className="bg-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Prescription de médicaments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <textarea 
              value={tempMedicaments}
              onChange={e => setTempMedicaments(e.target.value)}
              placeholder="Ex: Paracétamol 500mg, 1 comprimé matin, midi et soir pendant 3 jours..."
              className="flex min-h-[150px] w-full border border-ink/20 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF] resize-y"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowMedicamentsModal(false)}>Annuler</Button>
              <Button className="bg-[#0055FF] text-white hover:bg-blue-600" onClick={handleMedicamentsOk}>OK</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Specialiste Modal */}
      <Dialog open={showSpecialisteModal} onOpenChange={setShowSpecialisteModal}>
        <DialogContent className="bg-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Orientation vers un spécialiste</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Spécialité recherchée</label>
              <select 
                className="w-full h-10 px-3 border border-ink/20 focus:outline-none focus:ring-2 focus:ring-[#0055FF] bg-white"
                value={tempSpecialite}
                onChange={(e) => {
                  setTempSpecialite(e.target.value)
                  setTempMedecinSpec("")
                }}
              >
                <option value="">Sélectionner une spécialité...</option>
                {MOCK_SPECIALITES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {tempSpecialite && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Médecin Spécialiste (Optionnel)</label>
                <select 
                  className="w-full h-10 px-3 border border-ink/20 focus:outline-none focus:ring-2 focus:ring-[#0055FF] bg-white"
                  value={tempMedecinSpec}
                  onChange={(e) => setTempMedecinSpec(e.target.value)}
                >
                  <option value="">Médecin au choix...</option>
                  {medecins.filter(m => m.identifiant?.includes('S') || m.clinique?.toLowerCase().includes(tempSpecialite.toLowerCase())).map(m => (
                    <option key={m.id} value={m.nom}>Dr. {m.nom} {m.prenom}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4 border-t border-ink/10">
              <Button variant="outline" onClick={() => setShowSpecialisteModal(false)}>Annuler</Button>
              <Button 
                className="bg-[#0055FF] text-white hover:bg-blue-600" 
                onClick={handleSpecialisteOk}
                disabled={!tempSpecialite}
              >
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
