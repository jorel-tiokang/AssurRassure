import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "../../components/ui/button"
import { Printer, FileText, Loader2 } from "lucide-react"
import { feuilleMaladieService } from "../../lib/services/feuilleMaladieService"

export function ImprimerFeuilleMaladiePage() {
  const [selectedFeuilleId, setSelectedFeuilleId] = useState<number | "">("")
  const [isDownloading, setIsDownloading] = useState(false)

  const { data: feuilles = [], isLoading } = useQuery({
    queryKey: ['feuilles'],
    queryFn: () => feuilleMaladieService.getFeuilles()
  })

  const handlePrint = async () => {
    if (selectedFeuilleId === "") return
    try {
      setIsDownloading(true)
      const blob = await feuilleMaladieService.getFacturePdf(selectedFeuilleId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `feuille_maladie_${selectedFeuilleId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success("Téléchargement lancé")
    } catch (e) {
      toast.error("Erreur lors du téléchargement du PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-medium text-ink">Imprimer une feuille de maladie</h1>
        <p className="text-ink-muted mt-1">Sélectionnez la feuille de maladie que vous souhaitez imprimer.</p>
      </div>

      <div className="bg-white border border-ink/10 shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">Feuille de Maladie</label>
          <select 
            className="w-full h-10 px-3 border border-ink/20 focus:outline-none focus:ring-2 focus:ring-[#0055FF] bg-white"
            value={selectedFeuilleId}
            onChange={(e) => setSelectedFeuilleId(e.target.value === "" ? "" : parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="">{isLoading ? "Chargement..." : "Sélectionner une feuille..."}</option>
            {feuilles.map(f => (
              <option key={f.id} value={f.id}>FM-{f.id} (Consultation #{f.consultationId}) - {f.statut}</option>
            ))}
          </select>
        </div>

        {selectedFeuilleId !== "" && (
          <div className="pt-4 space-y-4 animate-in fade-in">
            <div className="h-64 border border-ink/10 bg-zinc-50 flex flex-col items-center justify-center text-ink-muted">
              <FileText className="h-12 w-12 mb-2 opacity-50" />
              <p>Aperçu du document PDF</p>
              <p className="text-xs">FM-{selectedFeuilleId}</p>
            </div>
            
            <Button 
              className="w-full gap-2 bg-[#0055FF] text-white hover:bg-blue-600"
              onClick={handlePrint}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4" />
                  Télécharger le PDF
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
