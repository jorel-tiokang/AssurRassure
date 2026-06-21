import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link, useSearchParams } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle2, Stethoscope, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { assureService } from "../../lib/services/assureService"
import { medecinService } from "../../lib/services/medecinService"

interface LocationState {
  fromNouveauAssure?: boolean
  formValues?: Record<string, unknown>
}

export function AssignMedecinTraitantPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const state = (location.state || {}) as LocationState

  const fromNouveauAssure = state.fromNouveauAssure ?? false
  const savedFormValues = state.formValues ?? {}
  const preselectedAssureId = searchParams.get("assureId")

  const [selectedAssureId, setSelectedAssureId] = useState<number | "">(
    preselectedAssureId ? parseInt(preselectedAssureId) : ""
  )
  const [selectedMedecinId, setSelectedMedecinId] = useState<number | "">("")

  const { data: assures = [], isLoading: isLoadingAssures } = useQuery({
    queryKey: ['assures'],
    queryFn: () => assureService.getAssures(),
    enabled: !fromNouveauAssure
  })

  const { data: medecins = [], isLoading: isLoadingMedecins } = useQuery({
    queryKey: ['medecins'],
    queryFn: () => medecinService.getMedecins()
  })

  const assuresSansMedecin = assures.filter(a => !a.medecinTraitantId)
  const medecinsGeneralistes = medecins.filter(m => m.type === "GENERALISTE")

  const assignMutation = useMutation({
    mutationFn: ({ assureId, medecinId }: { assureId: number, medecinId: number }) =>
      assureService.updateAssure(assureId, { medecinTraitantId: medecinId }),
    onSuccess: () => {
      toast.success("Médecin assigné avec succès")
      queryClient.invalidateQueries({ queryKey: ['assures'] })
      navigate("/agent/assures")
    },
    onError: () => {
      toast.error("Erreur lors de l'assignation du médecin")
    }
  })

  const selectedMedecin = medecinsGeneralistes.find(m => m.id === selectedMedecinId) ?? null
  const canSubmit = fromNouveauAssure
    ? selectedMedecinId !== ""
    : selectedAssureId !== "" && selectedMedecinId !== ""

  const handleAssign = () => {
    if (!canSubmit) return

    if (fromNouveauAssure && selectedMedecin) {
      navigate("/agent/assures/nouveau", {
        state: {
          formValues: savedFormValues,
          assignedMedecin: selectedMedecin,
        },
      })
    } else if (typeof selectedAssureId === "number" && typeof selectedMedecinId === "number") {
      assignMutation.mutate({ assureId: selectedAssureId, medecinId: selectedMedecinId })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        {fromNouveauAssure ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-ink-muted hover:text-ink"
            onClick={() => navigate("/agent/assures/nouveau", { state: { formValues: savedFormValues } })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" asChild className="text-ink-muted hover:text-ink">
            <Link to="/agent/assures">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Assigner un Médecin Traitant</h1>
          <p className="text-ink-muted mt-1">
            {fromNouveauAssure
              ? "Sélectionnez le médecin généraliste pour le nouvel assuré."
              : "Assignez un médecin traitant à un assuré sans médecin."}
          </p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Assuré selection — only if not coming from nouvel assure */}
        {!fromNouveauAssure && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-ink">
              Assuré concerné <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-ink-muted -mt-1">Seuls les assurés sans médecin traitant sont listés.</p>
            <select
              value={selectedAssureId}
              onChange={e => setSelectedAssureId(e.target.value === "" ? "" : parseInt(e.target.value))}
              className="flex h-12 w-full bg-zinc-50 border border-ink/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF] focus-visible:border-transparent transition-all"
              disabled={isLoadingAssures}
            >
              <option value="">{isLoadingAssures ? "Chargement..." : "-- Sélectionner un assuré --"}</option>
              {assuresSansMedecin.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nom} {a.prenom} — NSS: {a.nss}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Médecin selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-ink">
            Médecin Généraliste <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {isLoadingMedecins ? (
               <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-[#0055FF]" /></div>
            ) : medecinsGeneralistes.length === 0 ? (
               <p className="text-sm text-ink-muted">Aucun médecin généraliste disponible.</p>
            ) : (
              medecinsGeneralistes.map(medecin => (
                <button
                  key={medecin.id}
                  type="button"
                  onClick={() => setSelectedMedecinId(medecin.id)}
                  className={`w-full flex items-center gap-4 p-4 border-2 transition-all text-left ${
                    selectedMedecinId === medecin.id
                      ? "border-[#0055FF] bg-blue-50/60"
                      : "border-ink/10 hover:border-ink/30"
                  }`}
                >
                  <div className={`h-10 w-10 flex items-center justify-center flex-shrink-0 ${
                    selectedMedecinId === medecin.id ? "bg-[#0055FF] text-white" : "bg-zinc-100 text-ink-muted"
                  }`}>
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${selectedMedecinId === medecin.id ? "text-[#0055FF]" : "text-ink"}`}>
                      Dr. {medecin.nom} {medecin.prenom}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">{medecin.clinique}</div>
                  </div>
                  {selectedMedecinId === medecin.id && (
                    <CheckCircle2 className="h-5 w-5 text-[#0055FF] flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <Button
          variant="accent"
          className="w-full h-12"
          disabled={!canSubmit || assignMutation.isPending}
          onClick={handleAssign}
        >
          {assignMutation.isPending ? "Assignation en cours..." : "Assigner le médecin traitant"}
        </Button>
      </div>
    </div>
  )
}
