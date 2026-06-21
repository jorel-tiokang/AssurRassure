import { Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card"
import { FileText, Banknote, CreditCard, Stethoscope, ArrowUpRight, Loader2 } from "lucide-react"
import { dashboardService } from "../../lib/services/dashboardService"

export function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardService.getStats
  })

  // Formatters
  const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M FCFA`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k FCFA`;
    return `${amount} FCFA`;
  }

  const calcPercentage = (part: number, total: number) => {
    if (!total || total === 0) return 0;
    return Math.round((part / total) * 100);
  }

  const totalPaiements = stats ? stats.repartitionPaiement.VIREMENT + stats.repartitionPaiement.CASH : 0;
  const pctVirement = stats ? calcPercentage(stats.repartitionPaiement.VIREMENT, totalPaiements) : 0;
  const pctCash = stats ? calcPercentage(stats.repartitionPaiement.CASH, totalPaiements) : 0;

  const totalMedecins = stats ? stats.repartitionMedecins.GENERALISTE + stats.repartitionMedecins.SPECIALISTE : 0;
  const pctGeneraliste = stats ? calcPercentage(stats.repartitionMedecins.GENERALISTE, totalMedecins) : 0;
  const pctSpecialiste = stats ? calcPercentage(stats.repartitionMedecins.SPECIALISTE, totalMedecins) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0055FF]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Impossible de charger les statistiques du tableau de bord.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Page Header is handled by Layout, we just show content */}
      
      <div className="flex gap-4">
        <Link to="/agent/assures/medecin-traitant" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0055FF] text-white hover:bg-blue-600 h-10 px-4 py-2">
          Assigner un médecin traitant
        </Link>
        <Link to="/agent/feuilles-maladies/imprimer" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          Imprimer une feuille de maladie
        </Link>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#0055FF] text-white border-transparent">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80">Feuilles en attente</CardDescription>
            <CardTitle className="text-4xl text-white">{stats?.feuillesEnAttente || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <FileText className="h-4 w-4" />
              <span>À traiter aujourd'hui</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Montant remboursé (Ce mois)</CardDescription>
            <CardTitle className="text-3xl text-ink">{formatMoney(stats?.montantRembourse || 0)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
              <span>Donnée en temps réel</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paiements Virement</CardDescription>
            <CardTitle className="text-3xl text-ink">{pctVirement}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Banknote className="h-4 w-4" />
              <span>{pctVirement >= pctCash ? "Majoritaire" : "Minoritaire"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paiements Cash</CardDescription>
            <CardTitle className="text-3xl text-ink">{pctCash}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <CreditCard className="h-4 w-4" />
              <span>{pctCash > pctVirement ? "Majoritaire" : "Minoritaire"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recents Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Derniers remboursements</CardTitle>
            <CardDescription>Historique récent des transactions (données d'exemple)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-ink-muted uppercase bg-zinc-50 border-b border-ink/5">
                  <tr>
                    <th className="px-4 py-3 font-medium">Assuré</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Montant</th>
                    <th className="px-4 py-3 font-medium">Mode</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {stats?.derniersRemboursements?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">Aucun remboursement récent.</td>
                    </tr>
                  ) : (
                    stats?.derniersRemboursements?.map((row, i) => (
                      <tr key={i} className="transition-colors">
                        <td className="px-4 py-4 font-medium text-ink">{row.nom}</td>
                        <td className="px-4 py-4 text-ink-muted">{row.date}</td>
                        <td className="px-4 py-4 font-medium">{row.montant}</td>
                        <td className="px-4 py-4">
                          <span className="text-xs px-2 py-1 bg-zinc-100 text-ink rounded-sm">
                            {row.mode}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-sm">
                            Remboursé
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Panel */}
        <Card className="bg-zinc-100 border-transparent">
          <CardHeader>
            <CardTitle className="text-xl">Médecins consultés</CardTitle>
            <CardDescription>Répartition globale selon les feuilles traitées</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Généralistes</span>
                <span className="text-ink-muted">{pctGeneraliste}%</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                <div className="h-full bg-[#0055FF] transition-all duration-1000" style={{ width: `${pctGeneraliste}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Spécialistes</span>
                <span className="text-ink-muted">{pctSpecialiste}%</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                <div className="h-full bg-ink transition-all duration-1000" style={{ width: `${pctSpecialiste}%` }} />
              </div>
            </div>

            <div className="p-4 bg-white mt-8 flex gap-4 items-center">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 rounded-full">
                <Stethoscope className="h-5 w-5" />
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Les remboursements pour spécialistes se font à <span className="font-medium text-ink">80%</span> du tarif conventionné contre <span className="font-medium text-ink">100%</span> pour les généralistes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
