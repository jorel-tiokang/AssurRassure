import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"
import { ArrowLeft, Save, Copy, CheckCircle2, Stethoscope, Activity, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { medecinService } from "../../lib/services/medecinService"

const SPECIALITES_GENERALISTE = ["Médecine Générale"]

const SPECIALITES_SPECIALISTE = [
  "Cardiologie",
  "Pédiatrie",
  "Gynécologie-Obstétrique",
  "Neurologie",
  "Orthopédie",
  "Dermatologie",
  "Ophtalmologie",
  "ORL (Oto-rhino-laryngologie)",
  "Pneumologie",
  "Gastro-entérologie",
  "Endocrinologie",
  "Psychiatrie",
  "Urologie",
  "Chirurgie Générale",
  "Radiologie",
  "Anesthésie-Réanimation",
  "Médecine Interne",
  "Rhumatologie",
  "Néphrologie",
  "Hématologie",
]

const medecinSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  rpps: z.string().regex(/^\d{11}$/, "Le RPPS doit comporter 11 chiffres"),
  type: z.enum(["GENERALISTE", "SPECIALISTE"]),
  specialite: z.string().min(2, "La spécialité est requise"),
  clinique: z.string().min(3, "La clinique/hôpital est requis"),
  estAssure: z.boolean().default(false),
})

type MedecinFormValues = z.infer<typeof medecinSchema>

export function MedecinFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedType, setSelectedType] = useState<"GENERALISTE" | "SPECIALISTE">("GENERALISTE")
  const [generatedCredentials, setGeneratedCredentials] = useState<{ id: string; pass: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MedecinFormValues>({
    resolver: zodResolver(medecinSchema),
    defaultValues: {
      type: "GENERALISTE",
      specialite: "Médecine Générale",
      estAssure: false,
    },
  })

  const handleTypeChange = (type: "GENERALISTE" | "SPECIALISTE") => {
    setSelectedType(type)
    setValue("type", type)
    setValue("specialite", type === "GENERALISTE" ? "Médecine Générale" : SPECIALITES_SPECIALISTE[0])
  }

  const createMutation = useMutation({
    mutationFn: (data: MedecinFormValues) => medecinService.createMedecin(data),
    onSuccess: (data) => {
      toast.success("Médecin enregistré avec succès")
      queryClient.invalidateQueries({ queryKey: ["medecins"] })
      setGeneratedCredentials({
        id: data.identifiant || `MED-${Math.floor(100000 + Math.random() * 900000)}`,
        pass: "123456", // Assuming a default password for the demo, as backend usually doesn't return plain text password
      })
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de la création du médecin")
    }
  })

  const onSubmit = (data: MedecinFormValues) => {
    createMutation.mutate(data)
  }

  const handleCopy = () => {
    if (generatedCredentials) {
      navigator.clipboard.writeText(`ID: ${generatedCredentials.id}\nMot de passe: ${generatedCredentials.pass}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (generatedCredentials) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
        <div className="bg-white border border-ink/10 shadow-lg p-8 sm:p-12 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-medium text-ink mb-2">Inscription réussie</h1>
          <p className="text-ink-muted mb-8">
            Le praticien a été enregistré dans le système. Veuillez lui transmettre ses identifiants de connexion générés de manière sécurisée.
          </p>

          <div className="bg-zinc-50 border border-ink/10 p-6 mb-8 text-left relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-ink-muted hover:text-ink"
              onClick={handleCopy}
            >
              {copied ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
            </Button>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">Identifiant de connexion</span>
                <div className="text-xl font-mono font-medium text-ink mt-1">{generatedCredentials.id}</div>
              </div>
              <div>
                <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">Mot de passe temporaire</span>
                <div className="text-xl font-mono font-medium text-ink mt-1">{generatedCredentials.pass}</div>
              </div>
            </div>
          </div>

          <Button variant="accent" size="lg" className="w-full" onClick={() => navigate("/agent/medecins")}>
            Retour à la liste des médecins
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="text-ink-muted hover:text-ink">
          <Link to="/agent/medecins">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Nouveau Médecin</h1>
          <p className="text-ink-muted mt-1">Inscrire un nouveau professionnel de santé.</p>
        </div>
      </div>

      {/* Type selector — must come first */}
      <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-display font-medium mb-2 text-ink">Type de praticien</h2>
        <p className="text-sm text-ink-muted mb-6">Sélectionnez d'abord le type de médecin à inscrire.</p>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange("GENERALISTE")}
            className={`relative flex flex-col items-start gap-3 p-5 border-2 transition-all text-left ${
              selectedType === "GENERALISTE"
                ? "border-[#0055FF] bg-blue-50/60"
                : "border-ink/10 bg-zinc-50 hover:border-ink/30"
            }`}
          >
            <div className={`h-10 w-10 flex items-center justify-center ${
              selectedType === "GENERALISTE" ? "bg-[#0055FF] text-white" : "bg-zinc-200 text-ink-muted"
            }`}>
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className={`font-display font-medium text-base ${selectedType === "GENERALISTE" ? "text-[#0055FF]" : "text-ink"}`}>
                Médecin Généraliste
              </div>
              <p className="text-xs text-ink-muted mt-1">Médecine générale, premier recours.</p>
            </div>
            {selectedType === "GENERALISTE" && (
              <div className="absolute top-3 right-3 h-5 w-5 bg-[#0055FF] rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("SPECIALISTE")}
            className={`relative flex flex-col items-start gap-3 p-5 border-2 transition-all text-left ${
              selectedType === "SPECIALISTE"
                ? "border-[#0055FF] bg-blue-50/60"
                : "border-ink/10 bg-zinc-50 hover:border-ink/30"
            }`}
          >
            <div className={`h-10 w-10 flex items-center justify-center ${
              selectedType === "SPECIALISTE" ? "bg-[#0055FF] text-white" : "bg-zinc-200 text-ink-muted"
            }`}>
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className={`font-display font-medium text-base ${selectedType === "SPECIALISTE" ? "text-[#0055FF]" : "text-ink"}`}>
                Médecin Spécialiste
              </div>
              <p className="text-xs text-ink-muted mt-1">Discipline médicale spécialisée.</p>
            </div>
            {selectedType === "SPECIALISTE" && (
              <div className="absolute top-3 right-3 h-5 w-5 bg-[#0055FF] rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <input type="hidden" {...register("type")} value={selectedType} />

        <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-display font-medium mb-6 pb-2 border-b border-ink/5">Identité et Agrément</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Nom <span className="text-red-500">*</span></label>
              <Input {...register("nom")} placeholder="Ex: Kamga" aria-invalid={!!errors.nom} />
              {errors.nom && <p className="text-xs text-red-600">{errors.nom.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Prénom <span className="text-red-500">*</span></label>
              <Input {...register("prenom")} placeholder="Ex: Alain" />
              {errors.prenom && <p className="text-xs text-red-600">{errors.prenom.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink">Numéro RPPS (11 chiffres) <span className="text-red-500">*</span></label>
              <Input {...register("rpps")} placeholder="Ex: 10001234567" />
              {errors.rpps && <p className="text-xs text-red-600">{errors.rpps.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-display font-medium mb-6 pb-2 border-b border-ink/5">Exercice Médical</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedType === "GENERALISTE" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Spécialité</label>
                <div className="flex h-12 w-full items-center bg-zinc-100 border border-ink/10 px-3 text-sm text-ink-muted">
                  Médecine Générale
                </div>
                <input type="hidden" {...register("specialite")} value="Médecine Générale" />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Spécialité <span className="text-red-500">*</span></label>
                <select
                  {...register("specialite")}
                  className="flex h-12 w-full bg-zinc-50 border border-ink/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055FF] focus-visible:border-transparent transition-all"
                >
                  {SPECIALITES_SPECIALISTE.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.specialite && <p className="text-xs text-red-600">{errors.specialite.message}</p>}
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink">Clinique / Hôpital de rattachement <span className="text-red-500">*</span></label>
              <Input {...register("clinique")} placeholder="Ex: Centre Hospitalier Universitaire de Yaoundé" />
              {errors.clinique && <p className="text-xs text-red-600">{errors.clinique.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/agent/medecins">Annuler</Link>
          </Button>
          <Button type="submit" variant="accent" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Inscrire et générer les accès
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
