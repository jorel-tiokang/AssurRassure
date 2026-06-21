import { useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"
import { ArrowLeft, Save, UserPlus, CheckCircle2, Stethoscope, Loader2 } from "lucide-react"
import { assureService } from "../../lib/services/assureService"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"

const assureSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nss: z.string().regex(/^\d{13}$/, "Le NSS doit comporter exactement 13 chiffres"),
  dateNaissance: z.string().min(1, "La date de naissance est requise"),
  adresse: z.string().min(5, "L'adresse doit être plus précise"),
  telephone: z.string().min(9, "Le numéro de téléphone est invalide"),
  groupeSanguin: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    message: "Veuillez sélectionner un groupe sanguin valide"
  }),
  allergies: z.string().optional(),
  taille: z.coerce.number().min(0.5, "Taille invalide").max(2.5, "Taille invalide"),
  poids: z.coerce.number().min(1, "Poids invalide").max(300, "Poids invalide"),
  numeroCompte: z.string().optional(),
})

type AssureFormValues = z.infer<typeof assureSchema>

interface LocationState {
  assignedMedecin?: { id: number; nom: string; prenom: string; specialite: string }
  formValues?: Partial<AssureFormValues>
}

export function AssureFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const state = (location.state || {}) as LocationState

  const assignedMedecin = state.assignedMedecin ?? null
  const savedFormValues = state.formValues ?? {}

  const { register, handleSubmit, reset, getValues, formState: { errors, isSubmitting } } = useForm<AssureFormValues>({
    resolver: zodResolver(assureSchema) as any,
    defaultValues: {
      groupeSanguin: "O+",
      ...savedFormValues,
    },
  })

  useEffect(() => {
    if (savedFormValues && Object.keys(savedFormValues).length > 0) {
      reset({ groupeSanguin: "O+", ...savedFormValues })
    }
  }, [])

  const createMutation = useMutation({
    mutationFn: (data: Omit<AssureFormValues, "id"> & { medecinTraitantId?: number }) =>
      assureService.createAssure(data as any),
    onSuccess: () => {
      toast.success("Assuré enregistré avec succès")
      queryClient.invalidateQueries({ queryKey: ["assures"] })
      navigate("/agent/assures")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Une erreur est survenue lors de la création")
    }
  })

  const onSubmit: SubmitHandler<AssureFormValues> = (data) => {
    createMutation.mutate({
      ...data,
      medecinTraitantId: assignedMedecin?.id
    })
  }

  const handleGoToAssignMedecin = () => {
    navigate("/agent/assures/medecin-traitant", {
      state: {
        fromNouveauAssure: true,
        formValues: getValues(),
      },
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-ink-muted hover:text-ink">
          <Link to="/agent/assures">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Nouvel Assuré</h1>
          <p className="text-ink-muted mt-1">Création d'une nouvelle fiche assuré dans le système.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-display font-medium mb-6 pb-2 border-b border-ink/5">État civil et Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Nom <span className="text-red-500">*</span></label>
              <Input {...register("nom")} placeholder="Ex: Mvondo" aria-invalid={!!errors.nom} />
              {errors.nom && <p className="text-xs text-red-600">{errors.nom.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Prénom <span className="text-red-500">*</span></label>
              <Input {...register("prenom")} placeholder="Ex: Jean" />
              {errors.prenom && <p className="text-xs text-red-600">{errors.prenom.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">NSS (13 chiffres) <span className="text-red-500">*</span></label>
              <Input {...register("nss")} placeholder="Ex: 1234567890123" />
              {errors.nss && <p className="text-xs text-red-600">{errors.nss.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Date de naissance <span className="text-red-500">*</span></label>
              <Input type="date" {...register("dateNaissance")} />
              {errors.dateNaissance && <p className="text-xs text-red-600">{errors.dateNaissance.message}</p>}
            </div>
            <div className="space-y-2 ">
              <label className="text-sm font-medium text-ink">Adresse <span className="text-red-500">*</span></label>
              <Input {...register("adresse")} placeholder="Ex: Quartier Bastos, Yaoundé" />
              {errors.adresse && <p className="text-xs text-red-600">{errors.adresse.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Téléphone <span className="text-red-500">*</span></label>
              <Input {...register("telephone")} placeholder="Ex: 6 90 00 00 00" />
              {errors.telephone && <p className="text-xs text-red-600">{errors.telephone.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-display font-medium mb-6 pb-2 border-b border-ink/5">Données Médicales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Groupe Sanguin <span className="text-red-500">*</span></label>
              <select
                {...register("groupeSanguin")}
                className="flex h-12 w-full bg-zinc-50 border border-ink/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF] focus-visible:border-transparent transition-all"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.groupeSanguin && <p className="text-xs text-red-600">{errors.groupeSanguin.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Taille (m) <span className="text-red-500">*</span></label>
              <Input type="number" step="0.01" {...register("taille")} placeholder="Ex: 1.75" />
              {errors.taille && <p className="text-xs text-red-600">{errors.taille.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Poids (kg) <span className="text-red-500">*</span></label>
              <Input type="number" step="0.1" {...register("poids")} placeholder="Ex: 70" />
              {errors.poids && <p className="text-xs text-red-600">{errors.poids.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm font-medium text-ink">Allergies connues</label>
              <Input {...register("allergies")} placeholder="Ex: Pénicilline, Arachides..." />
            </div>
          </div>
        </div>

        {/* Médecin Traitant section */}
        <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-display font-medium mb-2 text-ink">Médecin Traitant</h2>
          <p className="text-sm text-ink-muted mb-6">
            Vous pouvez assigner un médecin traitant (généraliste) à cet assuré maintenant ou le faire ultérieurement.
          </p>

          {assignedMedecin ? (
            <div className="bg-blue-50/60 border border-[#0055FF]/20 p-5 flex items-start gap-4">
              <div className="h-10 w-10 bg-[#0055FF] flex items-center justify-center flex-shrink-0">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-[#0055FF]" />
                  <span className="text-xs font-medium text-[#0055FF] uppercase tracking-wide">Médecin assigné</span>
                </div>
                <p className="font-display font-medium text-ink text-lg">
                  Dr. {assignedMedecin.nom} {assignedMedecin.prenom}
                </p>
                <p className="text-sm text-ink-muted">{assignedMedecin.specialite}</p>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleGoToAssignMedecin}
              className="border-dashed border-ink/30 hover:border-[#0055FF] hover:text-[#0055FF] h-14 w-full"
            >
              <UserPlus className="h-5 w-5 mr-3" />
              Assigner un médecin traitant
            </Button>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/agent/assures">Annuler</Link>
          </Button>
          <Button type="submit" variant="accent" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer l'assuré
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
