import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { CheckCircle2, FileText, Download, Loader2 } from "lucide-react"
import { assureService } from "../../lib/services/assureService"
import { feuilleMaladieService } from "../../lib/services/feuilleMaladieService"
import { tarifService } from "../../lib/services/tarifService"

export function EffectuerRemboursementPage() {
  const queryClient = useQueryClient()
  const [selectedAssureId, setSelectedAssureId] = useState<number | "">("")
  const [selectedFeuilles, setSelectedFeuilles] = useState<number[]>([])
  const [paymentMode, setPaymentMode] = useState<"CASH" | "VIREMENT" | "">("")
  const [compteBancaire, setCompteBancaire] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)

  const { data: assures = [] } = useQuery({
    queryKey: ['assures'],
    queryFn: () => assureService.getAssures()
  })

  const { data: feuilles = [], isLoading: isLoadingFeuilles } = useQuery({
    queryKey: ['feuilles-assure', selectedAssureId],
    queryFn: () => feuilleMaladieService.getFeuilles(selectedAssureId as number, "ENREGISTREE"),
    enabled: selectedAssureId !== ""
  })

  const { data: tarifs } = useQuery({
    queryKey: ['tarifs'],
    queryFn: () => tarifService.getTarifs()
  })

  const assureFeuilles = feuilles

  const handleToggleFeuille = (id: number) => {
    setSelectedFeuilles(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    )
  }

  const getTauxRemboursement = (montantSoins: number) => {
    if (!tarifs) return 0.8;
    // Simple heuristic: if montant == generaliste, rate is 100%, else 80%
    return montantSoins === tarifs.generaliste ? 1.0 : 0.8;
  }

  const calculateTotal = () => {
    return selectedFeuilles.reduce((total, id) => {
      const f = assureFeuilles.find(feuille => feuille.id === id)
      if (!f) return total
      const rate = getTauxRemboursement(f.montantSoins)
      return total + (f.montantSoins * rate)
    }, 0)
  }

  const rembourserMutation = useMutation({
    mutationFn: async () => {
      const promises = selectedFeuilles.map(id => {
        const feuille = assureFeuilles.find(f => f.id === id)
        if (!feuille) throw new Error("Feuille introuvable")
        return feuilleMaladieService.rembourser(feuille.consultationId, paymentMode as "CASH" | "VIREMENT", compteBancaire)
      })
      await Promise.all(promises)
    },
    onSuccess: () => {
      toast.success("Remboursement(s) enregistré(s) avec succès")
      queryClient.invalidateQueries({ queryKey: ['feuilles-assure'] })
      queryClient.invalidateQueries({ queryKey: ['feuilles'] })
      setIsCompleted(true)
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement du remboursement")
    }
  })

  const handlePayment = () => {
    if (paymentMode === "VIREMENT" && !compteBancaire) return
    rembourserMutation.mutate()
  }

  const formatFCFA = (n: number) => new Intl.NumberFormat("fr-CM").format(n) + " FCFA"

  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 p-8 bg-white border border-ink/10 shadow-sm text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-display font-medium text-ink">Feuille(s) de maladie complétée(s)</h2>
        <p className="text-ink-muted">Le remboursement a été enregistré avec succès.</p>
        
        <div className="pt-8">
          <Button variant="outline" className="gap-2" onClick={() => window.alert("Génération des PDFs en cours...")}>
            <Download className="h-4 w-4" />
            Imprimer le/les feuilles de maladies
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-medium text-ink">Effectuer un remboursement</h1>
        <p className="text-ink-muted mt-1">Sélectionnez un assuré et les feuilles de maladie à rembourser.</p>
      </div>

      <div className="bg-white border border-ink/10 p-6 space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Assuré</label>
          <select 
            className="w-full h-10 px-3 border border-ink/20 focus:outline-none focus:ring-2 focus:ring-[#0055FF] bg-white"
            value={selectedAssureId}
            onChange={(e) => {
              const id = e.target.value === "" ? "" : parseInt(e.target.value)
              setSelectedAssureId(id)
              setSelectedFeuilles([])
              if (id) {
                const assure = assures.find(a => a.id === id)
                if (assure && assure.numeroCompte) setCompteBancaire(assure.numeroCompte)
                else setCompteBancaire("")
              }
            }}
          >
            <option value="">Sélectionner un assuré...</option>
            {assures.map(a => (
              <option key={a.id} value={a.id}>{a.nom} {a.prenom} (NSS: {a.nss})</option>
            ))}
          </select>
        </div>

        {selectedAssureId !== "" && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-ink">Feuilles de maladie non-remboursées</h3>
            {isLoadingFeuilles ? (
               <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-[#0055FF]" /></div>
            ) : assureFeuilles.length === 0 ? (
              <div className="p-4 bg-amber-50 text-amber-800 text-sm">
                Cet assuré n'a aucune feuille de maladie en attente de remboursement.
              </div>
            ) : (
              <div className="space-y-2">
                {assureFeuilles.map(f => {
                  const rate = getTauxRemboursement(f.montantSoins)
                  return (
                    <label key={f.id} className="flex items-center gap-3 p-3 border border-ink/10 cursor-pointer hover:bg-zinc-50">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-[#0055FF] focus:ring-[#0055FF]"
                        checked={selectedFeuilles.includes(f.id)}
                        onChange={() => handleToggleFeuille(f.id)}
                      />
                      <div className="flex-1 flex justify-between">
                        <span className="font-medium text-ink">FM-{f.id} (Consultation #{f.consultationId})</span>
                        <span className="text-ink-muted">{rate * 100}% de {formatFCFA(f.montantSoins)}</span>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {selectedFeuilles.length > 0 && (
          <div className="pt-6 border-t border-ink/10 space-y-6 animate-in fade-in">
            <div className="bg-zinc-50 p-4 flex justify-between items-center">
              <span className="font-medium text-ink">Montant cumulé à rembourser :</span>
              <span className="text-2xl font-mono font-bold text-[#0055FF]">{formatFCFA(calculateTotal())}</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-ink">Mode de paiement</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMode" 
                    value="CASH" 
                    checked={paymentMode === "CASH"}
                    onChange={() => setPaymentMode("CASH")}
                    className="text-[#0055FF] focus:ring-[#0055FF]"
                  />
                  <span>Cash</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="paymentMode" 
                    value="VIREMENT" 
                    checked={paymentMode === "VIREMENT"}
                    onChange={() => setPaymentMode("VIREMENT")}
                    className="text-[#0055FF] focus:ring-[#0055FF]"
                  />
                  <span>Virement bancaire</span>
                </label>
              </div>

              {paymentMode === "VIREMENT" && (
                <div className="space-y-2 animate-in fade-in">
                  <label className="text-sm font-medium text-ink">Numéro de compte de destination</label>
                  <input 
                    type="text" 
                    placeholder="Ex: CM21 1000 1111 2222 3333 44" 
                    className="w-full h-10 px-3 border border-ink/20 focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                    value={compteBancaire}
                    onChange={e => setCompteBancaire(e.target.value)}
                  />
                </div>
              )}

              {paymentMode === "CASH" && (
                <div className="p-3 bg-blue-50 text-blue-800 text-sm">
                  Veuillez remettre l'argent à l'assuré avant de cliquer sur "Effectuer le paiement".
                </div>
              )}

              {paymentMode && (
                <Button 
                  className="w-full bg-[#0055FF] text-white hover:bg-blue-600" 
                  onClick={handlePayment}
                  disabled={(paymentMode === "VIREMENT" && !compteBancaire) || rembourserMutation.isPending}
                >
                  {rembourserMutation.isPending ? "Enregistrement en cours..." : "Effectuer le paiement"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
