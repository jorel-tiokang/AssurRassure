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
    // Utilise la fonction d'impression native du navigateur (permet d'enregistrer en PDF)
    window.print();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-preview, #printable-preview * {
              visibility: visible;
            }
            #printable-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              border: none !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>
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
            {(() => {
              const selectedFeuille = feuilles.find(f => f.id === selectedFeuilleId);
              if (!selectedFeuille) return null;
              
              return (
                <div id="printable-preview" className="border border-ink/10 bg-white shadow-sm p-8 text-sm relative overflow-hidden group">
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#0055FF]"></div>
                  
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-6 w-6 bg-[#0055FF] rounded-sm flex items-center justify-center">
                          <span className="font-display font-bold text-xs text-white">A</span>
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight">AssurRassure</span>
                      </div>
                      <p className="text-ink-muted text-xs">Feuille de Soins Médicaux</p>
                    </div>
                    <div className="text-right">
                      <h2 className="font-medium text-lg text-ink">Référence: FM-{selectedFeuille.id}</h2>
                      <p className="text-ink-muted text-xs">
                        Date: {selectedFeuille.date ? new Date(selectedFeuille.date).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-medium text-ink border-b border-ink/10 pb-1 mb-2">Patient</h3>
                      <p className="font-medium">{selectedFeuille.nomAssure || `Patient #${selectedFeuille.patientId}`}</p>
                      <p className="text-ink-muted">NSS: {selectedFeuille.nssAssure || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-ink border-b border-ink/10 pb-1 mb-2">Médecin</h3>
                      <p className="text-ink-muted">Identifiant: MD-{selectedFeuille.medecinId}</p>
                      <p className="text-ink-muted">Consultation: #{selectedFeuille.consultationId}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-medium text-ink border-b border-ink/10 pb-1 mb-2">Détails Médicaux</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <span className="text-xs text-ink-muted block mb-1">Symptômes:</span>
                          <p className="text-sm bg-zinc-50 p-2 rounded border border-zinc-100 min-h-[3rem]">{selectedFeuille.symptome || 'Non spécifié'}</p>
                      </div>
                      <div>
                          <span className="text-xs text-ink-muted block mb-1">Diagnostic:</span>
                          <p className="text-sm bg-zinc-50 p-2 rounded border border-zinc-100 min-h-[3rem]">{selectedFeuille.diagnostic || 'Non spécifié'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-ink/10 pt-6 flex justify-between items-end">
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                        selectedFeuille.statut === 'Remboursé' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        Statut: {selectedFeuille.statut}
                      </span>
                    </div>
                    <div className="text-right flex items-baseline gap-3">
                      <span className="text-sm text-ink-muted">Total des soins:</span>
                      <span className="text-3xl font-display font-bold text-[#0055FF]">
                        {selectedFeuille.montantSoins ? selectedFeuille.montantSoins.toLocaleString('fr-FR') : 0} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
            
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
