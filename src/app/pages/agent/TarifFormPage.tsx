import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/Input"
import { ArrowLeft, Save } from "lucide-react"

export function TarifFormPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nom: "",
    couverture: "",
    plafond: "",
    primeMensuelle: "",
    statut: "Actif"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here we would normally save to the backend
    navigate("/agent/tarifs")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link to="/agent/tarifs">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-display font-medium text-ink">Nouveau Plan Tarifaire</h1>
          <p className="text-ink-muted mt-1">Définissez les conditions d'un nouveau plan d'assurance.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-ink/10 shadow-sm p-6 sm:p-8 space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-display font-medium text-ink border-b border-ink/10 pb-2">Informations Générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="nom" className="text-sm font-medium text-ink">Nom du Plan <span className="text-red-500">*</span></label>
              <Input 
                id="nom" 
                placeholder="Ex: Individuel Premium" 
                required 
                value={formData.nom}
                onChange={e => setFormData({...formData, nom: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="statut" className="text-sm font-medium text-ink">Statut <span className="text-red-500">*</span></label>
              <select 
                id="statut"
                className="flex h-12 w-full border border-ink/20 bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                value={formData.statut}
                onChange={e => setFormData({...formData, statut: e.target.value})}
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-display font-medium text-ink border-b border-ink/10 pb-2">Conditions Financières</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="couverture" className="text-sm font-medium text-ink">Taux de Couverture (%) <span className="text-red-500">*</span></label>
              <Input 
                id="couverture" 
                placeholder="Ex: 80" 
                required 
                type="number"
                min="0"
                max="100"
                value={formData.couverture}
                onChange={e => setFormData({...formData, couverture: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="plafond" className="text-sm font-medium text-ink">Plafond Annuel (FCFA) <span className="text-red-500">*</span></label>
              <Input 
                id="plafond" 
                placeholder="Ex: 1500000" 
                required 
                type="number"
                min="0"
                value={formData.plafond}
                onChange={e => setFormData({...formData, plafond: e.target.value})}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="prime" className="text-sm font-medium text-ink">Prime Mensuelle (FCFA) <span className="text-red-500">*</span></label>
              <Input 
                id="prime" 
                placeholder="Ex: 25000" 
                required 
                type="number"
                min="0"
                value={formData.primeMensuelle}
                onChange={e => setFormData({...formData, primeMensuelle: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4 border-t border-ink/10">
          <Button type="button" variant="ghost" asChild>
            <Link to="/agent/tarifs">Annuler</Link>
          </Button>
          <Button type="submit" variant="accent">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer le Plan
          </Button>
        </div>
      </form>
    </div>
  )
}
