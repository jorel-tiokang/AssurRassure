import { Outlet, Link, useLocation } from "react-router"
import { Users, LayoutDashboard, FileText, DollarSign, LogOut, Stethoscope } from "lucide-react"

export function AgentLayout() {
  const location = useLocation()

  const navItems = [
    { name: "Tableau de bord", path: "/agent/dashboard", icon: LayoutDashboard },
    { name: "Assurés", path: "/agent/assures", icon: Users },
    { name: "Médecins", path: "/agent/medecins", icon: Stethoscope },
    { name: "Feuilles de Maladie", path: "/agent/feuilles-maladies", icon: FileText },
    { name: "Tarifs", path: "/agent/tarifs", icon: DollarSign },
  ]

  return (
    <div className="flex min-h-screen bg-canvas font-sans">
      <aside className="w-64 bg-ink text-white flex flex-col border-r border-white/10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[#0055FF] rounded-sm flex items-center justify-center">
              <span className="font-display font-bold text-lg text-white leading-none">A</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">AssurRassure</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/agent/profil" className="flex items-center gap-3 px-3 py-3 hover:bg-white/5 transition-colors">
            <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">AG</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-white">Agent Admin</p>
              <p className="text-xs text-white/60 truncate">agent@assurrassure.cm</p>
            </div>
          </Link>
          <Link
            to="/login"
            className="mt-2 flex items-center gap-3 px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-ink/10 bg-surface flex items-center justify-between px-8">
          <h1 className="font-display text-xl font-medium tracking-tight text-ink">
            {navItems.find(i => location.pathname.startsWith(i.path))?.name || "Administration"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium px-2.5 py-1 bg-blue-50 text-[#0055FF] rounded-sm border border-[#0055FF]/20">
              Connecté
            </span>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
