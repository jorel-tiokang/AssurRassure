import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Pencil, Save, X, Info, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { tarifService, Tarifs } from "../../lib/services/tarifService"

interface TarifUI {
  id: "generaliste" | "specialiste"
  label: string
  description: string
  montant: number
}

const getTarifsUI = (data: Tarifs | undefined): TarifUI[] => {
  if (!data) return [];
  return [
    {
      id: "generaliste",
      label: "Consultation Généraliste",
      description: "Prix fixe d'une consultation chez un médecin généraliste agréé.",
      montant: data.generaliste || 0,
    },
    {
      id: "specialiste",
      label: "Consultation Spécialiste",
      description: "Prix fixe d'une consultation chez un médecin spécialiste agréé.",
      montant: data.specialiste || 0,
    },
  ];
}

export function TarifsListPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")

  const { data: tarifsData, isLoading, isError } = useQuery({
    queryKey: ['tarifs'],
    queryFn: () => tarifService.getTarifs()
  })

  const tarifs = getTarifsUI(tarifsData)

  const updateMutation = useMutation({
    mutationFn: (newTarifs: Tarifs) => tarifService.updateTarifs(newTarifs),
    onSuccess: () => {
      toast.success("Tarif mis à jour avec succès")
      queryClient.invalidateQueries({ queryKey: ['tarifs'] })
      setEditingId(null)
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du tarif")
    }
  })

  const startEdit = (tarif: TarifUI) => {
    setEditingId(tarif.id)
    setEditValue(tarif.montant.toString())
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const saveEdit = (id: "generaliste" | "specialiste") => {
    if (!tarifsData) return;
    const parsed = parseInt(editValue.replace(/\s/g, ""), 10)
    if (!isNaN(parsed) && parsed > 0) {
      updateMutation.mutate({
        ...tarifsData,
        [id]: parsed
      })
    } else {
      setEditingId(null)
    }
  }

  const formatFCFA = (n: number) =>
    new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(n) + " FCFA"

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-medium text-ink">Tarifs de Consultation</h1>
        <p className="text-ink-muted mt-1">
          Deux coûts fixes réglementent les remboursements de consultations dans le système.
        </p>
      </div>

      <div className="bg-blue-50/50 border border-[#0055FF]/20 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-[#0055FF] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-ink-muted">
          Ces tarifs sont utilisés pour calculer le montant de remboursement de chaque Feuille de Maladie.
          Toute modification s'applique aux nouvelles feuilles de maladie uniquement.
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#0055FF]" /></div>
        ) : isError ? (
          <div className="text-center text-red-600 py-12">Erreur lors du chargement des tarifs.</div>
        ) : tarifs.map(tarif => (
          <div key={tarif.id} className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-display font-medium text-ink">{tarif.label}</h2>
                <p className="text-sm text-ink-muted mt-1">{tarif.description}</p>
              </div>

              {editingId === tarif.id ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="w-36 h-10 pr-14 font-mono text-right"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === "Enter") saveEdit(tarif.id)
                        if (e.key === "Escape") cancelEdit()
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted pointer-events-none">FCFA</span>
                  </div>
                  <Button
                    variant="accent"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => saveEdit(tarif.id)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-ink-muted"
                    onClick={cancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-display font-bold text-[#0055FF]">
                      {formatFCFA(tarif.montant)}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">par consultation</div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 text-ink-muted hover:text-ink"
                    onClick={() => startEdit(tarif)}
                    title="Modifier le tarif"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-ink/5 grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4">
                <p className="text-xs text-ink-muted uppercase tracking-wide font-medium mb-1">Taux de remboursement CAM-SANTE</p>
                <p className="text-lg font-mono font-medium text-ink">{tarif.id === 'generaliste' ? '100%' : '80%'}</p>
              </div>
              <div className="bg-zinc-50 p-4">
                <p className="text-xs text-ink-muted uppercase tracking-wide font-medium mb-1">Part assurée à rembourser</p>
                <p className="text-lg font-mono font-medium text-[#0055FF]">{formatFCFA(Math.round(tarif.montant * (tarif.id === 'generaliste' ? 1.0 : 0.8)))}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
