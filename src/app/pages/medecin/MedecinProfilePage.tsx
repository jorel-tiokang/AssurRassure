import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Globe, Moon, Settings, Stethoscope } from "lucide-react"

export function MedecinProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-medium text-ink">Mon Profil</h1>
        <p className="text-ink-muted mt-1">Gérez vos informations professionnelles et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 border-transparent shadow-sm">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="h-24 w-24 bg-[#0055FF] rounded-full flex items-center justify-center text-white text-3xl font-display font-bold">
              DR
            </div>
            <div>
              <h2 className="text-xl font-medium text-ink">Dr. Kamga Alain</h2>
              <p className="text-sm text-ink-muted">a.kamga@example.com</p>
              <p className="text-xs font-mono text-ink-muted mt-1">RPPS: 10009876543</p>
              <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                Médecin Généraliste
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-transparent shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#0055FF]" /> Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-ink/5 rounded-md hover:border-[#0055FF]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-zinc-100 flex items-center justify-center rounded-full">
                    <Moon className="h-5 w-5 text-ink-muted" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink">Thème de l'application</h3>
                    <p className="text-sm text-ink-muted">Choisir l'apparence (Clair / Sombre)</p>
                  </div>
                </div>
                <select className="h-10 px-3 border border-ink/20 focus:ring-2 focus:ring-[#0055FF] bg-white text-sm outline-none">
                  <option>Clair</option>
                  <option>Sombre</option>
                  <option>Système</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-ink/5 rounded-md hover:border-[#0055FF]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-zinc-100 flex items-center justify-center rounded-full">
                    <Globe className="h-5 w-5 text-ink-muted" />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink">Langue</h3>
                    <p className="text-sm text-ink-muted">Langue de l'interface</p>
                  </div>
                </div>
                <select className="h-10 px-3 border border-ink/20 focus:ring-2 focus:ring-[#0055FF] bg-white text-sm outline-none">
                  <option>Français</option>
                  <option>English</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-transparent shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-[#0055FF]" /> Informations Professionnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Lieu d'exercice</span>
                <span className="font-medium text-ink">Centre Médical d'Odza</span>
              </div>
              <div className="flex justify-between border-b border-ink/5 pb-2">
                <span className="text-ink-muted">Téléphone professionnel</span>
                <span className="font-medium text-ink">+237 6 00 00 00 02</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
