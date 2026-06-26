import { useState } from "react"
import { Outlet, Link, useLocation } from "react-router"
import { LayoutDashboard, FileText, PlusCircle, LogOut, Users, Bell, Menu, X } from "lucide-react"

export function MedecinLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Conditionally render "Mes Patients" depending on specialist status
  const isSpecialiste = false;

  const navItems = [
    { name: "Tableau de bord", path: "/medecin/dashboard", icon: LayoutDashboard },
    ...(isSpecialiste ? [] : [{ name: "Mes Patients", path: "/medecin/patients", icon: Users }]),
    { name: "Mes Consultations", path: "/medecin/consultations", icon: FileText },
  ]

  return (
    <div className="theme-dashboard squares_bg flex min-h-screen">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-ink/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-ink text-white flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex items-start justify-between">
          <div>
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">AssurRassure</span>
            </Link>
            <div className="mt-2 text-xs text-white/50 tracking-widest uppercase font-medium">Espace Médecin</div>
          </div>
          <button 
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isReallyActive = location.pathname.startsWith(item.path) && (item.path !== '/medecin/consultations' || location.pathname === '/medecin/consultations') || (item.path === '/medecin/consultations' && location.pathname.startsWith('/medecin/consultations'))

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${isReallyActive
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
          <Link to="/medecin/profil" className="flex items-center gap-3 px-3 py-3 hover:bg-white/5 transition-colors">
            <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">DR</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-white">Dr. Kamga Alain</p>
              <p className="text-xs text-white/60 truncate">RPPS: MED-789012</p>
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

      <main className="flex-1 flex flex-col min-h-screen w-full md:w-auto">
        <header className="h-16 border-b border-ink/10 bg-surface flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-sm hover:bg-ink/5 text-ink-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink truncate max-w-[200px] md:max-w-none">
              {navItems.find(i => {
                if (i.path === '/medecin/consultations') return location.pathname.startsWith('/medecin/consultations')
                return location.pathname.startsWith(i.path)
              })?.name || "Espace Médecin"}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            {/* Removed notifications and actif badges here */}
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
